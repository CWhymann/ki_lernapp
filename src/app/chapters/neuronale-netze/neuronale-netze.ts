import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-neuronale-netze',
  imports: [DecimalPipe],
  templateUrl: './neuronale-netze.html',
  styleUrl: './neuronale-netze.css',
})
export class NeuronaleNetze {
  inputs = signal([false, false, false]);

  weights = [0.9, 0.6, 0.3];
  threshold = 1.0;

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
}
