# Plan: KI-LernApp

## Stand

- Repo: github.com/CWhymann/ki_lernapp
- Seiten: Landingpage (/), Geschichte (/geschichte), Lernpfad (/lernpfad), Dashboard (/dashboard)
- Kapitel: Prompting, KI einrichten (Stufe Einstieg), Tokens, Training, Neuronale Netze (Stufe Grundlagen), Halluzinationen, Bias (Stufe Vertiefung)
- Alle Kapitel haben die gemeinsame Quiz-Komponente (shared/quiz)
- Glossar in Training, Tokens, Halluzinationen, Bias, Neuronale Netze und KI einrichten, mit zentralen Begriffen aus shared/glossary/begriffe.ts
- Kapitelfarben richten sich nach der Lernpfad-Stufe (Shell, Farbvariablen in styles.css)
- Dashboard zeigt 7 Kapitel und 5 neue Themen als "Kommt bald"
- Stand-Tracker im Chat, Stand in dieser Datei

## Erledigt

- Quiz-Komponente mit Fragenpool, zufälliger Auswahl und Wiederholung falscher Fragen
- Quiz in allen Kapiteln umgestellt
- Glossar in Training, Tokens, Halluzinationen, Bias, Neuronale Netze und KI einrichten
- Zentrale Begriffe: Token, Modell, Parameter, Kontextfenster, Temperatur, Trainingsdaten, Bias
- Kontextfenster-Abschnitt in Tokens
- Attention-Übung und Transformer-Erklärung in Neuronale Netze
- Lernpfad-Seite mit vier Stufen, Schwierigkeits-Balken, Verbindungslinien und animiertem Agenten
- Nav-Bar nach Lernpfad-Stufen sortiert, mit Links auf Lernpfad und Geschichte
- Kapitelfarben nach Stufe
- Geschichte: Text erscheint Zeichen für Zeichen, Weiter-Button bleibt ohne Scrollen erreichbar
- Dashboard: Karten für News, Modelle, Nerd-Ecke, KI-Agenten, Datenschutz und Sicherheit

## Offen, als Nächstes

- Prompting: Glossar ergänzen
- Training: Lernen mit und ohne Beispiele, Überanpassung erklären
- Halluzinationen: Ursache erklären, Unterschied zur echten Wissenslücke
- Bias: Arten von Bias (z. B. Datenbias, Auswahlbias) und Gegenmaßnahmen
- Temperatur in einem Kapitel verwenden
- Die fünf neuen Themen als Seiten anlegen, danach in Nav-Bar und Dashboard verlinken:
  - Modelle: welches KI-Modell kann was und wofür
  - Nerd-Ecke: Quantenphysik und weitere Nerd-Themen
  - KI-Agenten: wie Agenten arbeiten, anknüpfend an die Geschichte
  - Datenschutz und Sicherheit: was man einer KI anvertrauen darf, Deepfakes, Risiken
  - News: tagesaktuelle Inhalte rund um KI, dafür eine externe Quelle (RSS oder News-API)

## Später

- Landingpage erweitern, Versprechen nach Kapitel (Matrix-Hintergrund bleibt)
- Fortschritt im Browser speichern
- Rechtliches: Impressum, Datenschutzerklärung nach DSGVO, Widerrufsbelehrung und AGB (Entwürfe)
- Qualität: Test auf 320 px, Tastaturbedienung, Kontrast, Meta-Tags und Link-Vorschauen, Barrierefreiheit
- Weitere Funktionen nach Bedarf
- Echte KI-Anbindung, erst ganz am Schluss
- Monetarisierung, erst nach Auftrag

## Regeln

- Arbeitsregeln: docs/regeln.md
- Vor jeder Antwort prüfen, nur ausführen, was beauftragt ist
- Komplette Dateien liefern, Reihenfolge HTML, TS, CSS
