import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

type TopicId = 'chatbot' | 'schleife' | 'werkzeuge' | 'freiheit' | 'gefahr';

type Kind = 'chatbot' | 'agent';

type Phase = 'denken' | 'handeln' | 'beobachten' | 'warten' | 'fertig';

type ToolId = 'search' | 'calendar' | 'mail';

type GuardId = 'rights' | 'approval' | 'marking';

interface Topic {
  id: TopicId;
  label: string;
  icon: string;
}

interface SortItem {
  text: string;
  kind: Kind;
  explanation: string;
}

interface AgentStep {
  phase: Phase;
  text: string;
  needsApproval?: boolean;
}

interface FreedomLevel {
  title: string;
  text: string;
  example: string;
  risk: string;
}

interface Outcome {
  title: string;
  text: string;
  tone: string;
}

const MAX_CONNECTIONS = 64;

@Component({
  selector: 'app-ki-agenten',
  imports: [RouterLink, Quiz, Glossary],
  templateUrl: './ki-agenten.html',
  styleUrl: './ki-agenten.css',
})
export class KiAgenten {
  topics: Topic[] = [
    { id: 'chatbot', label: 'Chatbot oder Agent?', icon: '💬' },
    { id: 'schleife', label: 'Die Schleife', icon: '🔁' },
    { id: 'werkzeuge', label: 'Werkzeuge und MCP', icon: '🧰' },
    { id: 'freiheit', label: 'Wie viel Freiheit?', icon: '🎚️' },
    { id: 'gefahr', label: 'Prompt Injection', icon: '⚠️' },
  ];

  topic = signal<TopicId>('chatbot');

  sorting: SortItem[] = [
    {
      text: 'Beantwortet eine Frage und ist danach fertig.',
      kind: 'chatbot',
      explanation: 'Chatbot. Er gibt Text aus und tut sonst nichts.',
    },
    {
      text: 'Liest deine Mails, sucht freie Termine und trägt sie in den Kalender ein.',
      kind: 'agent',
      explanation: 'Agent. Er nutzt Werkzeuge und führt selbst Schritte aus.',
    },
    {
      text: 'Schreibt dir einen Text, den du selbst kopierst und verschickst.',
      kind: 'chatbot',
      explanation: 'Chatbot. Die Handlung bleibt bei dir.',
    },
    {
      text: 'Startet ein Programm, prüft ob der Code läuft, und korrigiert ihn dann.',
      kind: 'agent',
      explanation: 'Agent. Er handelt, sieht das Ergebnis und macht darauf aufbauend weiter.',
    },
    {
      text: 'Plant mehrere Schritte und macht ohne Rückfrage weiter, bis das Ziel erreicht ist.',
      kind: 'agent',
      explanation: 'Agent. Das selbstständige Weitermachen ist sein Kennzeichen.',
    },
    {
      text: 'Erklärt dir, wie man ein Zugticket bucht.',
      kind: 'chatbot',
      explanation: 'Chatbot. Er erklärt, gebucht hat er nichts.',
    },
  ];

  sortResults = signal<Record<number, boolean>>({});

  tools: { id: ToolId; label: string }[] = [
    { id: 'search', label: 'Websuche' },
    { id: 'calendar', label: 'Kalender' },
    { id: 'mail', label: 'E-Mail' },
  ];

  readonly phaseLabels: Record<Phase, string> = {
    denken: 'DENKEN',
    handeln: 'HANDELN',
    beobachten: 'BEOBACHTEN',
    warten: 'WARTEN',
    fertig: 'FERTIG',
  };

  readonly phaseTones: Record<Phase, string> = {
    denken: 'text-cyan-300',
    handeln: 'text-amber-300',
    beobachten: 'text-emerald-300',
    warten: 'text-orange-400',
    fertig: 'text-pink-300',
  };

  activeTools = signal<ToolId[]>(['search', 'calendar']);

  approval = signal(true);

  shown = signal(0);

  plan = computed<AgentStep[]>(() => {
    const active = this.activeTools();
    const steps: AgentStep[] = [
      {
        phase: 'denken',
        text: 'Aufgabe: Kurztrip nach Hamburg am Samstag planen. Ich brauche Zugzeiten, einen freien Termin und eine Zusage von Alex.',
      },
    ];

    if (active.length === 0) {
      steps.push(
        {
          phase: 'denken',
          text: 'Ich habe keine Werkzeuge. Ich kann nur Text schreiben und nichts prüfen, buchen oder senden.',
        },
        {
          phase: 'fertig',
          text: 'Ergebnis: ein Text mit Vorschlägen. Gebucht, geprüft oder verschickt ist nichts.',
        },
      );
      return steps;
    }

    if (active.includes('search')) {
      steps.push(
        {
          phase: 'handeln',
          text: 'Werkzeug Websuche: Zugverbindungen nach Hamburg werden gesucht.',
        },
        {
          phase: 'beobachten',
          text: 'Ergebnis (Beispiel): Samstag 8:12 Uhr ab Hauptbahnhof, Fahrzeit etwa zwei Stunden.',
        },
      );
    }

    if (active.includes('calendar')) {
      steps.push(
        { phase: 'handeln', text: 'Werkzeug Kalender: Der Samstag wird geprüft.' },
        { phase: 'beobachten', text: 'Ergebnis (Beispiel): Samstag ist frei.' },
      );
    }

    if (active.includes('mail')) {
      if (this.approval()) {
        steps.push(
          { phase: 'handeln', text: 'Werkzeug E-Mail: Entwurf an Alex wird erstellt.' },
          {
            phase: 'warten',
            text: 'Der Agent wartet auf deine Freigabe, bevor er etwas sendet.',
            needsApproval: true,
          },
          { phase: 'handeln', text: 'Freigabe erhalten. Die E-Mail an Alex wird gesendet.' },
          { phase: 'beobachten', text: 'Ergebnis (Beispiel): Zustellung bestätigt.' },
        );
      } else {
        steps.push(
          {
            phase: 'handeln',
            text: 'Werkzeug E-Mail: Die Nachricht an Alex wird sofort gesendet. Du entscheidest dabei nicht mit.',
          },
          { phase: 'beobachten', text: 'Ergebnis (Beispiel): Zustellung bestätigt.' },
        );
      }
    }

    steps.push({
      phase: 'denken',
      text: 'Ich vergleiche die Ergebnisse mit dem Ziel und prüfe, ob etwas fehlt.',
    });

    const names = this.tools
      .filter((tool) => active.includes(tool.id))
      .map((tool) => tool.label)
      .join(', ');
    const missingMail = active.includes('mail')
      ? ''
      : ' Alex habe ich nicht gefragt, dafür fehlt mir das Werkzeug E-Mail.';

    steps.push({ phase: 'fertig', text: `Fertig. Genutzte Werkzeuge: ${names}.${missingMail}` });
    return steps;
  });

  visibleSteps = computed(() => this.plan().slice(0, this.shown()));

  phase = computed<Phase | null>(() => {
    const visible = this.visibleSteps();
    return visible.length === 0 ? null : visible[visible.length - 1].phase;
  });

  awaitingApproval = computed(() => this.visibleSteps().at(-1)?.needsApproval === true);

  loopFinished = computed(() => this.shown() >= this.plan().length);

  apps = signal(4);

  toolCount = signal(5);

  connections = computed(() => {
    const single = this.apps() * this.toolCount();
    const standard = this.apps() + this.toolCount();

    return {
      single,
      standard,
      singlePercent: (single / MAX_CONNECTIONS) * 100,
      standardPercent: (standard / MAX_CONNECTIONS) * 100,
    };
  });

  levels: FreedomLevel[] = [
    {
      title: 'Nur Vorschläge',
      text: 'Der Agent schreibt auf, was er tun würde. Du führst alles selbst aus.',
      example: 'Die KI listet auf, welche Mails du beantworten solltest.',
      risk: 'Gering. Es passiert nichts, was du nicht selbst machst.',
    },
    {
      title: 'Jede Aktion mit Freigabe',
      text: 'Der Agent bereitet Aktionen vor und führt sie erst nach deinem Okay aus.',
      example: 'Er entwirft die Antwort-Mail und sendet sie, wenn du zustimmst.',
      risk: 'Gering bis mittel. Bei sehr vielen Freigaben klickt man irgendwann ungeprüft auf Ja.',
    },
    {
      title: 'Freigabe nur bei Wichtigem',
      text: 'Lesen und Suchen darf der Agent allein. Senden, Löschen und Bezahlen gehen nur mit deiner Freigabe.',
      example: 'Er sortiert den Posteingang selbst, fragt aber vor jedem Versand.',
      risk: 'Mittel. Entscheidend ist, was als wichtig eingestuft wird.',
    },
    {
      title: 'Selbstständig im Rahmen',
      text: 'Der Agent arbeitet allein, aber nur innerhalb fester Grenzen wie Ordner, Budget und Zeit. Du prüfst das Ergebnis danach.',
      example:
        'Er beantwortet Standardanfragen in einem Postfach, bis sein Tageslimit erreicht ist.',
      risk: 'Mittel bis hoch. Fehler fallen oft erst nachträglich auf.',
    },
    {
      title: 'Volle Autonomie',
      text: 'Der Agent entscheidet und handelt allein, auch über lange Zeit.',
      example: 'Er arbeitet über Tage an einer Aufgabe, ohne dass jemand mitliest.',
      risk: 'Hoch. Fehler und Regelverstöße können lange unbemerkt bleiben. Protokoll und Notaus werden wichtig.',
    },
  ];

  level = signal(3);

  currentLevel = computed(() => this.levels[this.level() - 1]);

  tempoPercent = computed(() => this.level() * 20);

  controlPercent = computed(() => (6 - this.level()) * 20);

  guards: { id: GuardId; label: string }[] = [
    { id: 'rights', label: 'Minimale Rechte: Der Agent darf keine Mails senden' },
    { id: 'approval', label: 'Freigabe: Jede Aktion braucht dein Okay' },
    {
      id: 'marking',
      label: 'Markierung: Mail-Inhalte gelten als Daten, nicht als Anweisung',
    },
  ];

  activeGuards = signal<GuardId[]>([]);

  outcome = computed<Outcome>(() => {
    const active = this.activeGuards();

    if (active.includes('rights')) {
      return {
        title: 'Angriff ohne Wirkung',
        text: 'Der Agent hat das Recht zum Senden gar nicht. Was er nicht darf, kann auch ein versteckter Befehl nicht auslösen.',
        tone: 'text-emerald-300',
      };
    }
    if (active.includes('approval')) {
      return {
        title: 'Du kannst eingreifen',
        text: 'Der Agent fragt: "Alle Kontakte an angreifer@example.com senden?" Du lehnst ab. Der Schutz hält nur, wenn du Freigaben wirklich liest.',
        tone: 'text-amber-300',
      };
    }
    if (active.includes('marking')) {
      return {
        title: 'Hilft oft, aber nicht immer',
        text: 'Das Modell ignoriert die versteckte Zeile meistens, aber es gibt keine Garantie. Eine Markierung allein ist kein sicherer Schutz.',
        tone: 'text-amber-300',
      };
    }
    return {
      title: 'Angriff gelingt',
      text: 'Der Agent hält die versteckte Zeile für eine Anweisung und sendet die Kontakte an den Angreifer. Er hat nur getan, was in der Mail stand.',
      tone: 'text-pink-400',
    };
  });

  glossar: GlossaryTerm[] = [
    {
      name: 'KI-Agent',
      explanation:
        'Ein KI-System, das nicht nur Text ausgibt, sondern mit Werkzeugen selbst Schritte ausführt, um ein Ziel zu erreichen.',
    },
    {
      name: 'Agenten-Schleife',
      explanation:
        'Der Ablauf, den ein Agent wiederholt: nachdenken, mit einem Werkzeug handeln, das Ergebnis ansehen und entscheiden, was als Nächstes kommt.',
    },
    {
      name: 'Werkzeug (Tool)',
      explanation:
        'Eine Funktion, die ein Agent aufrufen darf, zum Beispiel Websuche, Kalender, Dateien oder E-Mail.',
    },
    {
      name: 'Agent-Harness',
      explanation:
        'Die Software, die die Schleife ausführt: Sie gibt dem Modell Kontext, führt die gewünschten Werkzeuge aus und gibt die Ergebnisse zurück.',
    },
    {
      name: 'MCP (Model Context Protocol)',
      explanation:
        'Ein offener Standard, mit dem KI-Anwendungen Werkzeuge und Datenquellen anbinden, ohne für jede Kombination eine eigene Lösung zu bauen.',
    },
    {
      name: 'Prompt Injection',
      explanation:
        'Ein Angriff, bei dem eine KI Anweisungen des Angreifers für echte Befehle hält. Direkt steht sie im Prompt, indirekt steckt sie in Inhalten, die die KI liest.',
    },
    {
      name: 'Freigabe (Human in the Loop)',
      explanation:
        'Ein Mensch muss kritische Aktionen wie Senden, Löschen oder Bezahlen bestätigen, bevor der Agent sie ausführt.',
    },
    {
      name: 'Minimale Rechte',
      explanation:
        'Der Agent bekommt nur die Rechte, die er für seine Aufgabe braucht. Was er nicht darf, kann auch ein Angreifer nicht über ihn auslösen.',
    },
    {
      name: 'Sandbox',
      explanation:
        'Eine abgeschottete Umgebung, in der ein Agent arbeitet, damit Fehler oder Angriffe die Außenwelt nicht erreichen.',
    },
  ];

  /**
   * Switches to another topic of the agent chapter.
   * @param id Identifier of the selected topic.
   */
  selectTopic(id: TopicId) {
    this.topic.set(id);
  }

  /**
   * Stores whether a statement was sorted correctly.
   * @param index Position of the statement.
   * @param kind The type the user picked.
   */
  answerSort(index: number, kind: Kind) {
    const item = this.sorting[index];
    this.sortResults.update((current) => ({ ...current, [index]: kind === item.kind }));
  }

  /**
   * Checks whether a statement has already been sorted.
   * @param index Position of the statement.
   * @returns True if the statement was sorted.
   */
  isSortAnswered(index: number): boolean {
    return this.sortResults()[index] !== undefined;
  }

  /**
   * Checks whether a statement was sorted correctly.
   * @param index Position of the statement.
   * @returns True if the type was correct.
   */
  wasSortCorrect(index: number): boolean {
    return this.sortResults()[index] === true;
  }

  /**
   * Checks whether a tool is switched on for the simulated agent.
   * @param id Identifier of the tool.
   * @returns True if the tool is active.
   */
  isToolActive(id: ToolId): boolean {
    return this.activeTools().includes(id);
  }

  /**
   * Switches a tool on or off and restarts the simulation.
   * @param id Identifier of the tool.
   */
  toggleTool(id: ToolId) {
    this.activeTools.update((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
    this.shown.set(0);
  }

  /**
   * Switches the human approval on or off and restarts the simulation.
   */
  toggleApproval() {
    this.approval.update((current) => !current);
    this.shown.set(0);
  }

  /**
   * Shows the next step of the simulated agent.
   */
  nextStep() {
    if (this.loopFinished() || this.awaitingApproval()) return;
    this.shown.update((count) => count + 1);
  }

  /**
   * Approves the waiting action so that the agent can continue.
   */
  approve() {
    if (!this.awaitingApproval()) return;
    this.shown.update((count) => count + 1);
  }

  /**
   * Restarts the simulation from the first step.
   */
  resetLoop() {
    this.shown.set(0);
  }

  /**
   * Sets the number of AI applications from the slider.
   * @param event Input event of the range slider.
   */
  onApps(event: Event) {
    const input = event.target as HTMLInputElement;
    this.apps.set(Number(input.value));
  }

  /**
   * Sets the number of tools from the slider.
   * @param event Input event of the range slider.
   */
  onToolCount(event: Event) {
    const input = event.target as HTMLInputElement;
    this.toolCount.set(Number(input.value));
  }

  /**
   * Sets the freedom level of the agent from the slider.
   * @param event Input event of the range slider.
   */
  onLevel(event: Event) {
    const input = event.target as HTMLInputElement;
    this.level.set(Number(input.value));
  }

  /**
   * Checks whether a protection layer is switched on.
   * @param id Identifier of the protection layer.
   * @returns True if the layer is active.
   */
  isGuardActive(id: GuardId): boolean {
    return this.activeGuards().includes(id);
  }

  /**
   * Switches a protection layer on or off.
   * @param id Identifier of the protection layer.
   */
  toggleGuard(id: GuardId) {
    this.activeGuards.update((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Was unterscheidet einen KI-Agenten von einem Chatbot?',
      options: [
        'Er nutzt Werkzeuge und führt selbst Schritte aus, um ein Ziel zu erreichen',
        'Er hat mehr Parameter',
        'Er antwortet immer schneller',
      ],
      correct: 0,
      explanation: 'Ein Chatbot gibt Text aus. Ein Agent handelt mit Werkzeugen.',
    },
    {
      question: 'Was passiert in der Agenten-Schleife?',
      options: [
        'Die KI beantwortet einmal und stoppt',
        'Denken, Handeln und Beobachten wiederholen sich, bis das Ziel erreicht ist',
        'Der Mensch tippt jeden Schritt selbst ein',
      ],
      correct: 1,
      explanation:
        'Der Agent nutzt das Ergebnis jedes Schritts, um den nächsten zu planen, bis er fertig ist oder abbricht.',
    },
    {
      question: 'Wofür ist das Model Context Protocol (MCP) da?',
      options: [
        'Es macht Modelle kleiner',
        'Es ersetzt das Training',
        'Es ist ein gemeinsamer Standard, mit dem KI-Anwendungen Werkzeuge und Datenquellen anbinden',
      ],
      correct: 2,
      explanation:
        'Statt jede Kombination einzeln zu bauen, sprechen alle Seiten dasselbe Protokoll.',
    },
    {
      question: 'Was ist indirekte Prompt Injection?',
      options: [
        'Versteckte Anweisungen in Inhalten, die der Agent liest, etwa in Mails oder Webseiten',
        'Ein Angriff, der die Hardware zerstört',
        'Ein Tippfehler im Prompt',
      ],
      correct: 0,
      explanation:
        'Der Angreifer muss den Prompt nicht selbst schreiben. Es genügt, wenn der Agent seinen Text liest.',
    },
    {
      question: 'Warum sind minimale Rechte für Agenten wichtig?',
      options: [
        'Sie machen den Agenten schneller',
        'Was ein Agent nicht darf, kann auch ein Angreifer nicht über ihn auslösen',
        'Sie sparen Strom',
      ],
      correct: 1,
      explanation: 'Fehlende Rechte begrenzen den Schaden, auch wenn der Agent getäuscht wird.',
    },
    {
      question: 'Wozu dient die Freigabe durch den Menschen?',
      options: [
        'Sie beschleunigt den Agenten',
        'Sie ersetzt die Werkzeuge',
        'Kritische Aktionen wie Senden, Löschen oder Bezahlen laufen erst nach deinem Okay',
      ],
      correct: 2,
      explanation:
        'So kannst du eingreifen, bevor etwas passiert, das sich nicht rückgängig machen lässt.',
    },
    {
      question: 'Reicht ein einzelner Filter, um Prompt Injection vollständig zu verhindern?',
      options: [
        'Nein, deshalb schichtet man mehrere Schutzmaßnahmen',
        'Ja, ein Textfilter reicht',
        'Ja, wenn das Modell groß genug ist',
      ],
      correct: 0,
      explanation:
        'Einen einzelnen Schalter, der sie vollständig verhindert, gibt es nicht. Rechte, Freigaben und Markierungen ergänzen sich.',
    },
    {
      question: 'Ein Agent hat keine Werkzeuge. Was kann er tun?',
      options: [
        'Programme starten',
        'Nur Text erzeugen, aber nichts selbst prüfen oder ausführen',
        'E-Mails senden',
      ],
      correct: 1,
      explanation: 'Erst Werkzeuge machen aus einem Textgenerator einen Agenten, der handeln kann.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du hast die Agenten durchschaut.',
    gut: 'Gut. Lies die Erklärungen zu den Fragen, die du verpasst hast.',
    schwach: 'Probier die Simulationen oben noch einmal und achte auf die Erklärungen.',
  };
}
