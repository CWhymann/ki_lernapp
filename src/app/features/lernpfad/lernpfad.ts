import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Color classes for one stage of the learning path. */
interface Farbe {
  rahmen: string;
  text: string;
  linie: string;
  balken: string;
  karte: string;
}

/** A single lesson or upcoming topic on the learning path. */
interface PfadKarte {
  titel: string;
  beschreibung: string;
  icon: string;
  schwierigkeit: 1 | 2 | 3;
  path?: string;
}

/** A stage of the learning path with its cards. */
interface Stufe {
  nummer: number;
  titel: string;
  untertitel: string;
  farbe: Farbe;
  karten: PfadKarte[];
}

const FARBEN = {
  cyan: {
    rahmen: 'border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.15)]',
    text: 'text-cyan-300',
    linie: 'from-cyan-400 to-transparent',
    balken: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    karte: 'border-cyan-500/30 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
  },
  emerald: {
    rahmen: 'border-emerald-400/50 shadow-[0_0_25px_rgba(52,211,153,0.15)]',
    text: 'text-emerald-300',
    linie: 'from-emerald-400 to-transparent',
    balken: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    karte:
      'border-emerald-500/30 hover:border-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]',
  },
  pink: {
    rahmen: 'border-pink-400/50 shadow-[0_0_25px_rgba(255,45,149,0.15)]',
    text: 'text-pink-300',
    linie: 'from-pink-400 to-transparent',
    balken: 'bg-pink-400 shadow-[0_0_8px_rgba(255,45,149,0.8)]',
    karte: 'border-pink-500/30 hover:border-pink-300 hover:shadow-[0_0_20px_rgba(255,45,149,0.2)]',
  },
  violet: {
    rahmen: 'border-violet-400/50 shadow-[0_0_25px_rgba(167,139,250,0.15)]',
    text: 'text-violet-300',
    linie: 'from-violet-400 to-transparent',
    balken: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]',
    karte:
      'border-violet-500/30 hover:border-violet-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)]',
  },
} satisfies Record<string, Farbe>;

const SCHWIERIGKEIT = ['Einstieg', 'Mittel', 'Fortgeschritten'];

@Component({
  selector: 'app-lernpfad',
  imports: [RouterLink],
  templateUrl: './lernpfad.html',
  styleUrl: './lernpfad.css',
})
export class Lernpfad {
  readonly balken = [1, 2, 3];

  readonly stufen: Stufe[] = [
    {
      nummer: 1,
      titel: 'Einstieg',
      untertitel: 'Wie du mit KI sprichst und sie einrichtest',
      farbe: FARBEN.cyan,
      karten: [
        {
          titel: 'Prompting',
          beschreibung: 'Wie formuliert man Anfragen, damit eine KI sie richtig versteht?',
          icon: '💬',
          schwierigkeit: 1,
          path: '/prompting',
        },
        {
          titel: 'KI einrichten',
          beschreibung: 'Dein eigenes Modell auf dem Rechner, offline und ohne Abo.',
          icon: '⚙️',
          schwierigkeit: 2,
          path: '/ki-einrichten',
        },
      ],
    },
    {
      nummer: 2,
      titel: 'Grundlagen',
      untertitel: 'Wie eine KI aufgebaut ist und lernt',
      farbe: FARBEN.emerald,
      karten: [
        {
          titel: 'Tokens',
          beschreibung: 'Wie zerlegt eine KI Text in verarbeitbare Einheiten?',
          icon: '🔤',
          schwierigkeit: 1,
          path: '/tokens',
        },
        {
          titel: 'Training',
          beschreibung: 'Wie lernt eine KI aus Daten?',
          icon: '🧠',
          schwierigkeit: 2,
          path: '/training',
        },
        {
          titel: 'Neuronale Netze',
          beschreibung: 'Wie ist eine KI grundlegend aufgebaut?',
          icon: '🕸️',
          schwierigkeit: 3,
          path: '/neuronale-netze',
        },
        {
          titel: 'Modelle',
          beschreibung: 'Welches KI-Modell kann was und wofür?',
          icon: '🤖',
          schwierigkeit: 2,
          path: '/modelle',
        },
      ],
    },
    {
      nummer: 3,
      titel: 'Vertiefung',
      untertitel: 'Wo KI danebenliegt und warum',
      farbe: FARBEN.pink,
      karten: [
        {
          titel: 'Halluzinationen',
          beschreibung: 'Warum erfindet eine KI manchmal Fakten?',
          icon: '👻',
          schwierigkeit: 2,
          path: '/halluzinationen',
        },
        {
          titel: 'Bias',
          beschreibung: 'Wie entstehen Verzerrungen in KI-Antworten?',
          icon: '⚖️',
          schwierigkeit: 3,
          path: '/bias',
        },
      ],
    },
    {
      nummer: 4,
      titel: 'Erweiterungen',
      untertitel: 'Weiterführende Themen',
      farbe: FARBEN.violet,
      karten: [
        {
          titel: 'KI-Agenten',
          beschreibung: 'Wie arbeiten KI-Agenten selbstständig?',
          icon: '🦾',
          schwierigkeit: 3,
          path: '/ki-agenten',
        },
        {
          titel: 'Datenschutz & Sicherheit',
          beschreibung: 'Was darf man einer KI anvertrauen?',
          icon: '🔒',
          schwierigkeit: 2,
        },
        {
          titel: 'Nerd-Ecke',
          beschreibung: 'Quantentechnik, KI und mehr zum Ausprobieren.',
          icon: '⚛️',
          schwierigkeit: 3,
          path: '/nerd-ecke',
        },
        {
          titel: 'News',
          beschreibung: 'Alles rund um KI, tagesaktuell.',
          icon: '📰',
          schwierigkeit: 1,
        },
      ],
    },
  ];

  /**
   * Returns the German label for a difficulty level.
   * @param stufe Difficulty from 1 to 3.
   * @returns Text label for the level.
   */
  schwierigkeitText(stufe: 1 | 2 | 3): string {
    return SCHWIERIGKEIT[stufe - 1];
  }
}
