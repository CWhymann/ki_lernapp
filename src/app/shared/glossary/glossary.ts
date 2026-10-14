import { Component, input, signal } from '@angular/core';

export interface GlossaryTerm {
  name: string;
  explanation: string;
}

@Component({
  selector: 'app-glossary',
  imports: [],
  templateUrl: './glossary.html',
})
export class Glossary {
  terms = input.required<GlossaryTerm[]>();

  openIndex = signal<number | null>(null);

  toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
