import { Component, signal } from '@angular/core';

interface Claim {
  text: string;
  isTrue: boolean;
  explanation: string;
}

@Component({
  selector: 'app-halluzinationen',
  imports: [],
  templateUrl: './halluzinationen.html',
  styleUrl: './halluzinationen.css',
})
export class Halluzinationen {
  claims: Claim[] = [
    {
      text: 'Der Eiffelturm wurde 1889 fertiggestellt.',
      isTrue: true,
      explanation: 'Stimmt - zur Weltausstellung 1889 in Paris.',
    },
    {
      text: 'Albert Einstein erhielt den Nobelpreis für die Relativitätstheorie.',
      isTrue: false,
      explanation:
        'Erfunden - er bekam ihn 1921 für den photoelektrischen Effekt, nicht für die Relativitätstheorie.',
    },
    {
      text: 'Die Great Firewall of China wurde 1998 unter dem Namen "Golden Shield Project" gestartet.',
      isTrue: true,
      explanation: 'Stimmt - so hiess das offizielle Projekt tatsächlich.',
    },
    {
      text: 'Die erste E-Mail wurde 1965 von Bill Gates verschickt.',
      isTrue: false,
      explanation:
        'Erfunden - die erste E-Mail verschickte Ray Tomlinson 1971, Bill Gates hatte damit nichts zu tun.',
    },
  ];

  answered = signal<Record<number, boolean>>({});

  answer(index: number, guessTrue: boolean) {
    const claim = this.claims[index];
    this.answered.update((current) => ({ ...current, [index]: guessTrue === claim.isTrue }));
  }

  isAnswered(index: number): boolean {
    return this.answered()[index] !== undefined;
  }

  wasCorrect(index: number): boolean {
    return this.answered()[index] === true;
  }
}
