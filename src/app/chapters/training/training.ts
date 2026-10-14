import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface DataOption {
  id: 'viel' | 'gut';
  label: string;
}

@Component({
  selector: 'app-training',
  imports: [FormsModule],
  templateUrl: './training.html',
  styleUrl: './training.css',
})
export class Training {
  dataAmount = signal(10);

  /**
   * Simuliert abnehmenden Grenznutzen: viel Zuwachs am Anfang, Abflachen bei hohen Werten.
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
  ];

  quizIndex = signal(0);
  selected = signal<number | null>(null);
  score = signal(0);
  quizFinished = signal(false);

  question = computed(() => this.quiz[this.quizIndex()]);

  scoreText = computed(() => {
    const score = this.score();
    if (score === this.quiz.length)
      return 'Sehr gut. Menge allein reicht nicht, das hast du verstanden.';
    if (score >= 2) return 'Gut. Schau dir den zweiten Abschnitt noch einmal an.';
    return 'Probier den Bereich mit der Auswahl aus und dann die Frage nochmal.';
  });

  /**
   * Wählt die Ausgangslage im zweiten Abschnitt.
   * @param id Kennung der gewählten Option.
   */
  chooseData(id: DataOption['id']) {
    this.dataChoice.set(id);
  }

  /**
   * Speichert die gewählte Antwort und zählt richtige Antworten.
   * @param index Position der gewählten Option.
   */
  choose(index: number) {
    if (this.selected() !== null) return;
    this.selected.set(index);
    if (index === this.question().correct) {
      this.score.update((value) => value + 1);
    }
  }

  /**
   * Geht zur nächsten Frage oder zeigt das Ergebnis.
   */
  nextQuestion() {
    if (this.quizIndex() === this.quiz.length - 1) {
      this.quizFinished.set(true);
    } else {
      this.quizIndex.update((value) => value + 1);
      this.selected.set(null);
    }
  }

  /**
   * Setzt den Wissens-Check auf den Anfang zurück.
   */
  restartQuiz() {
    this.quizIndex.set(0);
    this.selected.set(null);
    this.score.set(0);
    this.quizFinished.set(false);
  }

  /**
   * Liefert die Klassen für eine Antwortoption je nach Zustand.
   * @param index Position der Option.
   * @returns Tailwind-Klassen für die Option.
   */
  optionStyle(index: number): string {
    const base = 'text-left px-4 py-3 rounded-md border-2 text-base transition-all ';
    const selected = this.selected();
    if (selected === null) {
      return base + 'border-slate-600 text-slate-200 hover:border-cyan-500/60';
    }
    if (index === this.question().correct) {
      return base + 'border-emerald-400 bg-emerald-400/10 text-emerald-300';
    }
    if (index === selected) {
      return base + 'border-red-400 bg-red-400/10 text-red-300';
    }
    return base + 'border-slate-700 text-slate-500';
  }
}
