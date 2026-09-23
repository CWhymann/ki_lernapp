import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Prompting } from './chapters/prompting/prompting';
import { Training } from './chapters/training/training';
import { Tokens } from './chapters/tokens/tokens';
import { Halluzinationen } from './chapters/halluzinationen/halluzinationen';
import { Bias } from './chapters/bias/bias';
import { NeuronaleNetze } from './chapters/neuronale-netze/neuronale-netze';
import { KiEinrichten } from './chapters/ki-einrichten/ki-einrichten';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'prompting', component: Prompting },
  { path: 'training', component: Training },
  { path: 'tokens', component: Tokens },
  { path: 'halluzinationen', component: Halluzinationen },
  { path: 'bias', component: Bias },
  { path: 'neuronale-netze', component: NeuronaleNetze },
  { path: 'ki-einrichten', component: KiEinrichten },
];
