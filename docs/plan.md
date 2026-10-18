# Plan: KI-LernApp

## Stand

- Repo: github.com/CWhymann/ki_lernapp
- Seiten: Landingpage (/), Geschichte (/geschichte), Lernpfad (/lernpfad), Dashboard (/dashboard)
- Kapitel: Prompting, KI einrichten (Stufe Einstieg), Tokens, Training, Neuronale Netze, Modelle (Stufe Grundlagen), Halluzinationen, Bias (Stufe Vertiefung)
- Alle Kapitel haben die gemeinsame Quiz-Komponente (shared/quiz) und ein Glossar mit zentralen Begriffen aus shared/glossary/begriffe.ts
- Kapitelfarben richten sich nach der Lernpfad-Stufe (Shell, Farbvariablen in styles.css)
- Dashboard zeigt 8 Kapitel und 4 neue Themen als "Kommt bald" (News, Nerd-Ecke, KI-Agenten, Datenschutz und Sicherheit)
- Lernpfad: Stufe 4 "Erweiterungen" enthält dieselben 4 Themen als "Kommt bald"
- Supabase: Die Projekte studio-wiemann und own-join belegen alle Plätze. Die Edge Function rss-news liegt nur als Code in supabase/functions/rss-news und ist nirgends deployt oder eingebunden
- Stand-Tracker im Chat, Stand in dieser Datei

## Erledigt

- Quiz-Komponente mit Fragenpool, zufälliger Auswahl und Wiederholung falscher Fragen, in allen Kapiteln
- Glossar in allen Kapiteln
- Zentrale Begriffe: Token, Modell, Parameter, Kontextfenster, Temperatur, Trainingsdaten, Bias
- Kontextfenster-Abschnitt in Tokens
- Attention-Übung und Transformer-Erklärung in Neuronale Netze
- Training: Lernarten, Sortier-Übung und Überanpassungs-Regler
- Halluzinationen: Ursache (nächstes Wort) und Unterschied zur Wissenslücke
- Halluzinationen: interaktiver Temperatur-Regler mit Würfel-Statistik
- Bias: Arten von Bias und Gegenmaßnahmen
- Modelle: Kapitel mit Aufgaben-Finder, Modellstufen, offen vs. geschlossen und Anbieter-Übersicht, eingebunden in Routen, Nav-Bar, Dashboard und Lernpfad
- Lernpfad-Seite mit vier Stufen, Schwierigkeits-Balken, Verbindungslinien und animiertem Agenten
- Nav-Bar nach Lernpfad-Stufen sortiert, mit Links auf Lernpfad und Geschichte
- Kapitelfarben nach Stufe
- Geschichte: Text erscheint Zeichen für Zeichen, Weiter-Button bleibt ohne Scrollen erreichbar
- Dashboard: Karten für News, Modelle, Nerd-Ecke, KI-Agenten, Datenschutz und Sicherheit
- Edge Function rss-news als Code im Repo (noch nicht deployt)

## Offen, als Nächstes

- Die vier neuen Themen als Seiten anlegen, danach in Nav-Bar, Dashboard und Lernpfad verlinken:
  - Nerd-Ecke: Quantenphysik und weitere Nerd-Themen
  - KI-Agenten: wie Agenten arbeiten, anknüpfend an die Geschichte
  - Datenschutz und Sicherheit: was man einer KI anvertrauen darf, Deepfakes, Risiken
  - News: tagesaktuelle Inhalte rund um KI, erst nach der Backend-Entscheidung

## Später

- Backend und News-Anbindung: Supabase ist voll, die Lösung darf die anderen Projekte nicht beschädigen. rss-news bleibt bis dahin nur Code im Repo
- Landingpage erweitern, Versprechen nach Kapitel (Matrix-Hintergrund bleibt)
- Fortschritt im Browser speichern
- Rechtliches: Impressum, Datenschutzerklärung nach DSGVO, Widerrufsbelehrung und AGB (Entwürfe)
- Qualität: Test auf 320 px, Tastaturbedienung, Kontrast, Meta-Tags und Link-Vorschauen, Barrierefreiheit
- Weitere Funktionen nach Bedarf
- Echte KI-Anbindung, erst ganz am Schluss
- Monetarisierung, erst nach Auftrag
- Ideen zur Marktreife und zur Art der App: docs/marktreife.md

## Regeln

- Arbeitsregeln: docs/regeln.md
- Vor jeder Antwort prüfen, nur ausführen, was beauftragt ist
- Komplette Dateien liefern, Reihenfolge HTML, TS, CSS

## Offen laut Prüfung (18.10.2026)

### Marktreife, noch nicht im Code

- Fortschritt speichern: Kein `localStorage` oder `sessionStorage` im Projekt. Beim nächsten Besuch startet alles neu.
- Meta-Tags: In `index.html` stehen nur Titel, Viewport und Favicon. Description und Open-Graph-Tags fehlen für Link-Vorschauen.
- Landingpage-Screenshots: Im Repo liegen keine Bilder, nur `favicon.ico`. Der Matrix-Effekt ist vorhanden.
- News-Seite: Die Edge Function `rss-news` liegt nur als Code im Repo und ist nicht deployt. Eine News-Seite gibt es nicht.

### Neue Themen aus plan.md

- Datenschutz und Sicherheit fehlt als Kapitel. Die Route `/datenschutz` ist bereits die DSGVO-Seite, das Kapitel braucht also einen anderen Pfad.

### Auffällig

- `index.html` hat `lang="en"`, die App ist aber deutsch. Das betrifft Barrierefreiheit und Suche.
- Schriftgrößen unter 14px: `ki-agenten.css` (Zeile 126, 13px) und `nerd-ecke.css` (Zeile 123, 12px).
- `plan.md` nennt `ki-agenten` und `nerd-ecke` noch als offen. Die Seiten existieren bereits.
- `docs/app-ziel.md` enthält dieselben Arbeitsregeln wie `docs/regeln.md` und beginnt mit den Regeln statt mit dem Ziel.
- Die README ist noch der Standardtext der Angular CLI.
- Offene Entscheidung: In `marktreife.md` ist noch nicht festgelegt, welches Kapitel zuerst vollständig ausgebaut wird.
