import { Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SZENEN, Szene } from './szenen';

const TAKT_MS = 20;
const ZEICHEN_PRO_TAKT = 2;

/** A text split into the part already typed and the part still to come. */
interface Teil {
  voll: string;
  getippt: string;
  offen: string;
}

/** All typed texts of the current scene. */
interface SzenenText {
  erzaehlung: Teil[];
  video: Teil | null;
  begriff: Teil;
}

/** Splits a text after the given number of typed characters. */
function teilen(voll: string, anzahl: number): Teil {
  const grenze = Math.max(0, Math.min(anzahl, voll.length));
  return { voll, getippt: voll.slice(0, grenze), offen: voll.slice(grenze) };
}

/** Returns the total number of characters that are typed in a scene. */
function gesamtLaenge(szene: Szene): number {
  const erzaehlung = szene.erzaehlung.reduce((summe, absatz) => summe + absatz.length, 0);
  return erzaehlung + (szene.video?.length ?? 0) + szene.begriff.text.length;
}

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

  private readonly zeichen = signal(0);
  private readonly reduziert = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly text = computed<SzenenText>(() => {
    const szene = this.szene();
    let verbleibend = this.zeichen();
    const naechster = (voll: string): Teil => {
      const teil = teilen(voll, verbleibend);
      verbleibend -= voll.length;
      return teil;
    };
    return {
      erzaehlung: szene.erzaehlung.map((absatz) => naechster(absatz)),
      video: szene.video ? naechster(szene.video) : null,
      begriff: naechster(szene.begriff.text),
    };
  });

  constructor() {
    effect((aufraeumen) => {
      const gesamt = gesamtLaenge(this.szene());
      if (this.reduziert) {
        this.zeichen.set(gesamt);
        return;
      }
      this.zeichen.set(0);
      const timer = setInterval(() => {
        this.zeichen.update((aktuell) => Math.min(aktuell + ZEICHEN_PRO_TAKT, gesamt));
        if (this.zeichen() >= gesamt) {
          clearInterval(timer);
        }
      }, TAKT_MS);
      aufraeumen(() => clearInterval(timer));
    });
  }

  /** Moves to the next scene and stays on the last one. */
  weiter(): void {
    this.index.update((aktuell) => Math.min(aktuell + 1, this.szenen.length - 1));
  }

  /** Moves to the previous scene and stays on the first one. */
  zurueck(): void {
    this.index.update((aktuell) => Math.max(aktuell - 1, 0));
  }
}
