import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
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

  legal = [
    { path: '/impressum', label: 'Impressum' },
    { path: '/datenschutz', label: 'Datenschutz' },
    { path: '/widerruf', label: 'Widerruf' },
    { path: '/agb', label: 'AGB' },
  ];

  private gespeicherteScrollPosition = 0;

  /**
   * Keeps the page in place while the mobile menu is open and restores the scroll position on close.
   */
  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.seiteFixieren();
      } else {
        this.seiteFreigeben();
      }
    });
    inject(DestroyRef).onDestroy(() => this.seiteFreigeben());
  }

  /**
   * Fixes the body at its current scroll position so that touch scrolling cannot move it.
   */
  private seiteFixieren() {
    if (document.body.style.position === 'fixed') return;
    this.gespeicherteScrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.gespeicherteScrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  }

  /**
   * Removes the fixed body position and returns to the saved scroll position.
   */
  private seiteFreigeben() {
    if (document.body.style.position !== 'fixed') return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, this.gespeicherteScrollPosition);
  }

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
