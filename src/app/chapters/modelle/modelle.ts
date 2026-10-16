import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { GRUNDBEGRIFFE } from '../../shared/glossary/begriffe';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

interface Task {
  id: string;
  label: string;
  type: string;
  explanation: string;
  examples: string;
  note: string;
}

type TierId = 'leicht' | 'mittel' | 'top';

interface Tier {
  id: TierId;
  name: string;
  strength: string;
  examples: string;
  price: string;
}

type Access = 'geschlossen' | 'offen' | 'gemischt';

type AccessFilter = 'alle' | 'geschlossen' | 'offen';

interface Provider {
  id: string;
  name: string;
  country: string;
  access: Access;
  models: string;
  strength: string;
  usage: string;
}

interface FilterOption {
  id: AccessFilter;
  label: string;
}

/**
 * Picks the model tier that fits the difficulty and the number of requests.
 * @param difficulty Difficulty of the task from 1 to 3.
 * @param volume Number of requests from 1 to 3.
 * @returns Identifier of the recommended tier.
 */
function tierFor(difficulty: number, volume: number): TierId {
  if (difficulty <= 1) return 'leicht';
  if (difficulty === 2) return volume >= 3 ? 'leicht' : 'mittel';
  return volume >= 3 ? 'mittel' : 'top';
}

@Component({
  selector: 'app-modelle',
  imports: [FormsModule, RouterLink, Quiz, Glossary],
  templateUrl: './modelle.html',
  styleUrl: './modelle.css',
})
export class Modelle {
  tasks: Task[] = [
    {
      id: 'text',
      label: 'Texte schreiben und Fragen beantworten',
      type: 'Sprachmodell',
      explanation:
        'Ein Sprachmodell (LLM) bekommt Text und liefert Text. Es schreibt, fasst zusammen, übersetzt und beantwortet Fragen.',
      examples:
        'Claude (Anthropic), GPT (OpenAI), Gemini (Google), Grok (xAI), Mistral Large 4, DeepSeek V4',
      note: 'Bei Alltagsaufgaben liegen die großen Anbieter nah beieinander. Probier mehrere aus.',
    },
    {
      id: 'code',
      label: 'Programmieren',
      type: 'Sprachmodell mit Coding-Stärke',
      explanation:
        'Auch beim Programmieren arbeitet ein Sprachmodell. Es liest und schreibt Code und kann in Entwicklerwerkzeugen mehrere Schritte selbstständig erledigen.',
      examples: 'Claude Opus 5.5 und Sonnet 5.5, GPT-6.1 Sol, Grok 4.7, DeepSeek V4, Kimi K3',
      note: 'Für große Projekte nimmt man oft ein Top-Modell, für kleine Aufgaben reicht die Mittelklasse.',
    },
    {
      id: 'bild-lesen',
      label: 'Bilder oder PDFs erklären lassen',
      type: 'Multimodales Modell',
      explanation:
        'Ein multimodales Modell versteht mehrere Eingabearten gleichzeitig, zum Beispiel Text, Bilder und Dokumente.',
      examples: 'Gemini, Claude und GPT können Bilder und Dokumente lesen',
      note: 'Prüfe wichtige Angaben aus Bildern nach. Auch hier gibt es Halluzinationen.',
    },
    {
      id: 'bild',
      label: 'Bilder erzeugen',
      type: 'Bildmodell',
      explanation:
        'Ein Bildmodell bekommt eine Beschreibung und erzeugt daraus ein neues Bild. Es lernt dafür aus sehr vielen Bildern mit Beschreibungen.',
      examples: 'Midjourney, die Bildmodelle von OpenAI (in ChatGPT) und von Google (in Gemini)',
      note: 'Die Namen und Versionen wechseln hier besonders schnell. Achte auf Lizenz und Nutzungsrechte der Bilder.',
    },
    {
      id: 'video',
      label: 'Videos erzeugen',
      type: 'Videomodell',
      explanation:
        'Ein Videomodell erzeugt aus Text oder einem Standbild kurze Clips. Es muss neben dem Aussehen auch Bewegung über viele Bilder hinweg stimmig halten.',
      examples: 'Veo (Google), Runway, Kling',
      note: 'Gesichter und Hände wirken über mehrere Schnitte hinweg oft noch uneinheitlich.',
    },
    {
      id: 'sprache',
      label: 'Sprache in Text umwandeln oder sprechen',
      type: 'Audio- und Sprachmodell',
      explanation:
        'Ein Sprachmodell für Audio wandelt gesprochene Sprache in Text um oder spricht Text mit synthetischer Stimme. Manche führen Gespräche in Echtzeit.',
      examples: 'Gemini Live, Voxtral (Mistral), Grok Voice 3.0',
      note: 'Für vertrauliche Aufnahmen kann ein offenes Modell auf dem eigenen Rechner sinnvoll sein.',
    },
    {
      id: 'offline',
      label: 'Alles offline auf dem eigenen Rechner',
      type: 'Offenes Modell (Open-Weight)',
      explanation:
        'Bei einem offenen Modell sind die gelernten Gewichte zum Download frei. Du betreibst es selbst, deine Daten verlassen den Rechner nicht.',
      examples: 'DeepSeek V4, Qwen3.8, Kimi, GLM, Mistral Small 4, Llama 4',
      note: 'Große Varianten brauchen starke Hardware. Kleinere Varianten laufen auch auf normalen Rechnern.',
    },
  ];

  taskChoice = signal('text');

  selectedTask = computed(
    () => this.tasks.find((task) => task.id === this.taskChoice()) ?? this.tasks[0],
  );

  providers: Provider[] = [
    {
      id: 'anthropic',
      name: 'Anthropic',
      country: 'USA',
      access: 'geschlossen',
      models: 'Claude Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5',
      strength: 'Programmieren, lange Aufgaben, Agenten, sorgfältiges Schreiben.',
      usage: 'Claude-App und Webseite, Schnittstelle für Entwickler.',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      country: 'USA',
      access: 'gemischt',
      models: 'GPT-6 Astra, GPT-6.1 Sol, GPT-6 Luna, dazu das offene gpt-oss',
      strength: 'Allrounder mit Text, Bild und Sprache in einer App.',
      usage: 'ChatGPT, Schnittstelle. gpt-oss zum Download.',
    },
    {
      id: 'google',
      name: 'Google',
      country: 'USA',
      access: 'gemischt',
      models: 'Gemini 4 Argon (teils eingeschränkt), Gemini 3.8 Flash, offen: Gemma 4',
      strength: 'Multimodal, Bilder, Video und lange Dokumente, eng mit Google-Diensten verzahnt.',
      usage: 'Gemini-App, Google-Dienste, Schnittstelle. Gemma zum Download.',
    },
    {
      id: 'xai',
      name: 'xAI',
      country: 'USA',
      access: 'geschlossen',
      models: 'Grok 4.7, Grok 4.6, Grok Voice 3.0',
      strength: 'Gutes Preis-Leistungs-Verhältnis beim Programmieren, Zugriff auf Daten von X.',
      usage: 'Grok-App und X, Schnittstelle.',
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      country: 'Frankreich',
      access: 'offen',
      models: 'Mistral Large 4 (Vorschau), Medium 3.5, Small 4',
      strength: 'Betrieb in Europa, viele Sprachen, gut zum Selbst-Hosten.',
      usage: 'Mistral-App, Schnittstelle, Download der offenen Modelle.',
    },
    {
      id: 'meta',
      name: 'Meta',
      country: 'USA',
      access: 'offen',
      models: 'Llama 4 (Scout, Maverick), inzwischen eine ältere Generation',
      strength: 'Große Verbreitung, viele Werkzeuge und Anleitungen dafür.',
      usage: 'Download unter der Llama-Lizenz, über Cloud-Anbieter.',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      country: 'China',
      access: 'offen',
      models: 'DeepSeek V4 Pro, V4.1 Flash',
      strength: 'Sehr günstig, gut beim Schlussfolgern und bei langen Texten.',
      usage: 'Chat-App, Schnittstelle, Download unter MIT-Lizenz.',
    },
    {
      id: 'qwen',
      name: 'Alibaba (Qwen)',
      country: 'China',
      access: 'gemischt',
      models: 'Qwen3.8 (Max, Flash, 27B)',
      strength: 'Kleine Modelle, die auch auf dem eigenen Rechner laufen.',
      usage: 'Qwen-App, Schnittstelle. Kleinere Modelle zum Download.',
    },
    {
      id: 'kimi',
      name: 'Moonshot AI (Kimi)',
      country: 'China',
      access: 'offen',
      models: 'Kimi K3, K2.7 Code',
      strength: 'Programmieren und lange Abläufe mit vielen Werkzeug-Aufrufen.',
      usage: 'Kimi-App, Schnittstelle, Download.',
    },
    {
      id: 'weitere',
      name: 'Weitere aus China',
      country: 'China',
      access: 'offen',
      models: 'GLM-5.3 (Zhipu AI), MiniMax M3',
      strength: 'Starke offene Modelle, die mit den Großen mithalten.',
      usage: 'Meist Download oder über Vermittler wie OpenRouter.',
    },
  ];

  filterOptions: FilterOption[] = [
    { id: 'alle', label: 'Alle' },
    { id: 'geschlossen', label: 'Geschlossen' },
    { id: 'offen', label: 'Offen (Open-Weight)' },
  ];

  accessFilter = signal<AccessFilter>('alle');

  visibleProviders = computed(() => {
    const filter = this.accessFilter();
    if (filter === 'alle') return this.providers;
    return this.providers.filter(
      (provider) => provider.access === filter || provider.access === 'gemischt',
    );
  });

  tiers: Tier[] = [
    {
      id: 'leicht',
      name: 'Leichtes Modell',
      strength:
        'Sehr schnell und günstig. Reicht für Sortieren, Zusammenfassen, einfache Antworten und das Verteilen von Anfragen.',
      examples: 'Claude Haiku 5.5, GPT-6 Luna, Gemini 3.8 Flash',
      price: 'meist unter 1 US-Dollar pro Million Eingabe-Tokens',
    },
    {
      id: 'mittel',
      name: 'Mittelklasse',
      strength:
        'Guter Allrounder für Alltag, Schreiben und Programmieren. Liegt oft nah an den Top-Modellen, kostet aber deutlich weniger.',
      examples: 'Claude Sonnet 5.5, GPT-6.1 Sol',
      price: 'etwa 2 US-Dollar pro Million Eingabe-Tokens',
    },
    {
      id: 'top',
      name: 'Top-Modell',
      strength:
        'Für schwierige, lange Aufgaben, die viel Urteilsvermögen brauchen, zum Beispiel große Programmierprojekte oder Recherche über viele Dokumente.',
      examples:
        'Claude Opus 5.5, Claude Fable 5.1, GPT-6 Astra, Gemini 4 Argon (teils noch eingeschränkt verfügbar)',
      price: 'etwa 4 bis 10 US-Dollar pro Million Eingabe-Tokens',
    },
  ];

  difficulty = signal(2);
  volume = signal(1);

  recommendedTier = computed(() => {
    const id = tierFor(Number(this.difficulty()), Number(this.volume()));
    return this.tiers.find((tier) => tier.id === id) ?? this.tiers[1];
  });

  mixNote = computed(() => {
    const difficulty = Number(this.difficulty());
    const volume = Number(this.volume());

    if (difficulty === 3 && volume === 3) {
      return 'Schwer und in großer Menge: Die Mittelklasse übernimmt die Masse, nur die schwierigsten Fälle gehen an ein Top-Modell.';
    }
    if (difficulty === 2 && volume === 3) {
      return 'Bei sehr vielen Anfragen zählt jeder Cent. Ein leichtes Modell erledigt mittelschwere Aufgaben oft gut genug. Prüfe mit Stichproben, ob die Qualität reicht.';
    }
    return null;
  });

  glossar: GlossaryTerm[] = GRUNDBEGRIFFE.filter((term: GlossaryTerm) =>
    ['Modell', 'Parameter', 'Kontextfenster'].includes(term.name),
  );

  /**
   * Selects the task in the model finder.
   * @param id Identifier of the selected task.
   */
  chooseTask(id: string) {
    this.taskChoice.set(id);
  }

  /**
   * Sets the access filter of the provider overview.
   * @param id Identifier of the selected filter.
   */
  setFilter(id: AccessFilter) {
    this.accessFilter.set(id);
  }

  /**
   * Returns the German label for the access type of a provider.
   * @param access Access type of the provider.
   * @returns Text label for the access type.
   */
  accessLabel(access: Access): string {
    if (access === 'geschlossen') return 'Geschlossen';
    if (access === 'offen') return 'Offen';
    return 'Teils offen';
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Was ist ein KI-Modell?',
      options: [
        'Das Ergebnis des Trainings, das Eingaben in Ausgaben umwandelt',
        'Ein Programm, das nur Bilder speichert',
        'Ein Webbrowser mit KI-Suche',
      ],
      correct: 0,
      explanation:
        'Das Modell ist das fertig trainierte Programm. Es wendet die gelernten Muster auf neue Eingaben an.',
    },
    {
      question: 'Welcher Modelltyp passt zu "Text rein, Bild raus"?',
      options: ['Ein Spamfilter', 'Ein Bildmodell', 'Ein reines Rechenmodell'],
      correct: 1,
      explanation:
        'Ein Bildmodell erzeugt aus einer Beschreibung ein neues Bild. Ein Sprachmodell liefert dagegen Text.',
    },
    {
      question: 'Was bedeutet multimodal?',
      options: [
        'Das Modell läuft auf mehreren Rechnern',
        'Das Modell versteht mehrere Eingabearten, zum Beispiel Text und Bilder',
        'Das Modell spricht mehrere Sprachen',
      ],
      correct: 1,
      explanation:
        'Multimodal bezieht sich auf die Art der Daten: Text, Bild, Audio oder Dokumente zusammen.',
    },
    {
      question: 'Wie sieht der Modellmarkt aus?',
      options: [
        'Es gibt nur wenige Modelle von zwei Firmen',
        'Es gibt viele Anbieter aus mehreren Ländern, mit geschlossenen und offenen Modellen',
        'Nur Modelle aus den USA sind offen',
      ],
      correct: 1,
      explanation:
        'Neben Anthropic, OpenAI und Google gibt es zum Beispiel Mistral aus Frankreich und DeepSeek, Qwen und Kimi aus China. Viele davon sind offen.',
    },
    {
      question: 'Warum nimmt man für viele einfache Anfragen oft ein leichtes Modell?',
      options: [
        'Es ist immer genauer',
        'Es ist schneller und deutlich günstiger und reicht für einfache Aufgaben',
        'Es braucht keine Tokens',
      ],
      correct: 1,
      explanation:
        'Bei Massenaufgaben summieren sich die Kosten. Wenn die Qualität reicht, spart ein leichtes Modell Zeit und Geld.',
    },
    {
      question: 'Was bedeutet Open-Weight?',
      options: [
        'Die gelernten Gewichte sind zum Download frei, die Trainingsdaten meist nicht',
        'Das Modell ist komplett Open Source inklusive aller Trainingsdaten',
        'Das Modell ist kostenlos und ohne Regeln nutzbar',
      ],
      correct: 0,
      explanation:
        'Bei Open-Weight sind nur die Gewichte öffentlich. Lizenzen können trotzdem Einschränkungen enthalten.',
    },
    {
      question: 'Wofür eignet sich ein offenes Modell besonders?',
      options: [
        'Wenn die Daten auf dem eigenen Rechner bleiben sollen',
        'Wenn man keinen Rechner hat',
        'Wenn man nie etwas einrichten möchte',
      ],
      correct: 0,
      explanation:
        'Ein offenes Modell läuft bei dir selbst. Dafür musst du es einrichten und brauchst passende Hardware.',
    },
    {
      question: 'Wie findest du das passende Modell?',
      options: [
        'Immer das neueste und teuerste nehmen',
        'Nach Aufgabe wählen und mit eigenen Beispielen testen',
        'Nach dem bekanntesten Namen entscheiden',
      ],
      correct: 1,
      explanation:
        'Ranglisten messen oft andere Aufgaben. Ein Test mit deinen eigenen Beispielen zeigt am besten, was passt.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Sehr gut. Du weißt, welches Modell für welche Aufgabe gedacht ist.',
    gut: 'Gut. Probier den Aufgaben-Finder und die Modell-Landkarte noch einmal aus.',
    schwach: 'Geh die Aufgaben oben durch und lies, welcher Modelltyp dazu passt.',
  };
}
