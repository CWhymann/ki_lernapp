import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tokens',
  imports: [FormsModule],
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

  clearText() {
    this.inputText.set('');
  }
}
