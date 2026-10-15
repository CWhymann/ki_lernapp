import { Component, signal, computed } from '@angular/core';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

interface BiasExample {
  role: string;
  biasedAnswer: string;
  balancedAnswer: string;
}

@Component({
  selector: 'app-bias',
  imports: [Quiz],
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
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du erkennst Bias in Formulierungen, nicht nur in offensichtlichen Aussagen.',
    gut: 'Gut. Lies die Erklärungen zu den Fragen, die du verpasst hast.',
    schwach: 'Vergleich die beiden Antworten oben noch einmal und achte auf die Wortwahl.',
  };
}
