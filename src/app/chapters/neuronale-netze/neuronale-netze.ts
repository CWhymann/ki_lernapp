import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { GRUNDBEGRIFFE } from '../../shared/glossary/begriffe';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

/** Words that can be selected in the attention example. */
type AttentionWort = 'sie' | 'müde';

/** One row of the attention bars. */
interface AttentionZeile {
  wort: string;
  anteil: number;
}

@Component({
  selector: 'app-neuronale-netze',
  imports: [DecimalPipe, Quiz, Glossary],
  templateUrl: './neuronale-netze.html',
  styleUrl: './neuronale-netze.css',
})
export class NeuronaleNetze {
  inputs = signal([false, false, false]);

  weights = [0.9, 0.6, 0.3];
  threshold = 1.0;

  /**
   * Switches one input neuron on or off.
   * @param index Position of the input neuron.
   */
  toggleInput(index: number) {
    this.inputs.update((current) => {
      const copy = [...current];
      copy[index] = !copy[index];
      return copy;
    });
  }

  weightedSum = computed(() => {
    return this.inputs().reduce((sum, active, i) => sum + (active ? this.weights[i] : 0), 0);
  });

  outputActive = computed(() => this.weightedSum() >= this.threshold);

  attentionWoerter = ['Die', 'Katze', 'sitzt', 'weil', 'sie', 'müde', 'ist'];
  waehlbareWoerter: AttentionWort[] = ['sie', 'müde'];

  /** Illustrative attention weights per selected word, in the order of attentionWoerter. */
  attentionGewichte: Record<AttentionWort, number[]> = {
    sie: [0.02, 0.7, 0.08, 0.05, 0.03, 0.1, 0.02],
    müde: [0.03, 0.2, 0.07, 0.1, 0.3, 0.1, 0.2],
  };

  selectedWort = signal<AttentionWort>('sie');

  attentionZeilen = computed<AttentionZeile[]>(() => {
    const gewichte = this.attentionGewichte[this.selectedWort()];
    return this.attentionWoerter.map((wort, i) => ({
      wort,
      anteil: Math.round(gewichte[i] * 100),
    }));
  });

  glossar: GlossaryTerm[] = GRUNDBEGRIFFE.filter((term: GlossaryTerm) =>
    ['Modell', 'Parameter', 'Token'].includes(term.name),
  );

  /**
   * Selects the word whose attention is shown.
   * @param wort The selected word.
   */
  waehleWort(wort: AttentionWort) {
    this.selectedWort.set(wort);
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Woraus besteht ein neuronales Netz grundsätzlich?',
      options: [
        'Aus vielen Neuronen, die in Schichten angeordnet sind',
        'Aus einer einzigen großen Textdatei',
        'Aus Kabeln und Relais',
      ],
      correct: 0,
      explanation:
        'Ein neuronales Netz besteht aus vielen künstlichen Neuronen, die in Schichten miteinander verbunden sind.',
    },
    {
      question: 'Was ist ein Gewicht in einem neuronalen Netz?',
      options: [
        'Die Stärke, mit der ein Signal weitergegeben wird',
        'Das Gewicht des Rechners',
        'Die Länge eines Textes',
      ],
      correct: 0,
      explanation:
        'Ein Gewicht ist eine Zahl an einer Verbindung. Sie bestimmt, wie stark das Signal zählt.',
    },
    {
      question: 'Wann feuert ein Neuron?',
      options: [
        'Wenn die Summe der Signale den Schwellenwert überschreitet',
        'Immer, sobald ein Eingang aktiv ist',
        'Nur wenn das Netz ausgeschaltet wird',
      ],
      correct: 0,
      explanation:
        'Erst wenn die gewichtete Summe den Schwellenwert erreicht, gibt das Neuron ein Signal weiter.',
    },
    {
      question: 'Was passiert beim Training mit den Gewichten?',
      options: [
        'Sie werden automatisch angepasst, bis die Ausgabe stimmt',
        'Sie werden gelöscht',
        'Sie bleiben für immer gleich',
      ],
      correct: 0,
      explanation:
        'Beim Training passt das Netz die Gewichte so an, dass es möglichst oft die richtige Ausgabe liefert.',
    },
    {
      question: 'Was bestimmen die Gewichte im Beispiel oben?',
      options: [
        'Wie stark jedes Eingangssignal zählt',
        'Wie viele Fragen der Nutzer gestellt hat',
        'Wie groß der Bildschirm ist',
      ],
      correct: 0,
      explanation:
        'Jeder Eingang hat ein eigenes Gewicht. Ein hohes Gewicht sorgt dafür, dass das Signal stärker zählt.',
    },
    {
      question: 'Was zeigt die Schaltung oben?',
      options: [
        'Wie Signale gewichtet und mit dem Schwellenwert verglichen werden',
        'Wie man Bilder bearbeitet',
        'Wie ein Internetserver funktioniert',
      ],
      correct: 0,
      explanation:
        'Die Eingänge werden gewichtet, addiert und mit dem Schwellenwert verglichen. Daraus ergibt sich, ob das Output-Neuron feuert.',
    },
    {
      question: 'Was macht Attention in einem Transformer?',
      options: [
        'Jedes Wort gewichtet, wie wichtig andere Wörter für seine Bedeutung sind',
        'Sie zählt die Buchstaben eines Textes',
        'Sie löscht unwichtige Wörter aus dem Text',
      ],
      correct: 0,
      explanation:
        'Attention bestimmt, auf welche anderen Wörter ein Wort schaut, um seine Bedeutung im Satz zu verstehen.',
    },
    {
      question: 'Auf welcher Bauweise beruhen heutige Sprachmodelle wie ChatGPT oder Claude?',
      options: [
        'Auf dem Transformer',
        'Auf einem Stromwandler im Rechner',
        'Auf einem Bildbearbeitungsprogramm',
      ],
      correct: 0,
      explanation: 'Der Transformer mit Attention ist die Grundlage moderner Sprachmodelle.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du verstehst Gewichte, Schwellenwert und Attention.',
    gut: 'Gut. Probier die Schaltung und die Attention-Übung mit verschiedenen Wörtern aus.',
    schwach: 'Schau dir die Schaltung und die Attention-Übung oben noch einmal an.',
  };
}
