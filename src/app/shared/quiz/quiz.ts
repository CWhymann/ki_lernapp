import { Component, computed, input, linkedSignal, signal } from '@angular/core';

/** A single quiz question with its answer options. */
export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/** Texts for the result screen depending on the score. */
export interface QuizResultTexts {
  perfekt: string;
  gut: string;
  schwach: string;
}

interface Aufgabe extends QuizQuestion {
  quelle: QuizQuestion;
}

const BUCHSTABEN = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Returns a shuffled copy of a list. */
function mischen<T>(liste: readonly T[]): T[] {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

/** Shuffles the answer options of a question and keeps track of the correct one. */
function aufgabeErstellen(frage: QuizQuestion): Aufgabe {
  const optionen = mischen(
    frage.options.map((text, index) => ({ text, richtig: index === frage.correct })),
  );
  return {
    question: frage.question,
    options: optionen.map((option) => option.text),
    correct: optionen.findIndex((option) => option.richtig),
    explanation: frage.explanation,
    quelle: frage,
  };
}

/** Draws random questions from a pool and prepares them for one round. */
function rundeErstellen(fragen: QuizQuestion[], anzahl: number): Aufgabe[] {
  return mischen(fragen)
    .slice(0, anzahl)
    .map((frage) => aufgabeErstellen(frage));
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
  host: { class: 'block' },
})
export class Quiz {
  readonly fragen = input.required<QuizQuestion[]>();
  readonly ergebnis = input.required<QuizResultTexts>();
  readonly anzahl = input(5);
  readonly titel = input('Wissens-Check');

  readonly runde = linkedSignal<Aufgabe[]>(() => rundeErstellen(this.fragen(), this.anzahl()));
  readonly index = signal(0);
  readonly auswahl = signal<number | null>(null);
  readonly antworten = signal<boolean[]>([]);
  readonly beendet = signal(false);

  readonly aufgabe = computed(() => this.runde()[this.index()]);
  readonly gesamt = computed(() => this.runde().length);
  readonly punkte = computed(() => this.antworten().filter(Boolean).length);
  readonly falsche = computed(() => this.runde().filter((_, i) => !this.antworten()[i]));

  readonly ergebnisText = computed(() => {
    const texte = this.ergebnis();
    const anteil = this.punkte() / this.gesamt();
    if (anteil === 1) return texte.perfekt;
    if (anteil >= 0.6) return texte.gut;
    return texte.schwach;
  });

  /**
   * Stores the selected answer and remembers whether it was correct.
   * @param index Position of the selected option.
   */
  waehlen(index: number): void {
    if (this.auswahl() !== null) return;
    this.auswahl.set(index);
    this.antworten.update((liste) => [...liste, index === this.aufgabe().correct]);
  }

  /**
   * Moves to the next question or shows the result.
   */
  weiter(): void {
    if (this.index() === this.gesamt() - 1) {
      this.beendet.set(true);
    } else {
      this.index.update((wert) => wert + 1);
      this.auswahl.set(null);
    }
  }

  /**
   * Starts a new round with freshly drawn questions.
   */
  neueRunde(): void {
    this.beginnen(rundeErstellen(this.fragen(), this.anzahl()));
  }

  /**
   * Starts a new round with only the questions that were answered wrong.
   */
  falscheWiederholen(): void {
    const fragen = this.falsche().map((aufgabe) => aufgabe.quelle);
    this.beginnen(rundeErstellen(fragen, fragen.length));
  }

  /**
   * Returns the letter badge for an answer option.
   * @param index Position of the option.
   */
  buchstabe(index: number): string {
    return BUCHSTABEN[index];
  }

  /**
   * Returns the classes for an answer option depending on its state.
   * @param index Position of the option.
   * @returns Tailwind classes for the option.
   */
  optionStyle(index: number): string {
    const basis =
      'flex w-full items-start gap-3 rounded-md border-2 px-4 py-3 text-left text-base transition-all disabled:cursor-default ';
    const auswahl = this.auswahl();
    if (auswahl === null) {
      return basis + 'border-slate-600 text-slate-200 hover:border-cyan-400 hover:bg-cyan-400/5';
    }
    if (index === this.aufgabe().correct) {
      return (
        basis +
        'border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.25)]'
      );
    }
    if (index === auswahl) {
      return basis + 'border-pink-400 bg-pink-400/10 text-pink-300';
    }
    return basis + 'border-slate-700 text-slate-500';
  }

  /**
   * Returns the classes for a progress segment depending on its answer.
   * @param index Position of the question.
   * @returns Tailwind classes for the segment.
   */
  segmentStyle(index: number): string {
    const basis = 'h-1 flex-1 rounded-full transition-colors ';
    const antwort = this.antworten()[index];
    if (antwort === true) return basis + 'bg-emerald-400';
    if (antwort === false) return basis + 'bg-pink-400';
    return basis + (index === this.index() ? 'bg-cyan-400' : 'bg-slate-700');
  }

  private beginnen(aufgaben: Aufgabe[]): void {
    this.runde.set(aufgaben);
    this.index.set(0);
    this.auswahl.set(null);
    this.antworten.set([]);
    this.beendet.set(false);
  }
}
