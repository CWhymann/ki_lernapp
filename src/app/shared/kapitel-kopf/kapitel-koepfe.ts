/** Content of a chapter header. The id selects the animated motif. */
export interface KopfDaten {
  id: string;
  kicker: string;
  titel: string;
  text: string;
}

/** Chapter headers by route path. */
export const KAPITEL_KOEPFE: Record<string, KopfDaten> = {
  prompting: {
    id: 'prompting',
    kicker: '// Prompting',
    titel: 'Prompting',
    text: 'Ein Prompt ist deine Anfrage an eine KI. Wie du ihn formulierst, entscheidet massgeblich über die Qualität der Antwort. Eine KI kann nicht raten, was du meinst - sie arbeitet nur mit dem, was du ihr gibst.',
  },
  'ki-einrichten': {
    id: 'ki-einrichten',
    kicker: '// KI einrichten',
    titel: 'Deine eigene KI. Auf deinem Rechner. Für immer.',
    text: 'Cloud-KIs wie ChatGPT oder Claude laufen auf den Servern der Hersteller und lassen sich nicht herunterladen. Dafür gibt es offene Modelle: Du lädst sie einmal herunter und nutzt sie danach ohne Abo, ohne Konto und sogar ohne Internet.',
  },
  tokens: {
    id: 'tokens',
    kicker: '// Tokens',
    titel: 'Tokens',
    text: 'Eine KI liest keinen Text am Stück, sondern zerlegt ihn in sogenannte Tokens - kleine Bausteine, die einzelne Wörter, Wortteile oder Satzzeichen sein können. Jeder Token wird als Zahl verarbeitet, mit der die KI rechnet.',
  },
  training: {
    id: 'training',
    kicker: '// Training',
    titel: 'Training',
    text: 'Eine KI "lernt" nicht wie ein Mensch, sondern erkennt statistische Muster in riesigen Mengen an Beispieldaten. Je mehr passende und vielfältige Daten sie sieht, desto besser kann sie Muster verallgemeinern - bis zu einem gewissen Punkt.',
  },
  'neuronale-netze': {
    id: 'neuronale-netze',
    kicker: '// Neuronale Netze',
    titel: 'Neuronale Netze',
    text: 'Ein neuronales Netz besteht aus vielen künstlichen "Neuronen", die in Schichten angeordnet sind. Jede Verbindung zwischen zwei Neuronen hat ein Gewicht - eine Zahl, die bestimmt, wie stark ein Signal weitergegeben wird. Ein Neuron "feuert", wenn die Summe der eingehenden Signale einen Schwellenwert überschreitet.',
  },
  modelle: {
    id: 'modelle',
    kicker: '// Modelle',
    titel: 'Modelle',
    text: 'Ein Modell ist das Ergebnis des Trainings: das fertig trainierte Programm, das Eingaben in Ausgaben umwandelt. Es gibt nicht die eine KI, sondern viele Modelle mit unterschiedlichen Stärken. Manche schreiben Text, andere erzeugen Bilder, Video oder Sprache. Multimodale Modelle verstehen mehrere Arten von Eingaben gleichzeitig, zum Beispiel Text und Bilder.',
  },
  halluzinationen: {
    id: 'halluzinationen',
    kicker: '// Halluzinationen',
    titel: 'Halluzinationen',
    text: 'Eine KI kann Dinge "erfinden", die falsch sind - aber genauso selbstbewusst klingen wie richtige Aussagen. Das nennt man Halluzination. Der Grund: eine KI weiss nicht wirklich, ob etwas wahr ist. Sie erzeugt Text, der statistisch plausibel klingt.',
  },
  bias: {
    id: 'bias',
    kicker: '// Bias',
    titel: 'Bias',
    text: 'Eine KI lernt aus Texten, die Menschen geschrieben haben - inklusive aller Vorurteile und Ungleichgewichte, die darin stecken. Wenn in den Trainingsdaten bestimmte Berufe häufiger mit einem Geschlecht, einer Herkunft oder einer Gruppe verknüpft wurden, kann die KI dieses Muster übernehmen. Das nennt man Bias.',
  },
};
