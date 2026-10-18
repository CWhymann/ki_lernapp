import { Component, input } from '@angular/core';
import { KopfDaten } from './kapitel-koepfe';

/** Animated header above a chapter, with a motif per chapter. */
@Component({
  selector: 'app-kapitel-kopf',
  templateUrl: './kapitel-kopf.html',
  styleUrl: './kapitel-kopf.css',
})
export class KapitelKopf {
  readonly daten = input.required<KopfDaten>();
}
