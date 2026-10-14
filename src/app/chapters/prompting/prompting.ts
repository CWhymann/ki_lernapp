import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Example {
  id: 'schwach' | 'stark';
  prompt: string;
}

@Component({
  selector: 'app-prompting',
  imports: [FormsModule],
  templateUrl: './prompting.html',
  styleUrl: './prompting.css',
})
export class Prompting {
  userPrompt = signal('');
  feedback = signal<string | null>(null);

  checkPrompt() {
    const text = this.userPrompt().trim();

    if (text.length === 0) {
      this.feedback.set('Gib erstmal einen Prompt ein.');
      return;
    }

    if (text.length < 15) {
      this.feedback.set(
        'Zu kurz und vage. Eine KI braucht Kontext: Was genau willst du, in welchem Format, für wen?',
      );
      return;
    }

    const hasContext = /für|als|im stil|format|beispiel|zielgruppe/i.test(text);

    if (hasContext) {
      this.feedback.set(
        'Guter Prompt! Du gibst Kontext und Rahmenbedingungen mit - genau das hilft der KI, treffende Antworten zu liefern.',
      );
    } else {
      this.feedback.set(
        'Schon länger, aber noch ohne klaren Kontext. Versuch Zielgruppe, Format oder Beispiel mit reinzunehmen.',
      );
    }
  }

  clearPrompt() {
    this.userPrompt.set('');
    this.feedback.set(null);
  }

  examples: Example[] = [
    { id: 'schwach', prompt: 'Schreib mir was über Hunde.' },
    {
      id: 'stark',
      prompt: 'Schreib für Kinder von 8 bis 10 Jahren drei kurze Sätze über Hunde. Format: Liste.',
    },
  ];

  exampleChoice = signal<Example['id']>('schwach');

  exampleResult = computed(() =>
    this.exampleChoice() === 'schwach'
      ? 'Die KI weiß nicht, für wen, wie lang und in welchem Format. Die Antwort kann alles sein: Rasse, Pflege, Geschichte.'
      : 'Die KI weiß jetzt, für wen, wie viel und in welcher Form. Die Antwort passt genau zu dem, was du brauchst.',
  );

  quiz: QuizQuestion[] = [
    {
      question: 'Was gehört nicht zu den Bausteinen eines guten Prompts?',
      options: ['Kontext', 'Ziel', 'Passwort'],
      correct: 2,
      explanation:
        'In einen Prompt gehört kein Passwort. Kontext, Ziel, Format und Zielgruppe helfen der KI.',
    },
    {
      question: 'Warum ist "Schreib mir was über Hunde" schwach?',
      options: [
        'Es ist zu lang',
        'Die KI weiß nicht, für wen und in welchem Format',
        'Hunde sind kein gutes Thema',
      ],
      correct: 1,
      explanation:
        'Ohne Zielgruppe und Format muss die KI raten. Mit beidem wird die Antwort passend.',
    },
    {
      question: 'Was hilft der KI am meisten?',
      options: ['Ein möglichst kurzer Satz', 'Kontext, Ziel und Format', 'Nur Großbuchstaben'],
      correct: 1,
      explanation: 'Je klarer du Kontext, Ziel und Format nennst, desto weniger muss die KI raten.',
    },
  ];

  quizIndex = signal(0);
  selected = signal<number | null>(null);
  score = signal(0);
  quizFinished = signal(false);

  question = computed(() => this.quiz[this.quizIndex()]);

  scoreText = computed(() => {
    const score = this.score();
    if (score === this.quiz.length) return 'Sehr gut. Du weißt, worauf es beim Prompt ankommt.';
    if (score >= 2) return 'Gut. Schau dir den Vergleich noch einmal an.';
    return 'Probier den Vergleich aus und lies die Erklärungen zu den Fragen.';
  });

  /**
   * Wählt das Beispiel für den Vergleich aus.
   * @param id Kennung des gewählten Beispiels.
   */
  chooseExample(id: Example['id']) {
    this.exampleChoice.set(id);
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
