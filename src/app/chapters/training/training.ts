import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

interface DataOption {
  id: 'viel' | 'gut';
  label: string;
}

@Component({
  selector: 'app-training',
  imports: [FormsModule, Quiz],
  templateUrl: './training.html',
  styleUrl: './training.css',
})
export class Training {
  dataAmount = signal(10);

  /**
   * Simulates diminishing marginal returns: large gains at the start, flattening at high values.
   */
  accuracy = computed(() => {
    const amount = this.dataAmount();
    const value = 100 * (1 - Math.exp(-amount / 35));
    return Math.round(value);
  });

  qualityNote = computed(() => {
    const acc = this.accuracy();
    if (acc < 30) return 'Viel zu wenig Daten - die KI rät quasi.';
    if (acc < 60) return 'Erste Muster werden erkannt, aber noch sehr unzuverlässig.';
    if (acc < 85) return 'Solide Grundlage, aber es gibt noch klare Lücken.';
    return 'Sehr gute Trefferquote - aber Achtung: mehr Daten bedeuten nicht automatisch bessere Daten.';
  });

  dataOptions: DataOption[] = [
    { id: 'viel', label: 'Viele Beispiele, viele Fehler' },
    { id: 'gut', label: 'Wenige Beispiele, sauber geprüft' },
  ];

  dataChoice = signal<DataOption['id']>('gut');

  dataResult = computed(() =>
    this.dataChoice() === 'viel'
      ? 'Die KI übernimmt die Fehler gleich mit. Mehr davon macht sie nicht besser, sondern nur sicherer im Falschen.'
      : 'Die Regel wird klarer erkannt, weil jedes Beispiel stimmt. Qualität schlägt Menge.',
  );

  quiz: QuizQuestion[] = [
    {
      question: 'Warum reicht es nicht, einfach mehr Daten zu sammeln?',
      options: [
        'Mehr Daten sind immer besser',
        'Fehlerhafte Daten werden mit mehr Daten nicht besser',
        'Daten sind rechtlich verboten',
      ],
      correct: 1,
      explanation:
        'Die KI lernt alle Beispiele, auch die falschen. Deshalb zählt die Qualität genauso wie die Menge.',
    },
    {
      question: 'Was bedeutet die Trefferquote?',
      options: [
        'Wie viele Beispiele gesammelt wurden',
        'Wie oft die KI richtig liegt',
        'Wie schnell die KI rechnet',
      ],
      correct: 1,
      explanation: 'Die Trefferquote zeigt, wie oft die Antwort der KI stimmt.',
    },
    {
      question: 'Warum flacht die Kurve bei sehr vielen Beispielen ab?',
      options: [
        'Die KI wird müde',
        'Jedes neue Beispiel bringt weniger Neues als das vorherige',
        'Die Beispiele gehen aus',
      ],
      correct: 1,
      explanation:
        'Am Anfang lernt die KI viel Neues. Später kennt sie die Muster schon, und jedes weitere Beispiel bringt wenig.',
    },
    {
      question: 'Was erkennt eine KI beim Training?',
      options: [
        'Statistische Muster in vielen Beispielen',
        'Den Sinn hinter jedem Beispiel wie ein Mensch',
        'Nur die Reihenfolge der Beispiele',
      ],
      correct: 0,
      explanation:
        'Die KI lernt nicht wie ein Mensch, sondern erkennt Muster in den Beispieldaten.',
    },
    {
      question: 'Was passiert, wenn die Trainingsdaten einseitig sind?',
      options: [
        'Die KI gleicht das automatisch aus',
        'Die KI übernimmt die Einseitigkeit',
        'Die KI wird dadurch schneller',
      ],
      correct: 1,
      explanation:
        'Die KI kennt nur, was in den Daten steckt. Einseitige Daten führen zu einseitigen Ergebnissen.',
    },
    {
      question: 'Was bedeutet "verallgemeinern"?',
      options: [
        'Beispiele auswendig lernen',
        'Gelernte Muster auf neue, unbekannte Fälle anwenden',
        'Alle Daten zu einem Beispiel zusammenfassen',
      ],
      correct: 1,
      explanation:
        'Eine gute KI erkennt Muster und kann sie auch auf Fälle anwenden, die im Training nicht vorkamen.',
    },
    {
      question: 'Welche Aussage über Trainingsdaten stimmt?',
      options: [
        'Mehr Daten machen schlechte Daten gut',
        'Qualität schlägt Quantität',
        'Ab 100 Beispielen ist jede KI perfekt',
      ],
      correct: 1,
      explanation:
        'Fehlerhafte oder einseitige Daten führen zu einer schlechten KI, egal wie viele es sind.',
    },
    {
      question:
        'Die Trefferquote liegt schon bei 90 Prozent. Was bringen weitere Daten jetzt noch?',
      options: ['Meist nur noch wenig', 'Sofort 100 Prozent', 'Die Trefferquote sinkt immer'],
      correct: 0,
      explanation:
        'Die Kurve flacht ab: Am Anfang bringt jedes Beispiel viel, später kaum noch etwas.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Sehr gut. Menge allein reicht nicht, das hast du verstanden.',
    gut: 'Gut. Schau dir den zweiten Abschnitt noch einmal an.',
    schwach: 'Probier den Bereich mit der Auswahl aus und dann die Runde nochmal.',
  };

  /**
   * Selects the starting situation in the second section.
   * @param id Identifier of the selected option.
   */
  chooseData(id: DataOption['id']) {
    this.dataChoice.set(id);
  }
}
