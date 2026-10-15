import { Component, signal } from '@angular/core';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { GRUNDBEGRIFFE } from '../../shared/glossary/begriffe';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

interface Claim {
  text: string;
  isTrue: boolean;
  explanation: string;
}

@Component({
  selector: 'app-halluzinationen',
  imports: [Quiz, Glossary],
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

  glossar: GlossaryTerm[] = GRUNDBEGRIFFE.filter((term: GlossaryTerm) =>
    ['Modell', 'Kontextfenster'].includes(term.name),
  );

  /**
   * Stores whether the guess for a claim was correct.
   * @param index Position of the claim.
   * @param guessTrue True if the user thinks the claim is true.
   */
  answer(index: number, guessTrue: boolean) {
    const claim = this.claims[index];
    this.answered.update((current) => ({ ...current, [index]: guessTrue === claim.isTrue }));
  }

  /**
   * Checks whether a claim has already been answered.
   * @param index Position of the claim.
   * @returns True if the claim was answered.
   */
  isAnswered(index: number): boolean {
    return this.answered()[index] !== undefined;
  }

  /**
   * Checks whether the answer for a claim was correct.
   * @param index Position of the claim.
   * @returns True if the guess was correct.
   */
  wasCorrect(index: number): boolean {
    return this.answered()[index] === true;
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Was ist eine Halluzination bei einer KI?',
      options: [
        'Ein Fehler im Stromnetz',
        'Eine selbstbewusst klingende, aber falsche Aussage',
        'Ein Bild, das die KI gemalt hat',
      ],
      correct: 1,
      explanation:
        'Halluzinationen sind Aussagen, die falsch sind, aber genauso sicher klingen wie richtige.',
    },
    {
      question: 'Warum halluziniert eine KI?',
      options: [
        'Sie lügt absichtlich',
        'Sie erzeugt Text, der plausibel klingt, ohne die Wahrheit zu prüfen',
        'Sie hat keine Daten gespeichert',
      ],
      correct: 1,
      explanation:
        'Die KI bewertet nicht, ob etwas wahr ist. Sie erzeugt Text, der statistisch passend klingt.',
    },
    {
      question: 'Wo passieren Halluzinationen am häufigsten?',
      options: [
        'Bei Namen, Daten, Zahlen und Zitaten',
        'Bei einfachen Begrüßungen',
        'Bei der Rechtschreibung',
      ],
      correct: 0,
      explanation:
        'Genau bei konkreten Angaben wie Namen, Daten und Zahlen passieren die meisten Fehler.',
    },
    {
      question: 'Was hilft gegen Halluzinationen?',
      options: [
        'Wichtige Fakten gegen eine verlässliche Quelle prüfen',
        'Die Antwort glauben, wenn sie sicher klingt',
        'Die gleiche Frage dreimal stellen',
      ],
      correct: 0,
      explanation:
        'Eine verlässliche Quelle ist der beste Check. Dieselbe Frage zu wiederholen liefert oft dieselbe falsche Antwort.',
    },
    {
      question: 'Was sagt ein selbstbewusster Ton über eine Antwort aus?',
      options: [
        'Die Antwort ist sicher richtig',
        'Über die Richtigkeit sagt er nichts',
        'Die KI hat die Quelle geprüft',
      ],
      correct: 1,
      explanation: 'Auch falsche Aussagen klingen sicher. Der Ton sagt nichts über die Wahrheit.',
    },
    {
      question: 'Welche Aussage über Zitate stimmt?',
      options: [
        'KI-Zitate sind immer echt',
        'Zitate aus KI-Antworten sollte man selbst nachprüfen',
        'Zitate erfindet eine KI nie',
      ],
      correct: 1,
      explanation:
        'Auch Zitate können erfunden sein. Bei wichtigen Zitaten lohnt sich immer die Prüfung an der Originalquelle.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du prüfst Fakten, bevor du ihnen glaubst.',
    gut: 'Gut. Lies die Erklärungen zu den Fragen, die du verpasst hast.',
    schwach: 'Probier die Aussagen oben noch einmal und achte auf die Erklärungen.',
  };
}
