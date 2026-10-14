import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SZENEN } from './szenen';

@Component({
  selector: 'app-geschichte',
  imports: [RouterLink],
  templateUrl: './geschichte.html',
  styleUrl: './geschichte.css',
  host: {
    '(window:keydown.arrowright)': 'weiter()',
    '(window:keydown.arrowleft)': 'zurueck()',
  },
})
export class Geschichte {
  readonly szenen = SZENEN;
  readonly index = signal(0);
  readonly szene = computed(() => this.szenen[this.index()]);
  readonly istErste = computed(() => this.index() === 0);
  readonly istLetzte = computed(() => this.index() === this.szenen.length - 1);

  /** Moves to the next scene and stays on the last one. */
  weiter(): void {
    this.index.update((aktuell) => Math.min(aktuell + 1, this.szenen.length - 1));
  }

  /** Moves to the previous scene and stays on the first one. */
  zurueck(): void {
    this.index.update((aktuell) => Math.max(aktuell - 1, 0));
  }
}
