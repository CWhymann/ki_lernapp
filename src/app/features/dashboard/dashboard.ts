import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ChapterCard {
  path?: string;
  bald?: boolean;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cards: ChapterCard[] = [
    {
      path: '/prompting',
      title: 'Prompting',
      description: 'Wie formuliert man Anfragen, damit eine KI sie richtig versteht?',
      icon: '💬',
    },
    {
      path: '/training',
      title: 'Training',
      description: 'Wie lernt eine KI aus Daten?',
      icon: '🧠',
    },
    {
      path: '/tokens',
      title: 'Tokens',
      description: 'Wie zerlegt eine KI Text in verarbeitbare Einheiten?',
      icon: '🔤',
    },
    {
      path: '/halluzinationen',
      title: 'Halluzinationen',
      description: 'Warum erfindet eine KI manchmal Fakten?',
      icon: '👻',
    },
    {
      path: '/bias',
      title: 'Bias',
      description: 'Wie entstehen Verzerrungen in KI-Antworten?',
      icon: '⚖️',
    },
    {
      path: '/neuronale-netze',
      title: 'Neuronale Netze',
      description: 'Wie ist eine KI grundlegend aufgebaut?',
      icon: '🕸️',
    },
    {
      path: '/ki-einrichten',
      title: 'KI einrichten',
      description: 'Wie installiert und nutzt man KI auf dem eigenen Rechner?',
      icon: '⚙️',
    },
    {
      title: 'News',
      description: 'Alles rund um KI, tagesaktuell.',
      icon: '📰',
      bald: true,
    },
    {
      title: 'Modelle',
      description: 'Welches KI-Modell kann was und wofür ist es gedacht?',
      icon: '🤖',
      bald: true,
    },
    {
      title: 'Nerd-Ecke',
      description: 'Quantenphysik und weitere Nerd-Themen rund um Technik und KI.',
      icon: '⚛️',
      bald: true,
    },
    {
      title: 'KI-Agenten',
      description: 'Wie arbeiten KI-Agenten selbstständig und wo liegen ihre Grenzen?',
      icon: '🦾',
      bald: true,
    },
    {
      title: 'Datenschutz & Sicherheit',
      description: 'Was darf man einer KI anvertrauen und wie erkennt man Deepfakes?',
      icon: '🔒',
      bald: true,
    },
  ];
}
