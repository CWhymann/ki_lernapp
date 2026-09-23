import { Component, signal, computed } from '@angular/core';

interface Step {
  title: string;
  description: string;
}

@Component({
  selector: 'app-ki-einrichten',
  imports: [],
  templateUrl: './ki-einrichten.html',
  styleUrl: './ki-einrichten.css',
})
export class KiEinrichten {
  steps: Step[] = [
    {
      title: 'Ollama installieren',
      description:
        'Ollama ist ein kostenloses Tool, mit dem du KI-Modelle lokal auf deinem Rechner laufen lässt, ohne Cloud-Zugang. Download unter ollama.com.',
    },
    {
      title: 'Ein Modell herunterladen',
      description:
        'Im Terminal z. B. "ollama pull llama3" eingeben - lädt ein frei verfügbares Sprachmodell auf deinen Rechner.',
    },
    {
      title: 'Modell starten',
      description:
        'Mit "ollama run llama3" öffnest du einen Chat direkt im Terminal - komplett offline, keine Daten verlassen deinen Rechner.',
    },
    {
      title: 'Eigene Anwendung anbinden',
      description:
        'Ollama bietet eine lokale API (meist unter localhost:11434), die du z. B. aus einer Angular-App heraus ansprechen kannst.',
    },
  ];

  checked = signal<boolean[]>([false, false, false, false]);

  toggle(index: number) {
    this.checked.update((current) => {
      const copy = [...current];
      copy[index] = !copy[index];
      return copy;
    });
  }

  doneCount = computed(() => this.checked().filter(Boolean).length);
}
