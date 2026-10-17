import { Component, computed, signal } from '@angular/core';
import { Glossary, GlossaryTerm } from '../../shared/glossary/glossary';
import { Quiz, QuizQuestion, QuizResultTexts } from '../../shared/quiz/quiz';

type TopicId = 'qubit' | 'verschraenkung' | 'stand' | 'quanten-ki' | 'krypto' | 'strom' | 'nobel';

type Bit = 0 | 1;

type PairMode = 'verschraenkt' | 'unabhaengig';

type SortSide = 'ki-fuer-quanten' | 'quanten-fuer-ki';

type EnergyYear = 2024 | 2030 | 2035;

interface Topic {
  id: TopicId;
  label: string;
  icon: string;
}

interface Milestone {
  year: string;
  title: string;
  text: string;
}

interface Claim {
  text: string;
  isFact: boolean;
  explanation: string;
}

interface SortItem {
  text: string;
  side: SortSide;
  explanation: string;
}

interface EnergyPoint {
  year: EnergyYear;
  twh: number;
  label: string;
  forecast: boolean;
  note: string;
}

interface Prize {
  id: string;
  year: number;
  field: string;
  names: string;
  reason: string;
  link: string;
}

interface Verdict {
  title: string;
  text: string;
  tone: string;
}

const START_YEAR = 2026;
const MAX_YEARS = 40;
const DEPRECATED_AFTER = 2030;
const DISALLOWED_AFTER = 2035;
const HOUSEHOLDS_PER_DATA_CENTRE = 100000;

@Component({
  selector: 'app-nerd-ecke',
  imports: [Quiz, Glossary],
  templateUrl: './nerd-ecke.html',
  styleUrl: './nerd-ecke.css',
})
export class NerdEcke {
  topics: Topic[] = [
    { id: 'qubit', label: 'Qubit', icon: '⚛️' },
    { id: 'verschraenkung', label: 'Verschränkung', icon: '🔗' },
    { id: 'stand', label: 'Stand 2026', icon: '🛰️' },
    { id: 'quanten-ki', label: 'Quanten und KI', icon: '🤖' },
    { id: 'krypto', label: 'Quantensicher', icon: '🔐' },
    { id: 'strom', label: 'KI und Strom', icon: '⚡' },
    { id: 'nobel', label: 'Nobelpreise', icon: '🏆' },
  ];

  topic = signal<TopicId>('qubit');

  theta = signal(90);

  collapsed = signal<Bit | null>(null);

  batch = signal<[number, number]>([0, 0]);

  measureLog = signal<Bit[]>([]);

  shownTheta = computed(() => {
    const state = this.collapsed();
    if (state === null) return this.theta();
    return state === 0 ? 0 : 180;
  });

  probabilityOne = computed(() => this.chanceOfOne(this.shownTheta()));

  qubitRows = computed(() => {
    const one = this.probabilityOne();
    const [zeros, ones] = this.batch();
    const total = zeros + ones;

    return [
      {
        label: '|0⟩',
        percent: (1 - one) * 100,
        chance: this.formatPercent((1 - one) * 100),
        measured: total === 0 ? 0 : (zeros / total) * 100,
      },
      {
        label: '|1⟩',
        percent: one * 100,
        chance: this.formatPercent(one * 100),
        measured: total === 0 ? 0 : (ones / total) * 100,
      },
    ];
  });

  qubitNote = computed(() => {
    const state = this.collapsed();
    const angle = this.theta();

    if (state !== null) {
      return `Gemessen: ${state}. Die Überlagerung ist weg, das Qubit steht jetzt fest auf ${state}. Misst du noch einmal, kommt wieder ${state} heraus. Mit "Neu vorbereiten" oder dem Regler beginnst du von vorn.`;
    }
    if (angle === 0) return 'Das Qubit ist sicher |0⟩. Jede Messung liefert 0.';
    if (angle === 180) return 'Das Qubit ist sicher |1⟩. Jede Messung liefert 1.';
    if (angle === 90) {
      return 'Perfekte Überlagerung: 50 zu 50. Vor der Messung gibt es nur diese Wahrscheinlichkeiten, danach ein zufälliges Ergebnis.';
    }
    return 'Überlagerung: Die Messung liefert 0 oder 1 mit den angezeigten Wahrscheinlichkeiten. Der Pfeil zeigt den Zustand, nach oben ist |0⟩, nach unten |1⟩.';
  });

  pairModes: { id: PairMode; label: string }[] = [
    { id: 'verschraenkt', label: 'Verschränktes Paar' },
    { id: 'unabhaengig', label: 'Zwei normale Münzen' },
  ];

  pairMode = signal<PairMode>('verschraenkt');

  pair = signal<{ a: Bit | null; b: Bit | null }>({ a: null, b: null });

  pairBatch = signal({ same: 0, total: 0 });

  pairStats = computed(() => {
    const { same, total } = this.pairBatch();
    return { same, total, percent: total === 0 ? 0 : Math.round((same / total) * 100) };
  });

  pairNote = computed(() => {
    const { a, b } = this.pair();
    const entangled = this.pairMode() === 'verschraenkt';

    if (a === null && b === null) {
      return entangled
        ? 'Noch nichts gemessen. Beide Qubits haben noch keinen festen Wert.'
        : 'Noch nichts gemessen. Die beiden Münzen sind unabhängig voneinander.';
    }
    if (a === null || b === null) {
      return entangled
        ? `Das erste Ergebnis war reiner Zufall. Jetzt steht aber schon fest, was das andere Qubit liefert: ${a ?? b}.`
        : 'Das erste Ergebnis sagt nichts über die andere Münze. Sie fällt unabhängig davon.';
    }
    if (a === b) {
      return entangled
        ? 'Beide gleich, wie bei jedem verschränkten Paar in dieser Messrichtung.'
        : 'Zufällig gleich. Bei unabhängigen Münzen passiert das nur in der Hälfte der Fälle.';
    }
    return 'Unterschiedlich. Das geht nur bei unabhängigen Münzen, ein verschränktes Paar liefert hier immer dasselbe.';
  });

  milestones: Milestone[] = [
    {
      year: '1984/85',
      title: 'Quanteneffekte im Stromkreis',
      text: 'John Clarke, Michel Devoret und John Martinis zeigen, dass sich ein ganzer supraleitender Stromkreis wie ein Quantenobjekt verhält. Darauf bauen die heutigen supraleitenden Qubits auf.',
    },
    {
      year: '2019',
      title: 'Erster Rechenvorteil',
      text: 'Google zeigt mit dem Chip Sycamore einen Rechenvorteil bei einer Spezialaufgabe, die keinen praktischen Nutzen hat. Es war der Beweis, dass es grundsätzlich geht.',
    },
    {
      year: '2024',
      title: 'Fehler sinken mit der Größe',
      text: 'Googles Chip Willow mit 105 Qubits zeigt, dass die Fehlerrate sinkt, wenn man mehr physikalische Qubits zu einem logischen Qubit bündelt. Das war lange das große offene Problem der Fehlerkorrektur.',
    },
    {
      year: '2025',
      title: 'Physik-Nobelpreis',
      text: 'Clarke, Devoret und Martinis bekommen den Nobelpreis für ihre Experimente von 1984 und 1985.',
    },
    {
      year: '2026',
      title: 'Logische Qubits im zweistelligen Bereich',
      text: 'Mehrere Teams zeigen verschränkte logische Qubits in zweistelliger Zahl. IBM plant bis 2029 einen großen, fehlertoleranten Quantencomputer.',
    },
    {
      year: 'Offen',
      title: 'Der nützliche Quantencomputer',
      text: 'Ein fehlertoleranter Rechner, der echte Alltagsprobleme besser löst als normale Computer, ist noch nicht da.',
    },
  ];

  milestoneIndex = signal(2);

  currentMilestone = computed(() => this.milestones[this.milestoneIndex()]);

  claims: Claim[] = [
    {
      text: 'Ein Quantencomputer probiert bei jeder Aufgabe alle Lösungen gleichzeitig aus und ist deshalb immer schneller.',
      isFact: false,
      explanation:
        'Mythos. Er nutzt Überlagerung und Interferenz, und das bringt nur bei bestimmten Aufgaben einen Vorteil.',
    },
    {
      text: 'Quantencomputer sollen normale Computer nicht ersetzen, sondern bei bestimmten Aufgaben ergänzen.',
      isFact: true,
      explanation:
        'Fakt. Für den Alltag, für Texte und Bilder bleiben normale Chips die bessere Wahl.',
    },
    {
      text: 'Qubits sind so fehleranfällig, dass man viele physikalische Qubits zu einem zuverlässigen logischen Qubit bündelt.',
      isFact: true,
      explanation: 'Fakt. Diese Fehlerkorrektur ist der Kern der aktuellen Forschung.',
    },
    {
      text: 'Heute gibt es schon einen Quantencomputer, der gängige Verschlüsselung wie RSA-2048 knackt.',
      isFact: false,
      explanation:
        'Mythos. Dafür braucht man sehr viele fehlerkorrigierte logische Qubits, und die gibt es noch nicht.',
    },
  ];

  claimResults = signal<Record<number, boolean>>({});

  sorting: SortItem[] = [
    {
      text: 'Ein KI-Modell hilft, Fehler in einem Quantenchip zu erkennen und zu korrigieren.',
      side: 'ki-fuer-quanten',
      explanation:
        'KI für Quanten. Maschinelles Lernen unterstützt die Fehlerkorrektur schon heute.',
    },
    {
      text: 'KI stellt die Steuerung eines Quantenchips automatisch ein.',
      side: 'ki-fuer-quanten',
      explanation: 'KI für Quanten. Beim Kalibrieren der Chips hilft maschinelles Lernen bereits.',
    },
    {
      text: 'Ein Quantencomputer soll ein Sprachmodell schneller trainieren.',
      side: 'quanten-fuer-ki',
      explanation:
        'Quanten für KI. Ein Vorteil bei echten Alltagsdaten ist bisher nicht nachgewiesen.',
    },
    {
      text: 'Ein Quantencomputer lernt aus Messdaten von Quantensystemen.',
      side: 'quanten-fuer-ki',
      explanation:
        'Quanten für KI. Hier ist ein Vorteil für bestimmte Aufgaben gezeigt worden, aber nicht für Alltagsdaten.',
    },
  ];

  sortResults = signal<Record<number, boolean>>({});

  presets = [
    { label: 'Einkaufsliste', years: 1 },
    { label: 'Steuerunterlagen', years: 10 },
    { label: 'Patientenakte', years: 30 },
  ];

  years = signal(10);

  bandEarly = ((DEPRECATED_AFTER - START_YEAR) / MAX_YEARS) * 100;

  bandMiddle = ((DISALLOWED_AFTER - DEPRECATED_AFTER) / MAX_YEARS) * 100;

  expiryYear = computed(() => START_YEAR + this.years());

  markerPercent = computed(() => (this.years() / MAX_YEARS) * 100);

  verdict = computed<Verdict>(() => {
    const year = this.expiryYear();

    if (year <= DEPRECATED_AFTER) {
      return {
        title: 'Kurzlebig',
        text: 'Bis dahin gelten RSA und elliptische Kurven nach dem NIST-Entwurf noch als zulässig.',
        tone: 'text-emerald-300',
      };
    }
    if (year <= DISALLOWED_AFTER) {
      return {
        title: 'Grenzbereich',
        text: 'Nach 2030 sollen RSA und elliptische Kurven als veraltet gelten, bis 2035 aber noch erlaubt bleiben.',
        tone: 'text-amber-300',
      };
    }
    return {
      title: 'Langlebig',
      text: 'Nach 2035 sollen diese Verfahren nicht mehr erlaubt sein. Wer so lange Geheimnisse schützen will, sollte schon heute quantensichere Verfahren einsetzen, denn mitgeschnittene Daten lassen sich später entschlüsseln.',
      tone: 'text-pink-400',
    };
  });

  energy: EnergyPoint[] = [
    {
      year: 2024,
      twh: 415,
      label: '415',
      forecast: false,
      note: 'Rechenzentren verbrauchten 2024 rund 1,5 Prozent des weltweiten Stroms. Seit 2017 wächst ihr Verbrauch um etwa 12 Prozent pro Jahr.',
    },
    {
      year: 2030,
      twh: 945,
      label: 'etwa 945',
      forecast: true,
      note: 'Der Verbrauch soll sich mehr als verdoppeln. Das entspricht ungefähr dem heutigen Jahresverbrauch von Japan.',
    },
    {
      year: 2035,
      twh: 1200,
      label: 'etwa 1 200',
      forecast: true,
      note: 'Das ist der Wert im Basis-Szenario der IEA. Je nach Szenario liegt er zwischen 700 und 1 700 TWh.',
    },
  ];

  maxTwh = Math.max(...this.energy.map((point) => point.twh));

  energyYear = signal<EnergyYear>(2024);

  currentEnergy = computed(
    () => this.energy.find((point) => point.year === this.energyYear()) ?? this.energy[0],
  );

  size = signal(1);

  households = computed(() => (this.size() * HOUSEHOLDS_PER_DATA_CENTRE).toLocaleString('de-DE'));

  prizes: Prize[] = [
    {
      id: 'physik-2024',
      year: 2024,
      field: 'Physik',
      names: 'John Hopfield und Geoffrey Hinton',
      reason:
        'Für grundlegende Entdeckungen und Erfindungen, die maschinelles Lernen mit künstlichen neuronalen Netzen möglich machen.',
      link: 'Ihre Arbeiten stehen am Anfang der KI, die du in den Kapiteln dieser App kennengelernt hast.',
    },
    {
      id: 'chemie-2024',
      year: 2024,
      field: 'Chemie',
      names: 'David Baker, Demis Hassabis und John Jumper',
      reason:
        'Baker für das Entwerfen neuer Proteine am Computer, Hassabis und Jumper für die KI-gestützte Vorhersage von Proteinstrukturen mit AlphaFold.',
      link: 'Ein Beispiel dafür, dass KI nicht nur Text erzeugt, sondern der Forschung neue Wege öffnet.',
    },
    {
      id: 'physik-2025',
      year: 2025,
      field: 'Physik',
      names: 'John Clarke, Michel Devoret und John Martinis',
      reason:
        'Für den Nachweis von Quantentunneln und Energiequanten in einem elektrischen Stromkreis.',
      link: 'Auf diesen supraleitenden Stromkreisen bauen heutige Qubits auf, wie sie zum Beispiel Google und IBM verwenden.',
    },
  ];

  prizeId = signal('physik-2024');

  currentPrize = computed(
    () => this.prizes.find((prize) => prize.id === this.prizeId()) ?? this.prizes[0],
  );

  glossar: GlossaryTerm[] = [
    {
      name: 'Qubit',
      explanation:
        'Die kleinste Recheneinheit eines Quantencomputers. Bei der Messung liefert es 0 oder 1, davor kann es in einer Überlagerung beider Möglichkeiten sein.',
    },
    {
      name: 'Überlagerung',
      explanation:
        'Ein Zustand, in dem ein Qubit beide Messergebnisse mit bestimmten Wahrscheinlichkeiten in sich trägt, bis gemessen wird.',
    },
    {
      name: 'Messung',
      explanation:
        'Das Auslesen eines Qubits. Dabei entsteht ein zufälliges Ergebnis, 0 oder 1, und die Überlagerung ist danach weg.',
    },
    {
      name: 'Verschränkung',
      explanation:
        'Zwei Qubits teilen einen gemeinsamen Zustand. Ihre Messergebnisse hängen zusammen, auch wenn jedes einzelne Ergebnis zufällig ist.',
    },
    {
      name: 'Logisches Qubit',
      explanation:
        'Ein zuverlässiges Qubit, das aus vielen fehleranfälligen physikalischen Qubits zusammengesetzt ist, damit Fehler erkannt und korrigiert werden können.',
    },
    {
      name: 'Post-Quanten-Kryptografie',
      explanation:
        'Verschlüsselungsverfahren, die auch ein Quantencomputer nicht knacken können soll. Sie laufen auf normalen Computern.',
    },
    {
      name: 'Harvest now, decrypt later',
      explanation:
        'Angreifer speichern heute verschlüsselte Daten, um sie später zu entschlüsseln, wenn Quantencomputer stark genug sind.',
    },
    {
      name: 'Terawattstunde (TWh)',
      explanation:
        'Eine Milliarde Kilowattstunden. Eine Maßeinheit für sehr große Strommengen, zum Beispiel den Verbrauch ganzer Länder.',
    },
  ];

  /**
   * Switches to another topic of the nerd corner.
   * @param id Identifier of the selected topic.
   */
  selectTopic(id: TopicId) {
    this.topic.set(id);
  }

  /**
   * Sets a new qubit state from the slider and starts fresh.
   * @param event Input event of the range slider.
   */
  onTheta(event: Event) {
    const input = event.target as HTMLInputElement;
    this.theta.set(Number(input.value));
    this.collapsed.set(null);
    this.batch.set([0, 0]);
    this.measureLog.set([]);
  }

  /**
   * Measures the qubit once. A superposition collapses to the measured value.
   */
  measure() {
    let state = this.collapsed();

    if (state === null) {
      state = this.drawBit(this.chanceOfOne(this.theta()));
      this.collapsed.set(state);
    }

    const result = state;
    this.measureLog.update((log) => [...log, result].slice(-12));
  }

  /**
   * Prepares the qubit again so that the superposition is back.
   */
  reprepare() {
    this.collapsed.set(null);
    this.measureLog.set([]);
  }

  /**
   * Prepares 100 fresh qubits in the current state and measures each one.
   */
  measureBatch() {
    const chance = this.chanceOfOne(this.theta());
    let ones = 0;

    for (let i = 0; i < 100; i++) {
      ones += this.drawBit(chance);
    }

    this.collapsed.set(null);
    this.measureLog.set([]);
    this.batch.update(([zeroCount, oneCount]) => [zeroCount + 100 - ones, oneCount + ones]);
  }

  /**
   * Switches between an entangled pair and two independent coins.
   * @param mode The selected mode.
   */
  setPairMode(mode: PairMode) {
    this.pairMode.set(mode);
    this.newPair();
    this.pairBatch.set({ same: 0, total: 0 });
  }

  /**
   * Measures one qubit of the pair. An entangled partner always matches the first result.
   * @param who The qubit to measure.
   */
  measurePair(who: 'a' | 'b') {
    const current = this.pair();
    if (current[who] !== null) return;

    const other = who === 'a' ? current.b : current.a;
    const value = this.pairMode() === 'verschraenkt' && other !== null ? other : this.drawBit(0.5);

    this.pair.set({ ...current, [who]: value });
  }

  /**
   * Creates a fresh pair that has not been measured yet.
   */
  newPair() {
    this.pair.set({ a: null, b: null });
  }

  /**
   * Measures 100 pairs and counts how often both results match.
   */
  measureManyPairs() {
    const entangled = this.pairMode() === 'verschraenkt';
    let same = 0;

    for (let i = 0; i < 100; i++) {
      const first = this.drawBit(0.5);
      const second = entangled ? first : this.drawBit(0.5);
      if (first === second) same += 1;
    }

    this.pairBatch.update((stats) => ({ same: stats.same + same, total: stats.total + 100 }));
  }

  /**
   * Shows another milestone of the quantum computer timeline.
   * @param index Position of the milestone.
   */
  selectMilestone(index: number) {
    this.milestoneIndex.set(index);
  }

  /**
   * Stores whether the guess for a claim was correct.
   * @param index Position of the claim.
   * @param guessFact True if the user thinks the claim is a fact.
   */
  answerClaim(index: number, guessFact: boolean) {
    const claim = this.claims[index];
    this.claimResults.update((current) => ({ ...current, [index]: guessFact === claim.isFact }));
  }

  /**
   * Checks whether a claim has already been answered.
   * @param index Position of the claim.
   * @returns True if the claim was answered.
   */
  isClaimAnswered(index: number): boolean {
    return this.claimResults()[index] !== undefined;
  }

  /**
   * Checks whether the answer for a claim was correct.
   * @param index Position of the claim.
   * @returns True if the guess was correct.
   */
  wasClaimCorrect(index: number): boolean {
    return this.claimResults()[index] === true;
  }

  /**
   * Stores whether a statement was sorted to the correct direction.
   * @param index Position of the statement.
   * @param side The direction the user picked.
   */
  answerSort(index: number, side: SortSide) {
    const item = this.sorting[index];
    this.sortResults.update((current) => ({ ...current, [index]: side === item.side }));
  }

  /**
   * Checks whether a statement has already been sorted.
   * @param index Position of the statement.
   * @returns True if the statement was sorted.
   */
  isSortAnswered(index: number): boolean {
    return this.sortResults()[index] !== undefined;
  }

  /**
   * Checks whether a statement was sorted correctly.
   * @param index Position of the statement.
   * @returns True if the direction was correct.
   */
  wasSortCorrect(index: number): boolean {
    return this.sortResults()[index] === true;
  }

  /**
   * Sets the number of years the data has to stay secret, from the slider.
   * @param event Input event of the range slider.
   */
  onYears(event: Event) {
    const input = event.target as HTMLInputElement;
    this.years.set(Number(input.value));
  }

  /**
   * Sets the number of years from a preset button.
   * @param value Number of years.
   */
  setYears(value: number) {
    this.years.set(value);
  }

  /**
   * Shows the electricity data for another year.
   * @param year The selected year.
   */
  selectEnergy(year: EnergyYear) {
    this.energyYear.set(year);
  }

  /**
   * Sets the size of the data centre from the slider.
   * @param event Input event of the range slider.
   */
  onSize(event: Event) {
    const input = event.target as HTMLInputElement;
    this.size.set(Number(input.value));
  }

  /**
   * Shows another Nobel Prize.
   * @param id Identifier of the prize.
   */
  selectPrize(id: string) {
    this.prizeId.set(id);
  }

  /**
   * Calculates the chance of measuring a 1 for a qubit state.
   * @param degrees Angle of the state, 0 is |0⟩ and 180 is |1⟩.
   * @returns Probability between 0 and 1.
   */
  private chanceOfOne(degrees: number): number {
    return Math.sin((degrees * Math.PI) / 360) ** 2;
  }

  /**
   * Draws a random bit.
   * @param chanceOfOne Probability of drawing a 1.
   * @returns 1 or 0.
   */
  private drawBit(chanceOfOne: number): Bit {
    return Math.random() < chanceOfOne ? 1 : 0;
  }

  /**
   * Formats a percentage with one decimal and a German decimal comma.
   * @param value Percentage between 0 and 100.
   * @returns The formatted number.
   */
  private formatPercent(value: number): string {
    return value.toFixed(1).replace('.', ',');
  }

  quiz: QuizQuestion[] = [
    {
      question: 'Was passiert, wenn man ein Qubit in Überlagerung misst?',
      options: [
        'Man bekommt immer beide Werte zugleich',
        'Man bekommt zufällig 0 oder 1, und die Überlagerung ist danach weg',
        'Das Qubit bleibt unverändert',
      ],
      correct: 1,
      explanation:
        'Die Messung liefert genau einen Wert. Danach steht das Qubit fest auf diesem Wert.',
    },
    {
      question: 'Was zeigt die Verschränkung zweier Qubits?',
      options: [
        'Die beiden Ergebnisse hängen zusammen, jedes einzelne bleibt Zufall',
        'Man kann Nachrichten schneller als Licht senden',
        'Beide Qubits sind identische Kopien',
      ],
      correct: 0,
      explanation:
        'Jedes Ergebnis allein ist zufällig. Der Zusammenhang zeigt sich erst im Vergleich, deshalb lässt sich damit keine Nachricht übertragen.',
    },
    {
      question: 'Wofür braucht man logische Qubits?',
      options: [
        'Damit Quantencomputer schneller takten',
        'Damit Fehler der empfindlichen physikalischen Qubits erkannt und korrigiert werden',
        'Damit Quantencomputer weniger Strom brauchen',
      ],
      correct: 1,
      explanation:
        'Viele physikalische Qubits bilden zusammen ein zuverlässiges logisches Qubit. Das ist der Kern der Fehlerkorrektur.',
    },
    {
      question: 'Wie ist der Stand bei Quantencomputern für alltägliche KI wie Sprachmodelle?',
      options: [
        'Quantencomputer trainieren heute schon alle großen Modelle',
        'Ein Vorteil bei echten Alltagsdaten ist bisher nicht nachgewiesen',
        'Quantencomputer sind der Grund, warum KI funktioniert',
      ],
      correct: 1,
      explanation:
        'Große KI-Modelle laufen auf normalen Chips. Ob Quantencomputer hier einmal helfen, ist offen.',
    },
    {
      question: 'Was bedeutet "Harvest now, decrypt later"?',
      options: [
        'Angreifer speichern heute verschlüsselte Daten und knacken sie später',
        'Daten werden erst später verschlüsselt',
        'Ein Verfahren zum schnellen Löschen alter Daten',
      ],
      correct: 0,
      explanation:
        'Deshalb sind Daten, die lange geheim bleiben müssen, schon heute ein Thema für quantensichere Verschlüsselung.',
    },
    {
      question: 'Was sagt die IEA über den Strombedarf von Rechenzentren bis 2030?',
      options: [
        'Er sinkt wegen effizienterer Chips',
        'Er soll sich auf etwa 945 TWh mehr als verdoppeln',
        'Er bleibt gleich',
      ],
      correct: 1,
      explanation:
        'Das ist eine Prognose im Basis-Szenario. Je nach Szenario fallen die Werte anders aus.',
    },
    {
      question: 'Wofür gab es 2025 den Physik-Nobelpreis?',
      options: [
        'Für die Erfindung des Transistors',
        'Für Quanteneffekte in einem elektrischen Stromkreis, die Grundlage heutiger supraleitender Qubits',
        'Für die Entdeckung eines neuen Elementarteilchens',
      ],
      correct: 1,
      explanation:
        'Clarke, Devoret und Martinis zeigten Quanteneffekte in einem Stromkreis, den man in der Hand halten kann.',
    },
    {
      question: 'Welche Aussage über Quantencomputer stimmt?',
      options: [
        'Sie probieren immer alle Lösungen gleichzeitig aus',
        'Sie sollen normale Computer bei bestimmten Aufgaben ergänzen, nicht ersetzen',
        'Sie knacken heute schon jede Verschlüsselung',
      ],
      correct: 1,
      explanation:
        'Der Vorteil gilt nur für bestimmte Aufgaben. Eine Verschlüsselung wie RSA-2048 knackt heute noch kein Quantencomputer.',
    },
  ];

  quizResult: QuizResultTexts = {
    perfekt: 'Perfekt. Du hast die Nerd-Ecke durchschaut.',
    gut: 'Gut. Lies die Erklärungen zu den Fragen, die du verpasst hast.',
    schwach: 'Probier die Experimente oben noch einmal und achte auf die Erklärungen.',
  };
}
