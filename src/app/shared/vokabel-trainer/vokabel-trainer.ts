import { Component, computed, input, signal } from '@angular/core';

export interface Vokabel {
  begriff: string;
  erklaerung: string;
}

/**
 * Returns a shuffled copy of the list using the Fisher-Yates algorithm.
 * @param liste Source list, left unchanged.
 * @returns New shuffled list.
 */
function mischen<T>(liste: T[]): T[] {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

@Component({
  selector: 'app-vokabel-trainer',
  templateUrl: './vokabel-trainer.html',
  styleUrl: './vokabel-trainer.css',
})
export class VokabelTrainer {
  karten = input.required<Vokabel[]>();
  titel = input('Vokabel-Trainer');

  gestartet = signal(false);
  fertig = signal(false);
  runde = signal<Vokabel[]>([]);
  index = signal(0);
  umgedreht = signal(false);
  nochUeben = signal<Vokabel[]>([]);
  gewusst = signal<string[]>([]);

  aktuelle = computed<Vokabel | undefined>(() => this.runde()[this.index()]);

  fortschritt = computed(() => {
    const gesamt = this.karten().length;
    return gesamt === 0 ? 0 : (this.gewusst().length / gesamt) * 100;
  });

  /**
   * Restarts the trainer and shuffles all terms.
   */
  start() {
    this.runde.set(mischen(this.karten()));
    this.index.set(0);
    this.umgedreht.set(false);
    this.nochUeben.set([]);
    this.gewusst.set([]);
    this.gestartet.set(true);
    this.fertig.set(this.karten().length === 0);
  }

  /**
   * Flips the current card between term and explanation.
   */
  umdrehen() {
    this.umgedreht.update((wert) => !wert);
  }

  /**
   * Saves the self-assessment and moves to the next card.
   * @param kennt True if the term was known.
   */
  bewerten(kennt: boolean) {
    const karte = this.aktuelle();
    if (!karte) return;
    if (kennt) {
      this.gewusst.update((liste) => [...liste, karte.begriff]);
    } else {
      this.nochUeben.update((liste) => [...liste, karte]);
    }
    this.weiter();
  }

  /**
   * Moves to the next card. At the end of a round, the remaining terms are shown again.
   */
  private weiter() {
    this.umgedreht.set(false);
    if (this.index() < this.runde().length - 1) {
      this.index.update((wert) => wert + 1);
      return;
    }
    const offen = this.nochUeben();
    if (offen.length > 0) {
      this.runde.set(mischen(offen));
      this.nochUeben.set([]);
      this.index.set(0);
    } else {
      this.fertig.set(true);
    }
  }
}
