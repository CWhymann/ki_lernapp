import { Component, computed, input, signal } from '@angular/core';

export interface Vokabel {
  begriff: string;
  erklaerung: string;
}

/**
 * Mischt eine Kopie der Liste mit dem Fisher-Yates-Verfahren.
 * @param liste Ausgangsliste, bleibt unverändert.
 * @returns Neue, gemischte Liste.
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
   * Startet den Trainer neu und mischt alle Begriffe.
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
   * Dreht die aktuelle Karte zwischen Begriff und Erklärung um.
   */
  umdrehen() {
    this.umgedreht.update((wert) => !wert);
  }

  /**
   * Speichert die Einschätzung und geht zur nächsten Karte.
   * @param kennt true, wenn der Begriff gewusst wurde.
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
   * Geht zur nächsten Karte. Am Ende einer Runde kommen die noch offenen Begriffe erneut.
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
