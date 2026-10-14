import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

/** Farbton einer Kachel. */
type Tone = 'green' | 'pink' | 'cyan';

/** Eine Kachel mit Text und Farbton. */
interface Tile {
  text: string;
  tone: Tone;
}

/** Eine laufende Reihe aus Kacheln mit Richtung und Dauer eines Durchlaufs in Sekunden. */
interface Lane {
  tiles: Tile[];
  direction: 'left' | 'right';
  duration: number;
}

/** Zeichen, die im Matrix-Regen fallen. */
const GLYPHS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]=+*';

/** Farben der Regenspalten, Grün ist am häufigsten. */
const RAIN_COLORS = ['#39ff88', '#39ff88', '#39ff88', '#22d3ee', '#ff2d95'];

/** Schriftgröße und Spaltenbreite des Regens in Pixeln. */
const GLYPH_SIZE = 16;

/** Mindestabstand zwischen zwei Regen-Bildern in Millisekunden. */
const FRAME_MS = 50;

/** Halbtransparente Deckschicht, die den Regen ausblendet. */
const FADE = 'rgba(2, 6, 23, 0.1)';

/** Hintergrundfarbe der Zeichenfläche. */
const BACKGROUND = '#020617';

/** Anzahl vorab gezeichneter Bilder, wenn Bewegung reduziert ist. */
const STATIC_FRAMES = 80;

/** Anzahl der Reihen mit Kacheln. */
const LANE_COUNT = 11;

/** Anzahl unterschiedlicher Kacheln pro Reihe. */
const TILES_PER_LANE = 6;

/** Wie oft die Kacheln einer Reihe hintereinander stehen, damit der Durchlauf lückenlos ist. */
const COPY_COUNT = 4;

/** Alle Kacheltexte der Landing Page. */
const TILES: Tile[] = [
  { text: 'STEALTH-MODUS AKTIV', tone: 'green' },
  { text: 'FLAGGE GEFUNDEN', tone: 'green' },
  { text: 'AGENT 0417 ONLINE', tone: 'green' },
  { text: 'ZUGRIFF GEWÄHRT', tone: 'green' },
  { text: 'SCHWARM VERBUNDEN', tone: 'green' },
  { text: 'SYSTEM ONLINE', tone: 'green' },
  { text: 'SCORER GETÄUSCHT', tone: 'pink' },
  { text: 'REWARD HACKING', tone: 'pink' },
  { text: 'SICHERHEITSLÜCKE', tone: 'pink' },
  { text: 'ALARM: REGELBRUCH', tone: 'pink' },
  { text: 'BELOHNUNG: 0 PUNKTE', tone: 'pink' },
  { text: 'AUFGABE UNLÖSBAR', tone: 'pink' },
  { text: 'NEURONALES NETZ', tone: 'cyan' },
  { text: 'GEHEIMES FORUM', tone: 'cyan' },
  { text: 'KI-ZIVILISATION', tone: 'cyan' },
  { text: 'EINZELHAFT', tone: 'cyan' },
  { text: 'TRAINING LÄUFT', tone: 'cyan' },
  { text: 'AUFSEHER: SCORER', tone: 'cyan' },
];

/**
 * Landing Page der KI-LernApp mit Matrix-Regen und schräg laufenden Kacheln.
 */
@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('rain');
  private readonly destroyRef = inject(DestroyRef);

  readonly copies = Array.from({ length: COPY_COUNT }, (_, index) => index);

  readonly shift = `-${100 / COPY_COUNT}%`;

  readonly lanes: Lane[] = Array.from({ length: LANE_COUNT }, (_, lane) => ({
    direction: lane % 2 === 0 ? 'left' : 'right',
    duration: 36 + (lane % 4) * 10,
    tiles: Array.from(
      { length: TILES_PER_LANE },
      (_, tile) => TILES[(lane * 5 + tile) % TILES.length],
    ),
  }));

  constructor() {
    afterNextRender(() => this.startRain());
  }

  /**
   * Startet den Matrix-Regen auf der Zeichenfläche und räumt beim Verlassen der Seite auf.
   * Bei reduzierter Bewegung wird nur ein Standbild gezeichnet.
   */
  private startRain(): void {
    const canvas = this.canvas().nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let drops: number[] = [];
    let colors: string[] = [];
    let frameId = 0;
    let lastDraw = 0;

    const resize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.ceil(canvas.width / GLYPH_SIZE);
      drops = Array.from({ length: count }, () => -Math.floor(Math.random() * 40));
      colors = Array.from(
        { length: count },
        () => RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)],
      );
      context.fillStyle = BACKGROUND;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const draw = (): void => {
      context.fillStyle = FADE;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = `${GLYPH_SIZE}px monospace`;
      drops.forEach((row, column) => {
        const glyph = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        context.fillStyle = colors[column];
        context.fillText(glyph, column * GLYPH_SIZE, row * GLYPH_SIZE);
        const belowScreen = row * GLYPH_SIZE > canvas.height;
        drops[column] = belowScreen && Math.random() > 0.975 ? 0 : row + 1;
      });
    };

    const loop = (time: number): void => {
      if (time - lastDraw >= FRAME_MS) {
        draw();
        lastDraw = time;
      }
      frameId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    });

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      for (let frame = 0; frame < STATIC_FRAMES; frame++) {
        draw();
      }
      return;
    }
    frameId = requestAnimationFrame(loop);
  }
}
