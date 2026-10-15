import { GlossaryTerm } from './glossary';

/** Central terms that several chapters use, so their explanations stay identical. */
export const GRUNDBEGRIFFE: GlossaryTerm[] = [
  {
    name: 'Token',
    explanation:
      'Ein Textbaustein, den die KI verarbeitet. Ein Token kann ein ganzes Wort, ein Wortteil oder ein Satzzeichen sein.',
  },
  {
    name: 'Modell',
    explanation:
      'Das fertig trainierte Programm, das aus deiner Eingabe eine Antwort erzeugt. Im Modell stecken die gelernten Zahlen, die Parameter.',
  },
  {
    name: 'Parameter',
    explanation:
      '"8 Mrd." heißt 8 Milliarden Zahlen, in denen ein Modell sein Wissen speichert. Mehr Parameter bedeuten meist bessere Antworten, aber auch mehr Speicherbedarf.',
  },
  {
    name: 'Kontextfenster',
    explanation:
      'Die Menge an Text, die ein Modell auf einmal berücksichtigen kann, gemessen in Tokens. Alles, was außerhalb dieses Fensters liegt, sieht es nicht mehr.',
  },
  {
    name: 'Temperatur',
    explanation:
      'Ein Wert, der steuert, wie zufällig eine Antwort ausfällt. Niedrig heißt eher gleichbleibend und vorhersehbar, hoch heißt abwechslungsreicher, aber unberechenbarer.',
  },
  {
    name: 'Trainingsdaten',
    explanation:
      'Die Texte und Beispiele, mit denen eine KI lernt. Was in diesen Daten fehlt oder schief ist, übernimmt die KI in ihre Antworten.',
  },
  {
    name: 'Bias',
    explanation:
      'Eine systematische Schieflage in den Antworten einer KI, zum Beispiel wenn bestimmte Berufe immer mit demselben Geschlecht verknüpft werden. Sie stammt meist aus den Trainingsdaten.',
  },
];
