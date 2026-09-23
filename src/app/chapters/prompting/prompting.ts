import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
}
