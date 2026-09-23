import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-training',
  imports: [FormsModule],
  templateUrl: './training.html',
  styleUrl: './training.css',
})
export class Training {
  dataAmount = signal(10);

  accuracy = computed(() => {
    const amount = this.dataAmount();
    // simuliert abnehmenden Grenznutzen: viel Zuwachs am Anfang, Abflachen bei hohen Werten
    const value = 100 * (1 - Math.exp(-amount / 35));
    return Math.round(value);
  });

  qualityNote = computed(() => {
    const acc = this.accuracy();
    if (acc < 30) return 'Viel zu wenig Daten - die KI rät quasi.';
    if (acc < 60) return 'Erste Muster werden erkannt, aber noch sehr unzuverlässig.';
    if (acc < 85) return 'Solide Grundlage, aber es gibt noch klare Lücken.';
    return 'Sehr gute Trefferquote - aber Achtung: mehr Daten bedeuten nicht automatisch bessere Daten.';
  });
}
