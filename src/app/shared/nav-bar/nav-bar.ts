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
    { path: '/training', label: 'Training' },
    { path: '/tokens', label: 'Tokens' },
    { path: '/halluzinationen', label: 'Halluzinationen' },
    { path: '/bias', label: 'Bias' },
    { path: '/neuronale-netze', label: 'Neuronale Netze' },
    { path: '/ki-einrichten', label: 'KI einrichten' },
  ];

  toggleMenu() {
    this.isOpen.update((v) => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
  }
}
