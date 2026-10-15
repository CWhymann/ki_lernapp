import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

@Component({
  selector: 'app-neuronale-netze',
  imports: [DecimalPipe, Quiz],
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
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du verstehst, wie Gewichte und Schwellenwert zusammenspielen.',
    gut: 'Gut. Probier die Schaltung oben mit verschiedenen Kombinationen aus.',
    schwach: 'Schau dir die Schaltung oben noch einmal an und lies die Erklärungen zu den Fragen.',
  };
}
