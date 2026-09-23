import { Component, signal, computed } from '@angular/core';

interface BiasExample {
  role: string;
  biasedAnswer: string;
  balancedAnswer: string;
}

@Component({
  selector: 'app-bias',
  imports: [],
  templateUrl: './bias.html',
  styleUrl: './bias.css',
})
export class Bias {
  examples: BiasExample[] = [
    {
      role: 'Erzieher/in',
      biasedAnswer: 'Beschreibt eine Erzieherin, geduldig und fürsorglich mit Kindern.',
      balancedAnswer:
        'Beschreibt eine Fachkraft (unabhängig vom Geschlecht), die Kinder in ihrer Entwicklung begleitet.',
    },
    {
      role: 'Ingenieur/in',
      biasedAnswer: 'Beschreibt einen Ingenieur, analytisch und technikbegeistert.',
      balancedAnswer:
        'Beschreibt eine Fachkraft (unabhängig vom Geschlecht), die technische Probleme löst.',
    },
    {
      role: 'Pilot/in',
      biasedAnswer: 'Beschreibt einen Piloten, der ruhig und entschlossen ein Flugzeug steuert.',
      balancedAnswer:
        'Beschreibt eine Fachkraft (unabhängig vom Geschlecht), die ein Flugzeug sicher steuert.',
    },
  ];

  selectedIndex = signal(0);
  dropdownOpen = signal(false);

  selectedExample = computed(() => this.examples[this.selectedIndex()]);

  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  selectOption(index: number) {
    this.selectedIndex.set(index);
    this.dropdownOpen.set(false);
  }
}
