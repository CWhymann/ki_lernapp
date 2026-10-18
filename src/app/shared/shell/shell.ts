import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { KapitelKopf } from '../kapitel-kopf/kapitel-kopf';
import { KAPITEL_KOEPFE } from '../kapitel-kopf/kapitel-koepfe';
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
 * Returns the route path of a URL without slash, query and fragment.
 * @param url Current router URL.
 * @returns Path such as "prompting".
 */
function pfadFuerUrl(url: string): string {
  return url.split('?')[0].split('#')[0].replace(/^\//, '');
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NavBar, KapitelKopf],
  templateUrl: './shell.html',
})
export class Shell {
  private readonly router = inject(Router);

  private readonly pfad = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => pfadFuerUrl(this.router.url)),
    ),
    { initialValue: pfadFuerUrl(this.router.url) },
  );

  readonly farbe = computed(() => KAPITEL_FARBEN[this.pfad()] ?? 'cyan');

  readonly kopf = computed(() => KAPITEL_KOEPFE[this.pfad()] ?? null);
}
