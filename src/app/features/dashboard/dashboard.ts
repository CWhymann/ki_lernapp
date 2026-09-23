import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ChapterCard {
  path: string;
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
  ];
}
