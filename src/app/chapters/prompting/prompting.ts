import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';
import { Vokabel, VokabelTrainer } from '../../shared/vokabel-trainer/vokabel-trainer';

interface Example {
  id: 'schwach' | 'stark';
  prompt: string;
}

@Component({
  selector: 'app-prompting',
  imports: [FormsModule, VokabelTrainer, Quiz],
  templateUrl: './prompting.html',
  styleUrl: './prompting.css',
})
export class Prompting {
  userPrompt = signal('');
  feedback = signal<string | null>(null);

  /**
   * Checks the entered prompt for length and context and sets the feedback text.
   */
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

  /**
   * Clears the prompt field and the feedback text.
   */
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

  vokabeln: Vokabel[] = [
    {
      begriff: 'Prompt',
      erklaerung: 'Die Anfrage oder Anweisung, die du an eine KI schickst.',
    },
    {
      begriff: 'Kontext',
      erklaerung: 'Hintergrundinfos, die der KI sagen, worum es geht.',
    },
    {
      begriff: 'Zielgruppe',
      erklaerung: 'Die Menschen, für die die Antwort gedacht ist.',
    },
    {
      begriff: 'Format',
      erklaerung: 'Die Form der Antwort, zum Beispiel Liste, Tabelle oder Absatz.',
    },
    {
      begriff: 'Rolle',
      erklaerung: 'Die Figur, in die die KI schlüpfen soll, zum Beispiel „Du bist Reiseberater“.',
    },
    {
      begriff: 'Beispiel (Few-Shot)',
      erklaerung: 'Ein Muster, das du der KI zeigst, damit sie den gewünschten Stil übernimmt.',
    },
    {
      begriff: 'Systemprompt',
      erklaerung:
        'Grundanweisungen, die für ein ganzes Gespräch oder eine App gelten und vorab festgelegt werden.',
    },
    {
      begriff: 'Halluzination',
      erklaerung: 'Eine Antwort, die sicher klingt, aber falsche Fakten enthält.',
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
    {
      question: 'Was ist ein Systemprompt?',
      options: [
        'Eine Anweisung, die für ein ganzes Gespräch oder eine App gilt',
        'Eine Fehlermeldung des Rechners',
        'Der Name eines KI-Modells',
      ],
      correct: 0,
      explanation:
        'Ein Systemprompt legt Grundanweisungen fest, die vorab gelten und nicht bei jeder Frage neu gesagt werden müssen.',
    },
    {
      question: 'Was bringt ein Beispiel (Few-Shot) in einem Prompt?',
      options: [
        'Die KI übernimmt das Muster und den Stil',
        'Die KI wird schneller',
        'Die KI vergisst den Kontext',
      ],
      correct: 0,
      explanation:
        'Mit einem Beispiel zeigst du der KI, wie die Antwort aussehen soll. Sie übernimmt Stil und Aufbau.',
    },
    {
      question: 'Welche Rolle hilft, wenn du eine Antwort aus einer bestimmten Sicht willst?',
      options: [
        'Du bist ein erfahrener Reiseberater',
        'Antworte schnell',
        'Schreib in Großbuchstaben',
      ],
      correct: 0,
      explanation:
        'Eine Rolle wie "Du bist ein erfahrener Reiseberater" gibt der KI eine Perspektive und passende Wörter.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Sehr gut. Du weißt, worauf es beim Prompt ankommt.',
    gut: 'Gut. Schau dir den Vergleich noch einmal an.',
    schwach: 'Probier den Vergleich aus und lies die Erklärungen zu den Fragen.',
  };

  /**
   * Selects the example for the comparison.
   * @param id Identifier of the selected example.
   */
  chooseExample(id: Example['id']) {
    this.exampleChoice.set(id);
  }
}
