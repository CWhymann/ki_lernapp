import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavBar } from '../nav-bar/nav-bar';

/** Accent colors of the learning path stages. */
type Farbe = 'cyan' | 'emerald' | 'pink' | 'violet';

const KAPITEL_FARBEN: Record<string, Farbe> = {
  prompting: 'cyan',
  'ki-einrichten': 'cyan',
  tokens: 'emerald',
  training: 'emerald',
  'neuronale-netze': 'emerald',
  modelle: 'emerald',
  halluzinationen: 'pink',
  bias: 'pink',
  'nerd-ecke': 'violet',
  'ki-agenten': 'violet',
};

/**
 * Returns the accent color for a URL, based on the learning path stage of its chapter.
 * @param url Current router URL.
 * @returns Accent color, cyan by default.
 */
function farbeFuerUrl(url: string): Farbe {
  const pfad = url.split('?')[0].split('#')[0].replace(/^\//, '');
  return KAPITEL_FARBEN[pfad] ?? 'cyan';
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NavBar],
  templateUrl: './shell.html',
})
export class Shell {
  private readonly router = inject(Router);

  readonly farbe = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => farbeFuerUrl(this.router.url)),
    ),
    { initialValue: farbeFuerUrl(this.router.url) },
  );
}
