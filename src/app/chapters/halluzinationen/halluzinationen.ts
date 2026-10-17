import { Component, computed, signal } from '@angular/core';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { GRUNDBEGRIFFE } from '../../shared/glossary/begriffe';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

interface Claim {
  text: string;
  isTrue: boolean;
  explanation: string;
}

interface WordChoice {
  word: string;
  percent: number;
}

interface NextWordCase {
  id: 'bekannt' | 'unbekannt';
  label: string;
  start: string;
  choices: WordChoice[];
}

interface TemperatureWord {
  word: string;
  logit: number;
}

interface TemperatureRow {
  word: string;
  percent: number;
  label: string;
  sampledPercent: number;
}

interface TemperaturePick {
  word: string;
  n: number;
}

@Component({
  selector: 'app-halluzinationen',
  imports: [Quiz, Glossary],
  templateUrl: './halluzinationen.html',
  styleUrl: './halluzinationen.css',
})
export class Halluzinationen {
  claims: Claim[] = [
    {
      text: 'Der Eiffelturm wurde 1889 fertiggestellt.',
      isTrue: true,
      explanation: 'Stimmt - zur Weltausstellung 1889 in Paris.',
    },
    {
      text: 'Albert Einstein erhielt den Nobelpreis für die Relativitätstheorie.',
      isTrue: false,
      explanation:
        'Erfunden - er bekam ihn 1921 für den photoelektrischen Effekt, nicht für die Relativitätstheorie.',
    },
    {
      text: 'Die Great Firewall of China wurde 1998 unter dem Namen "Golden Shield Project" gestartet.',
      isTrue: true,
      explanation: 'Stimmt - so hiess das offizielle Projekt tatsächlich.',
    },
    {
      text: 'Die erste E-Mail wurde 1965 von Bill Gates verschickt.',
      isTrue: false,
      explanation:
        'Erfunden - die erste E-Mail verschickte Ray Tomlinson 1971, Bill Gates hatte damit nichts zu tun.',
    },
  ];

  answered = signal<Record<number, boolean>>({});

  nextWordCases: NextWordCase[] = [
    {
      id: 'bekannt',
      label: 'Bekannte Frage',
      start: 'Wer schrieb das Drama "Faust"? Die Antwort beginnt mit:',
      choices: [
        { word: 'Goethe', percent: 94 },
        { word: 'Schiller', percent: 3 },
        { word: 'Lessing', percent: 2 },
        { word: 'Kafka', percent: 1 },
      ],
    },
    {
      id: 'unbekannt',
      label: 'Unbekannte Frage',
      start:
        'Wie hieß 1923 der Bürgermeister der kleinen Gemeinde Brunnenau? Die Antwort beginnt mit:',
      choices: [
        { word: 'Müller', percent: 24 },
        { word: 'Schmidt', percent: 22 },
        { word: 'Weber', percent: 20 },
        { word: 'Wagner', percent: 18 },
        { word: 'Fischer', percent: 16 },
      ],
    },
  ];

  caseChoice = signal<NextWordCase['id']>('bekannt');

  pickedWord = signal<string | null>(null);

  currentCase = computed(
    () =>
      this.nextWordCases.find((option) => option.id === this.caseChoice()) ?? this.nextWordCases[0],
  );

  wordNote = computed(() => {
    const picked = this.pickedWord();
    if (picked === null) return null;

    const current = this.currentCase();

    if (current.id === 'unbekannt') {
      return `"${picked}" klingt als Antwort genauso sicher wie jedes andere Wort in der Liste. Kein Wort liegt klar vorn: Die KI kennt die Antwort nicht, muss aber trotzdem eines setzen. Genau so entsteht eine Halluzination.`;
    }

    if (picked === current.choices[0].word) {
      return 'Ein Wort liegt klar vorn. Hier steckt das Wissen im Modell, und die Antwort stimmt.';
    }

    return `"${picked}" ist hier sehr unwahrscheinlich. Meist setzt die KI das wahrscheinlichste Wort, ein Rest Zufall kann aber auch ein anderes treffen. Deshalb kann dieselbe Frage mal richtig und mal falsch beantwortet werden.`;
  });

  glossar: GlossaryTerm[] = GRUNDBEGRIFFE.filter((term: GlossaryTerm) =>
    ['Modell', 'Kontextfenster', 'Temperatur'].includes(term.name),
  );

  /**
   * Stores whether the guess for a claim was correct.
   * @param index Position of the claim.
   * @param guessTrue True if the user thinks the claim is true.
   */
  answer(index: number, guessTrue: boolean) {
    const claim = this.claims[index];
    this.answered.update((current) => ({ ...current, [index]: guessTrue === claim.isTrue }));
  }

  /**
   * Checks whether a claim has already been answered.
   * @param index Position of the claim.
   * @returns True if the claim was answered.
   */
  isAnswered(index: number): boolean {
    return this.answered()[index] !== undefined;
  }

  /**
   * Checks whether the answer for a claim was correct.
   * @param index Position of the claim.
   * @returns True if the guess was correct.
   */
  wasCorrect(index: number): boolean {
    return this.answered()[index] === true;
  }

  /**
   * Switches to another question and clears the picked word.
   * @param id Identifier of the selected question.
   */
  chooseCase(id: NextWordCase['id']) {
    this.caseChoice.set(id);
    this.pickedWord.set(null);
  }

  /**
   * Stores the word the user picked as the next word.
   * @param word The picked word.
   */
  pickWord(word: string) {
    this.pickedWord.set(word);
  }

  temperature = signal(1);

  rollCounts = signal<Record<string, number>>({});

  lastPick = signal<TemperaturePick | null>(null);

  private pickNumber = 0;

  temperatureWords: TemperatureWord[] = [
    { word: 'blau', logit: 3.0 },
    { word: 'grau', logit: 2.4 },
    { word: 'bewölkt', logit: 2.0 },
    { word: 'klar', logit: 1.5 },
    { word: 'rot', logit: 0.8 },
    { word: 'Käse', logit: 0 },
  ];

  probabilities = computed(() => {
    const temp = this.temperature();
    const logits = this.temperatureWords.map((entry) => entry.logit);

    if (temp === 0) {
      const top = logits.indexOf(Math.max(...logits));
      return logits.map((_, index) => (index === top ? 1 : 0));
    }

    const scaled = logits.map((logit) => logit / temp);
    const max = Math.max(...scaled);
    const exps = scaled.map((value) => Math.exp(value - max));
    const sum = exps.reduce((total, value) => total + value, 0);
    return exps.map((value) => value / sum);
  });

  total = computed(() => Object.values(this.rollCounts()).reduce((sum, count) => sum + count, 0));

  rows = computed<TemperatureRow[]>(() => {
    const probs = this.probabilities();
    const counts = this.rollCounts();
    const total = this.total();

    return this.temperatureWords.map((entry, index) => ({
      word: entry.word,
      percent: probs[index] * 100,
      label: this.formatPercent(probs[index] * 100),
      sampledPercent: total === 0 ? 0 : ((counts[entry.word] ?? 0) / total) * 100,
    }));
  });

  favorite = computed(() => {
    const probs = this.probabilities();
    const top = probs.indexOf(Math.max(...probs));
    return { word: this.temperatureWords[top].word, label: this.formatPercent(probs[top] * 100) };
  });

  diversityPercent = computed(() => {
    const probs = this.probabilities();
    const entropy = probs.reduce((sum, p) => (p > 0 ? sum - p * Math.log(p) : sum), 0);
    return Math.round((entropy / Math.log(probs.length)) * 100);
  });

  fillPercent = computed(() => (this.temperature() / 2) * 100);

  accent = computed(() => `hsl(${Math.round(190 - (this.temperature() / 2) * 170)} 95% 60%)`);

  temperatureLabel = computed(() => this.temperature().toFixed(1).replace('.', ','));

  mode = computed(() => {
    const temp = this.temperature();
    if (temp === 0) return 'Deterministisch';
    if (temp <= 0.5) return 'Präzise';
    if (temp <= 1.2) return 'Ausgewogen';
    if (temp <= 1.7) return 'Kreativ';
    return 'Chaos';
  });

  temperatureNote = computed(() => {
    const temp = this.temperature();
    if (temp === 0) {
      return 'Bei 0 würfelt die KI nicht. Sie nimmt immer das wahrscheinlichste Wort, und jede Wiederholung der Frage liefert dieselbe Antwort. Ist dieses Wort falsch, bleibt es falsch.';
    }
    if (temp <= 0.5) {
      return 'Das wahrscheinlichste Wort gewinnt fast jedes Mal. Antworten bleiben gleichbleibend und vorhersehbar.';
    }
    if (temp <= 1.2) {
      return 'Das Wahrscheinlichste liegt vorn, aber Alternativen kommen regelmäßig vor. So klingen Antworten natürlich und abwechslungsreich.';
    }
    if (temp <= 1.7) {
      return 'Die Wahrscheinlichkeiten rücken zusammen. Ungewöhnliche Wörter kommen oft vor: das bringt Abwechslung, macht Fehler aber wahrscheinlicher.';
    }
    return 'Fast alle Wörter haben ähnliche Chancen, auch unsinnige wie "Käse". Die Antworten werden unberechenbar, und Halluzinationen werden deutlich wahrscheinlicher.';
  });

  /**
   * Sets the temperature from the slider and restarts the roll statistics.
   * @param event Input event of the range slider.
   */
  onTemperature(event: Event) {
    const input = event.target as HTMLInputElement;
    this.temperature.set(Number(input.value));
    this.rollCounts.set({});
    this.lastPick.set(null);
  }

  /**
   * Draws words according to the current probabilities and adds them to the statistics.
   * @param times Number of draws.
   */
  roll(times: number) {
    const probs = this.probabilities();
    const counts = { ...this.rollCounts() };
    let word = '';

    for (let i = 0; i < times; i++) {
      word = this.drawWord(probs);
      counts[word] = (counts[word] ?? 0) + 1;
    }

    this.rollCounts.set(counts);
    this.pickNumber += 1;
    this.lastPick.set({ word, n: this.pickNumber });
  }

  /**
   * Clears all draws and the last picked word.
   */
  resetRolls() {
    this.rollCounts.set({});
    this.lastPick.set(null);
  }

  /**
   * Draws one word at random, weighted by the given probabilities.
   * @param probs Probability of each word, in the order of temperatureWords.
   * @returns The drawn word.
   */
  private drawWord(probs: number[]): string {
    let remaining = Math.random();

    for (let i = 0; i < probs.length; i++) {
      remaining -= probs[i];
      if (remaining < 0) return this.temperatureWords[i].word;
    }

    return this.temperatureWords[probs.length - 1].word;
  }

  /**
   * Formats a percentage with one decimal and a German decimal comma.
   * @param value Percentage between 0 and 100.
   * @returns The formatted number.
   */
  private formatPercent(value: number): string {
    return value.toFixed(1).replace('.', ',');
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Was ist eine Halluzination bei einer KI?',
      options: [
        'Ein Fehler im Stromnetz',
        'Eine selbstbewusst klingende, aber falsche Aussage',
        'Ein Bild, das die KI gemalt hat',
      ],
      correct: 1,
      explanation:
        'Halluzinationen sind Aussagen, die falsch sind, aber genauso sicher klingen wie richtige.',
    },
    {
      question: 'Warum halluziniert eine KI?',
      options: [
        'Sie lügt absichtlich',
        'Sie erzeugt Text, der plausibel klingt, ohne die Wahrheit zu prüfen',
        'Sie hat keine Daten gespeichert',
      ],
      correct: 1,
      explanation:
        'Die KI bewertet nicht, ob etwas wahr ist. Sie erzeugt Text, der statistisch passend klingt.',
    },
    {
      question: 'Wo passieren Halluzinationen am häufigsten?',
      options: [
        'Bei Namen, Daten, Zahlen und Zitaten',
        'Bei einfachen Begrüßungen',
        'Bei der Rechtschreibung',
      ],
      correct: 0,
      explanation:
        'Genau bei konkreten Angaben wie Namen, Daten und Zahlen passieren die meisten Fehler.',
    },
    {
      question: 'Was hilft gegen Halluzinationen?',
      options: [
        'Wichtige Fakten gegen eine verlässliche Quelle prüfen',
        'Die Antwort glauben, wenn sie sicher klingt',
        'Die gleiche Frage dreimal stellen',
      ],
      correct: 0,
      explanation:
        'Eine verlässliche Quelle ist der beste Check. Dieselbe Frage zu wiederholen liefert oft dieselbe falsche Antwort.',
    },
    {
      question: 'Was sagt ein selbstbewusster Ton über eine Antwort aus?',
      options: [
        'Die Antwort ist sicher richtig',
        'Über die Richtigkeit sagt er nichts',
        'Die KI hat die Quelle geprüft',
      ],
      correct: 1,
      explanation: 'Auch falsche Aussagen klingen sicher. Der Ton sagt nichts über die Wahrheit.',
    },
    {
      question: 'Welche Aussage über Zitate stimmt?',
      options: [
        'KI-Zitate sind immer echt',
        'Zitate aus KI-Antworten sollte man selbst nachprüfen',
        'Zitate erfindet eine KI nie',
      ],
      correct: 1,
      explanation:
        'Auch Zitate können erfunden sein. Bei wichtigen Zitaten lohnt sich immer die Prüfung an der Originalquelle.',
    },
    {
      question: 'Was passiert, wenn der KI eine Information fehlt?',
      options: [
        'Sie fragt einen Menschen um Rat',
        'Sie setzt trotzdem ein Wort, das plausibel klingt',
        'Sie bricht die Antwort immer ab',
      ],
      correct: 1,
      explanation:
        'Die KI muss immer ein nächstes Wort wählen. Fehlt das Wissen, entsteht Text, der passt, aber nicht stimmt.',
    },
    {
      question: 'Was ist der Unterschied zwischen Wissenslücke und Halluzination?',
      options: [
        'Die Wissenslücke ist die fehlende Information, die Halluzination die erfundene Antwort darauf',
        'Beides ist dasselbe',
        'Eine Halluzination gibt es nur bei Bildern',
      ],
      correct: 0,
      explanation:
        'Eine Lücke im Wissen ist normal. Zum Fehler wird sie erst, wenn die KI sie mit erfundenem Text füllt, statt sie zuzugeben.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du prüfst Fakten, bevor du ihnen glaubst.',
    gut: 'Gut. Lies die Erklärungen zu den Fragen, die du verpasst hast.',
    schwach: 'Probier die Aussagen oben noch einmal und achte auf die Erklärungen.',
  };
}
