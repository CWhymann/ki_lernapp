import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  isOpen = signal(false);

  chapters = [
    { path: '/prompting', label: 'Prompting' },
    { path: '/ki-einrichten', label: 'KI einrichten' },
    { path: '/tokens', label: 'Tokens' },
    { path: '/training', label: 'Training' },
    { path: '/neuronale-netze', label: 'Neuronale Netze' },
    { path: '/modelle', label: 'Modelle' },
    { path: '/halluzinationen', label: 'Halluzinationen' },
    { path: '/bias', label: 'Bias' },
    { path: '/ki-agenten', label: 'KI-Agenten' },
    { path: '/nerd-ecke', label: 'Nerd-Ecke' },
  ];

  /**
   * Opens or closes the mobile menu.
   */
  toggleMenu() {
    this.isOpen.update((v) => !v);
  }

  /**
   * Closes the mobile menu.
   */
  closeMenu() {
    this.isOpen.set(false);
  }
}
