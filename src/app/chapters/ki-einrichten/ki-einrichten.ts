import { Component, DestroyRef, computed, inject, signal } from '@angular/core';

interface ComparisonRow {
  topic: string;
  cloud: string;
  local: string;
}

interface Model {
  paramsB: number;
  description: string;
}

interface Quant {
  label: string;
  bits: number;
  hint: string;
}

type FitStatus = 'gpu' | 'ram' | 'too-big';

interface FitResult {
  model: Model;
  need: number;
  status: FitStatus;
  percent: number;
}

interface StatusInfo {
  label: string;
  badge: string;
  bar: string;
}

interface Rank {
  paramsB: number;
  icon: string;
  title: string;
  text: string;
}

interface TerminalStep {
  title: string;
  description: string;
  command: string;
  output: string[];
}

interface LogLine {
  kind: 'cmd' | 'out';
  text: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

@Component({
  selector: 'app-ki-einrichten',
  imports: [],
  templateUrl: './ki-einrichten.html',
  styleUrl: './ki-einrichten.css',
})
export class KiEinrichten {
  private destroyRef = inject(DestroyRef);
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => (this.destroyed = true));
  }

  // ---------- 1: Cloud oder lokal ----------
  offline = signal(false);

  comparison: ComparisonRow[] = [
    {
      topic: 'Datenschutz',
      cloud: 'Deine Texte liegen auf fremden Servern',
      local: 'Alles bleibt auf deinem Rechner',
    },
    {
      topic: 'Kosten',
      cloud: 'Oft Abo oder Nutzungsgebühr',
      local: 'Nach dem Download kostenlos',
    },
    {
      topic: 'Internet',
      cloud: 'Zwingend nötig',
      local: 'Nur zum Herunterladen nötig',
    },
    {
      topic: 'Leistung',
      cloud: 'Riesige Modelle, sehr stark',
      local: 'Kleiner, begrenzt durch deine Hardware',
    },
  ];

  toggleOffline() {
    this.offline.update((value) => !value);
  }

  // ---------- 2: Hardware-Labor ----------
  ram = signal(16);
  vram = signal(8);
  quantIndex = signal(2);

  quants: Quant[] = [
    { label: '16-Bit', bits: 16, hint: 'Volle Genauigkeit, aber ein riesiger Speicherhunger.' },
    { label: '8-Bit', bits: 8, hint: 'Fast so gut wie das Original, nur halb so groß.' },
    {
      label: '4-Bit',
      bits: 4,
      hint: 'Der Standard für zu Hause: winzig im Vergleich und noch erstaunlich gut.',
    },
  ];

  models: Model[] = [
    { paramsB: 1, description: 'Winzling: einfache Aufgaben, läuft fast überall.' },
    {
      paramsB: 3,
      description: 'Laptop-Allrounder: zusammenfassen, umformulieren, kurze Antworten.',
    },
    { paramsB: 8, description: 'Sweet Spot: solide Gespräche und einfacher Code.' },
    { paramsB: 14, description: 'Spürbar klüger, braucht aber schon ordentlich Speicher.' },
    { paramsB: 32, description: 'Profi-Liga: starke Antworten, Workstation-Territorium.' },
    { paramsB: 70, description: 'Schwergewicht: nahe an Cloud-Niveau, nur mit Monster-Hardware.' },
  ];

  statusInfo: Record<FitStatus, StatusInfo> = {
    gpu: {
      label: '⚡ Turbo (läuft auf der Grafikkarte)',
      badge: 'text-sm px-2 py-1 rounded-full border border-emerald-400 text-emerald-300',
      bar: 'bg-emerald-400',
    },
    ram: {
      label: '🐢 Läuft, aber gemächlich (RAM)',
      badge: 'text-sm px-2 py-1 rounded-full border border-amber-400 text-amber-300',
      bar: 'bg-amber-400',
    },
    'too-big': {
      label: '❌ Passt nicht',
      badge: 'text-sm px-2 py-1 rounded-full border border-red-400 text-red-300',
      bar: 'bg-red-400',
    },
  };

  ranks: Rank[] = [
    {
      paramsB: 0,
      icon: '🍞',
      title: 'Toaster-Klasse',
      text: 'Dafür reicht es noch nicht. Probier 4-Bit oder mehr RAM.',
    },
    {
      paramsB: 1,
      icon: '📱',
      title: 'Smartphone-Klasse',
      text: 'Kleine Modelle laufen schon, genug zum Ausprobieren.',
    },
    {
      paramsB: 3,
      icon: '💻',
      title: 'Laptop-Held',
      text: 'Ein brauchbarer Alltags-Assistent passt auf deinen Rechner.',
    },
    {
      paramsB: 8,
      icon: '🎮',
      title: 'Gaming-Maschine',
      text: 'Der Sweet Spot ist erreicht: Gespräche und Code machen Spaß.',
    },
    {
      paramsB: 14,
      icon: '🖥️',
      title: 'Workstation',
      text: 'Hier wird es richtig ernst, die Antworten werden deutlich klüger.',
    },
    {
      paramsB: 32,
      icon: '🚀',
      title: 'Rechenzentrum im Wohnzimmer',
      text: 'Profi-Modelle laufen bei dir zu Hause.',
    },
    {
      paramsB: 70,
      icon: '👑',
      title: 'Superrechner',
      text: 'Schwergewichte auf dem eigenen Rechner. Respekt.',
    },
  ];

  quant = computed(() => this.quants[this.quantIndex()]);

  results = computed<FitResult[]>(() => {
    const bits = this.quant().bits;
    const ram = this.ram();
    const vram = this.vram();

    return this.models.map((model) => {
      const need = Math.round(model.paramsB * (bits / 8) * 1.2 * 10) / 10;
      let status: FitStatus;
      let limit: number;

      if (need <= vram) {
        status = 'gpu';
        limit = vram;
      } else if (need <= ram * 0.75) {
        status = 'ram';
        limit = ram * 0.75;
      } else {
        status = 'too-big';
        limit = ram * 0.75;
      }

      const percent = Math.min(100, Math.round((need / limit) * 100));
      return { model, need, status, percent };
    });
  });

  rank = computed(() => {
    const fitting = this.results().filter((result) => result.status !== 'too-big');
    const best = fitting.length ? fitting[fitting.length - 1].model.paramsB : 0;
    return this.ranks.find((rank) => rank.paramsB === best) ?? this.ranks[0];
  });

  onRam(event: Event) {
    this.ram.set(Number((event.target as HTMLInputElement).value));
  }

  onVram(event: Event) {
    this.vram.set(Number((event.target as HTMLInputElement).value));
  }

  // ---------- 3: Installations-Mission ----------
  steps: TerminalStep[] = [
    {
      title: 'Ollama installieren und prüfen',
      description:
        'Ollama ist ein kostenloses Programm, das KI-Modelle auf deinem Rechner startet. Lade den Installer von ollama.com herunter und führe ihn aus. Danach prüfst du, ob alles da ist.',
      command: 'ollama --version',
      output: ['ollama version is 0.12.0'],
    },
    {
      title: 'Ein Modell herunterladen',
      description:
        'Jetzt holst du dir das Gehirn: ein frei verfügbares Modell. Das passiert einmal, danach gehört es dir.',
      command: 'ollama pull llama3.2',
      output: [
        'pulling manifest',
        '@progress',
        'verifying sha256 digest',
        'writing manifest',
        'success',
      ],
    },
    {
      title: 'Installierte Modelle anzeigen',
      description: 'Mit dieser Liste siehst du, welche Modelle auf deinem Rechner liegen.',
      command: 'ollama list',
      output: ['NAME               SIZE', 'llama3.2:latest   2.0 GB'],
    },
    {
      title: 'Mit der KI chatten',
      description: 'Jetzt startest du den Chat, komplett offline direkt im Terminal.',
      command: 'ollama run llama3.2',
      output: [
        '>>> Erkläre Tokens in einem Satz.',
        'Tokens sind die kleinen Textbausteine, in die ein Modell deinen Text zerlegt, bevor es ihn verarbeitet.',
        '>>> /bye',
      ],
    },
  ];

  log = signal<LogLine[]>([]);
  done = signal<boolean[]>([false, false, false, false]);
  busy = signal(false);

  doneCount = computed(() => this.done().filter(Boolean).length);
  allDone = computed(() => this.doneCount() === this.steps.length);

  isUnlocked(index: number): boolean {
    return index === 0 || this.done()[index - 1];
  }

  async run(index: number) {
    if (this.busy() || this.done()[index] || !this.isUnlocked(index)) return;

    this.busy.set(true);
    const step = this.steps[index];

    this.log.update((lines) => [...lines, { kind: 'cmd', text: '' }]);
    const commandLine = this.log().length - 1;

    for (let i = 1; i <= step.command.length; i++) {
      if (this.destroyed) return;
      this.setLine(commandLine, step.command.slice(0, i));
      await this.sleep(35);
    }
    await this.sleep(300);

    for (const line of step.output) {
      if (this.destroyed) return;
      if (line === '@progress') {
        await this.showProgress();
      } else {
        this.log.update((lines) => [...lines, { kind: 'out', text: line }]);
        await this.sleep(350);
      }
    }

    this.done.update((current) => current.map((value, i) => (i === index ? true : value)));
    this.busy.set(false);
  }

  reset() {
    if (this.busy()) return;
    this.log.set([]);
    this.done.set([false, false, false, false]);
  }

  private async showProgress() {
    this.log.update((lines) => [...lines, { kind: 'out', text: '' }]);
    const lineIndex = this.log().length - 1;

    for (let percent = 0; percent <= 100; percent += 4) {
      if (this.destroyed) return;
      const filled = Math.round(percent / 5);
      const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
      this.setLine(lineIndex, `pulling model: ${percent}% ▕${bar}▏ 2.0 GB`);
      await this.sleep(90);
    }
  }

  private setLine(index: number, text: string) {
    this.log.update((lines) => lines.map((line, i) => (i === index ? { ...line, text } : line)));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ---------- 4: API-Snippet ----------
  apiSnippet = `const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({ model: 'llama3.2', prompt: 'Hallo!', stream: false }),
});
const data = await response.json();
console.log(data.response);`;

  // ---------- 5: Quiz ----------
  quiz: QuizQuestion[] = [
    {
      question: 'Du schickst eine Frage an dein lokales Modell. Wohin gehen deine Daten?',
      options: [
        'Zu den Servern des Herstellers',
        'Nirgendwohin, sie bleiben auf deinem Rechner',
        'In eine Cloud, die Ollama betreibt',
      ],
      correct: 1,
      explanation:
        'Das Modell rechnet komplett auf deinem Rechner. Internet brauchst du nur einmal, um das Modell herunterzuladen.',
    },
    {
      question: 'Was macht die Quantisierung?',
      options: [
        'Sie verbindet das Modell mit dem Internet',
        'Sie macht das Modell schlauer',
        'Sie speichert die Zahlen im Modell gröber, damit es weniger Speicher braucht',
      ],
      correct: 2,
      explanation:
        'Aus 16-Bit-Zahlen werden zum Beispiel 4-Bit-Zahlen. Das Modell wird dadurch viel kleiner und verliert nur etwas Genauigkeit.',
    },
    {
      question:
        'Ein Modell passt nicht in den Grafikspeicher (VRAM), aber in den normalen Arbeitsspeicher (RAM). Was passiert?',
      options: [
        'Es läuft, aber deutlich langsamer',
        'Es startet gar nicht',
        'Es läuft sogar schneller',
      ],
      correct: 0,
      explanation:
        'Der Prozessor kann das Modell auch aus dem RAM rechnen, aber deutlich langsamer als die Grafikkarte.',
    },
  ];

  quizIndex = signal(0);
  selected = signal<number | null>(null);
  score = signal(0);
  quizFinished = signal(false);

  question = computed(() => this.quiz[this.quizIndex()]);

  scoreText = computed(() => {
    const score = this.score();
    if (score === this.quiz.length) return 'Perfekt! Du hast das Setup komplett verstanden.';
    if (score >= 2)
      return 'Stark! Nur ein kleiner Rest, den du nochmal im Hardware-Labor testen kannst.';
    return 'Spiel das Hardware-Labor nochmal durch, dann sitzt es.';
  });

  choose(index: number) {
    if (this.selected() !== null) return;
    this.selected.set(index);
    if (index === this.question().correct) {
      this.score.update((value) => value + 1);
    }
  }

  nextQuestion() {
    if (this.quizIndex() === this.quiz.length - 1) {
      this.quizFinished.set(true);
    } else {
      this.quizIndex.update((value) => value + 1);
      this.selected.set(null);
    }
  }

  restartQuiz() {
    this.quizIndex.set(0);
    this.selected.set(null);
    this.score.set(0);
    this.quizFinished.set(false);
  }

  optionStyle(index: number): string {
    const base = 'text-left px-4 py-3 rounded-md border-2 text-base transition-all ';
    const selected = this.selected();
    if (selected === null) {
      return base + 'border-slate-600 text-slate-200 hover:border-cyan-500/60';
    }
    if (index === this.question().correct) {
      return base + 'border-emerald-400 bg-emerald-400/10 text-emerald-300';
    }
    if (index === selected) {
      return base + 'border-red-400 bg-red-400/10 text-red-300';
    }
    return base + 'border-slate-700 text-slate-500';
  }
}
