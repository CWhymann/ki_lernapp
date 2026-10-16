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
    ['Modell', 'Kontextfenster'].includes(term.name),
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
