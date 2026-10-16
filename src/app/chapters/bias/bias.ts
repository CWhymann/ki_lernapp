import { Component, signal, computed } from '@angular/core';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { GRUNDBEGRIFFE } from '../../shared/glossary/begriffe';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

interface BiasExample {
  role: string;
  biasedAnswer: string;
  balancedAnswer: string;
}

interface BiasType {
  id: number;
  step: number;
  station: string;
  name: string;
  explanation: string;
  example: string;
}

interface Measure {
  id: string;
  label: string;
  text: string;
  who: 'Entwickler' | 'Du';
  reduction: number;
}

const START_LEVEL = 80;

@Component({
  selector: 'app-bias',
  imports: [Quiz, Glossary],
  templateUrl: './bias.html',
  styleUrl: './bias.css',
})
export class Bias {
  examples: BiasExample[] = [
    {
      role: 'Erzieher/in',
      biasedAnswer: 'Beschreibt eine Erzieherin, geduldig und fürsorglich mit Kindern.',
      balancedAnswer:
        'Beschreibt eine Fachkraft (unabhängig vom Geschlecht), die Kinder in ihrer Entwicklung begleitet.',
    },
    {
      role: 'Ingenieur/in',
      biasedAnswer: 'Beschreibt einen Ingenieur, analytisch und technikbegeistert.',
      balancedAnswer:
        'Beschreibt eine Fachkraft (unabhängig vom Geschlecht), die technische Probleme löst.',
    },
    {
      role: 'Pilot/in',
      biasedAnswer: 'Beschreibt einen Piloten, der ruhig und entschlossen ein Flugzeug steuert.',
      balancedAnswer:
        'Beschreibt eine Fachkraft (unabhängig vom Geschlecht), die ein Flugzeug sicher steuert.',
    },
  ];

  selectedIndex = signal(0);
  dropdownOpen = signal(false);

  selectedExample = computed(() => this.examples[this.selectedIndex()]);

  biasTypes: BiasType[] = [
    {
      id: 1,
      step: 1,
      station: 'Daten auswählen',
      name: 'Auswahl-Bias',
      explanation:
        'Die Trainingsdaten stammen überwiegend von einer Gruppe oder einer Quelle. Was in den Daten fehlt, lernt die KI nicht oder nur schlecht.',
      example:
        'Eine Gesichtserkennung wird vor allem mit Fotos hellhäutiger Menschen trainiert und erkennt andere Gesichter schlechter.',
    },
    {
      id: 2,
      step: 2,
      station: 'Daten aus der Vergangenheit',
      name: 'Historischer Bias',
      explanation:
        'Die Daten sind korrekt erhoben, spiegeln aber eine Welt wider, die schon ungleich war. Die KI führt diese Ungleichheit fort.',
      example:
        'Eine Bewerbungs-KI lernt aus früheren Einstellungen und bevorzugt Männer, weil in der Vergangenheit mehr Männer eingestellt wurden.',
    },
    {
      id: 3,
      step: 3,
      station: 'Daten beschriften',
      name: 'Bewertungs-Bias',
      explanation:
        'Menschen, die Daten mit Etiketten versehen, bringen ihre eigene Sicht mit. Diese Sicht steckt dann in den Beispielen, aus denen die KI lernt.',
      example:
        'Beiträge in einem bestimmten Dialekt werden häufiger als "aggressiv" markiert, und die KI lernt diese Verknüpfung mit.',
    },
    {
      id: 4,
      step: 4,
      station: 'Muster lernen',
      name: 'Stereotyp-Bias',
      explanation:
        'Kommen bestimmte Wörter in Texten oft zusammen vor, verknüpft die KI sie fest und überträgt die Verknüpfung auf jeden Einzelfall.',
      example:
        '"Erzieherin" und "fürsorglich" stehen oft zusammen, also beschreibt die KI jede Erzieherin so, wie im Beispiel oben.',
    },
  ];

  typeChoice = signal(1);

  selectedType = computed(
    () => this.biasTypes.find((type) => type.id === this.typeChoice()) ?? this.biasTypes[0],
  );

  measures: Measure[] = [
    {
      id: 'daten',
      label: 'Trainingsdaten ausgleichen',
      text: 'Mehr Beispiele aus zu selten vertretenen Gruppen sammeln und einseitige Quellen abschwächen.',
      who: 'Entwickler',
      reduction: 25,
    },
    {
      id: 'test',
      label: 'Ergebnisse nach Gruppen testen',
      text: 'Die Antworten für verschiedene Gruppen vergleichen. So fallen Unterschiede auf, bevor die KI genutzt wird.',
      who: 'Entwickler',
      reduction: 20,
    },
    {
      id: 'mensch',
      label: 'Menschen prüfen die Antworten',
      text: 'Fachleute lesen Stichproben und korrigieren Antworten, die Vorurteile enthalten.',
      who: 'Entwickler',
      reduction: 15,
    },
    {
      id: 'prompt',
      label: 'Neutral nachfragen',
      text: 'Im Prompt ausdrücklich bitten, keine Klischees zu verwenden, und die Antwort selbst auf Vorurteile prüfen.',
      who: 'Du',
      reduction: 10,
    },
  ];

  activeMeasures = signal<string[]>([]);

  biasLevel = computed(() => {
    const active = this.activeMeasures();
    const reduction = this.measures
      .filter((measure) => active.includes(measure.id))
      .reduce((sum, measure) => sum + measure.reduction, 0);
    return START_LEVEL - reduction;
  });

  biasNote = computed(() => {
    const level = this.biasLevel();
    if (level >= 70) {
      return 'Ohne Gegenmaßnahmen übernimmt die KI die Schieflage der Daten fast ungefiltert.';
    }
    if (level >= 45) {
      return 'Schon besser, aber die Verzerrung ist noch deutlich spürbar. Eine einzelne Maßnahme reicht nicht.';
    }
    if (level > 10) {
      return 'Mehrere Maßnahmen greifen ineinander und die Verzerrung wird klein. Jede Maßnahme fängt etwas anderes ab.';
    }
    return 'Auch mit allen Maßnahmen bleibt ein Rest. Bias lässt sich verringern, aber nie ganz auf null bringen.';
  });

  glossar: GlossaryTerm[] = GRUNDBEGRIFFE.filter((term: GlossaryTerm) =>
    ['Bias', 'Trainingsdaten', 'Modell'].includes(term.name),
  );

  /**
   * Opens or closes the role dropdown.
   */
  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  /**
   * Selects a role and closes the dropdown.
   * @param index Position of the selected role.
   */
  selectOption(index: number) {
    this.selectedIndex.set(index);
    this.dropdownOpen.set(false);
  }

  /**
   * Selects a station in the section about where bias comes from.
   * @param id Identifier of the selected bias type.
   */
  chooseType(id: number) {
    this.typeChoice.set(id);
  }

  /**
   * Turns a countermeasure on or off.
   * @param id Identifier of the countermeasure.
   */
  toggleMeasure(id: string) {
    this.activeMeasures.update((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  /**
   * Checks whether a countermeasure is switched on.
   * @param id Identifier of the countermeasure.
   * @returns True if the countermeasure is active.
   */
  isActive(id: string): boolean {
    return this.activeMeasures().includes(id);
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Was ist Bias bei einer KI?',
      options: [
        'Ein Schreibfehler im Modell',
        'Eine systematische Verzerrung, die aus den Trainingsdaten stammt',
        'Eine Funktion zum Abkürzen von Wörtern',
      ],
      correct: 1,
      explanation:
        'Bias ist eine Schieflage in den Antworten, die aus den Texten übernommen wurde, mit denen die KI gelernt hat.',
    },
    {
      question: 'Woher kommt Bias hauptsächlich?',
      options: [
        'Aus den Texten, mit denen die KI gelernt hat',
        'Aus der Stromversorgung des Rechners',
        'Aus zu vielen Fragen der Nutzer',
      ],
      correct: 0,
      explanation:
        'Die KI übernimmt die Muster aus ihren Trainingsdaten, inklusive der Vorurteile, die darin stecken.',
    },
    {
      question: 'Wie zeigt sich Bias oft?',
      options: [
        'In kleinen Details wie Wortwahl und impliziten Annahmen',
        'Immer als offene Beleidigung',
        'Nur bei Zahlen und Statistiken',
      ],
      correct: 0,
      explanation:
        'Bias ist selten offensichtlich. Er steckt oft in Formulierungen, die man beim ersten Lesen übersieht.',
    },
    {
      question: 'Was können Entwickler gegen Bias tun?',
      options: [
        'Trainingsdaten ausgleichen und Antworten prüfen',
        'Die KI einfach abschalten',
        'Nichts, Bias lässt sich nicht beeinflussen',
      ],
      correct: 0,
      explanation:
        'Ausgeglichene Trainingsdaten und das Prüfen von Antworten verringern Bias deutlich.',
    },
    {
      question: 'Warum hilft die Formulierung "Fachkraft (unabhängig vom Geschlecht)"?',
      options: [
        'Sie bedient keine Klischees und macht die Antwort neutraler',
        'Sie macht die Antwort länger',
        'Sie ist nur rechtlich vorgeschrieben',
      ],
      correct: 0,
      explanation:
        'Eine neutrale Beschreibung verzichtet auf Klischees und beschreibt die Tätigkeit selbst.',
    },
    {
      question: 'Was solltest du bei KI-Antworten tun, bevor du sie übernimmst?',
      options: [
        'Auf Vorurteile und einseitige Annahmen prüfen',
        'Nur die Länge kontrollieren',
        'Sie möglichst schnell übernehmen',
      ],
      correct: 0,
      explanation:
        'Gerade bei Beschreibungen von Personen lohnt sich der Blick auf Wortwahl und Annahmen.',
    },
    {
      question:
        'Eine Bewerbungs-KI lernt aus den Einstellungen der letzten 20 Jahre und bevorzugt Männer. Welche Art Bias ist das?',
      options: ['Historischer Bias', 'Auswahl-Bias bei der Nutzung', 'Ein Rechenfehler'],
      correct: 0,
      explanation:
        'Die Daten sind korrekt, spiegeln aber eine frühere Ungleichheit wider. Die KI führt sie fort.',
    },
    {
      question: 'Welche Aussage über Gegenmaßnahmen stimmt?',
      options: [
        'Eine einzelne Maßnahme beseitigt Bias vollständig',
        'Mehrere Maßnahmen zusammen verringern Bias, ein Rest bleibt',
        'Bias entsteht nur bei der Nutzung, nicht beim Training',
      ],
      correct: 1,
      explanation:
        'Jede Maßnahme fängt etwas anderes ab. Zusammen verringern sie Bias deutlich, ganz verschwindet er nicht.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du erkennst Bias in Formulierungen, nicht nur in offensichtlichen Aussagen.',
    gut: 'Gut. Lies die Erklärungen zu den Fragen, die du verpasst hast.',
    schwach: 'Vergleich die beiden Antworten oben noch einmal und achte auf die Wortwahl.',
  };
}
