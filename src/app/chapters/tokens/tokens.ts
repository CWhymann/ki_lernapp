import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

@Component({
  selector: 'app-tokens',
  imports: [FormsModule, Quiz],
  templateUrl: './tokens.html',
  styleUrl: './tokens.css',
})
export class Tokens {
  inputText = signal('Die KI zerlegt jeden Satz in kleine Bausteine.');

  tokenList = computed(() => {
    const text = this.inputText();
    if (!text.trim()) return [];

    const words = text.match(/[\wäöüßÄÖÜ]+|[^\s\w]/g) ?? [];
    const tokens: string[] = [];

    for (const word of words) {
      if (word.length > 6 && /^[\wäöüßÄÖÜ]+$/.test(word)) {
        const mid = Math.ceil(word.length / 2);
        tokens.push(word.slice(0, mid), word.slice(mid));
      } else {
        tokens.push(word);
      }
    }

    return tokens;
  });

  tokenCount = computed(() => this.tokenList().length);
  wordCount = computed(() => (this.inputText().match(/[\wäöüßÄÖÜ]+/g) ?? []).length);

  quiz: QuizQuestion[] = [
    {
      question: 'Was ist ein Token?',
      options: [
        'Ein ganzer Absatz',
        'Ein Baustein aus Wort, Wortteil oder Satzzeichen',
        'Ein Passwort für die KI',
      ],
      correct: 1,
      explanation:
        'Tokens sind die kleinen Bausteine, in die eine KI Text zerlegt, bevor sie ihn verarbeitet.',
    },
    {
      question: 'Warum kosten lange Texte mehr?',
      options: [
        'Weil sie länger gespeichert werden',
        'Weil mehr Tokens verarbeitet werden',
        'Weil die KI mehr Pausen braucht',
      ],
      correct: 1,
      explanation:
        'Je mehr Tokens ein Text hat, desto mehr Rechenarbeit fällt an. Deshalb wird nach Tokens abgerechnet.',
    },
    {
      question: 'Warum werden seltene Fachwörter oft seltsam verarbeitet?',
      options: [
        'Sie werden in mehr, kleinere Tokens zerlegt',
        'Sie werden gar nicht verarbeitet',
        'Sie sind immer falsch geschrieben',
      ],
      correct: 0,
      explanation:
        'Gebräuchliche Wörter sind oft ein einzelner Token. Seltene Wörter zerfallen in mehrere Wortteile.',
    },
    {
      question: 'Womit rechnet die KI intern?',
      options: [
        'Mit Zahlen, die jeder Token repräsentiert',
        'Mit einzelnen Buchstaben',
        'Mit Bildern des Textes',
      ],
      correct: 0,
      explanation:
        'Jeder Token wird in eine Zahl umgewandelt. Mit diesen Zahlen rechnet das Modell.',
    },
    {
      question: 'Entspricht ein Wort immer genau einem Token?',
      options: ['Ja, immer', 'Nein, es kann in mehrere Tokens zerfallen', 'Nur bei Zahlen'],
      correct: 1,
      explanation:
        'Ein Wort kann ein Token sein, aber auch in mehrere Teile zerfallen, vor allem bei seltenen Wörtern.',
    },
    {
      question: 'Was passiert mit Satzzeichen?',
      options: [
        'Sie werden ignoriert',
        'Sie zählen oft als eigene Tokens',
        'Sie werden in Wörter verwandelt',
      ],
      correct: 1,
      explanation: 'Auch Punkte, Kommas und Fragezeichen werden meist als eigene Tokens gezählt.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du weißt, wie eine KI Text zerlegt und warum das Geld kostet.',
    gut: 'Gut. Probier den Satz oben mit einem Fachwort aus und sieh, wie es zerfällt.',
    schwach: 'Schau dir den Satz oben noch einmal an und lies die Erklärung zu den Fragen.',
  };

  clearText() {
    this.inputText.set('');
  }
}
