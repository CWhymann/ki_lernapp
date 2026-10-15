# Plan: KI-LernApp

## Stand

- Repo: github.com/CWhymann/ki_lernapp
- Seiten: Landingpage (/), Geschichte (/geschichte), Dashboard (/dashboard)
- Kapitel vorhanden: Prompting, Training, Tokens, Halluzinationen, Bias, Neuronale Netze, KI einrichten
- Kapitel "KI einrichten" ist überarbeitet (Hardware-Labor, Installations-Mission, Quiz)
- Glossar-Komponente unter src/app/shared/glossary ist eingebunden
- Dashboard zeigt 7 Kapitel und 5 neue Themen als "Kommt bald"

## Erledigt

- ki-einrichten.ts: Zeilen mit normalen Kommentaren entfernt (Regel: nur JSDoc in JS/TS-Dateien)
- ki-einrichten.css: Inhalt gegen die Regeln geprüft (kein !important, keine Kommentare)
- Schriftgrößen in allen Kapiteln auf mindestens 14px geprüft
- Overflow in allen Kapiteln geprüft, overflow-hidden entfernt
- Geschichte: Text erscheint wie live geschrieben, Seite springt zwischen den Kapiteln nicht mehr, Weiter-Button bleibt ohne Scrollen erreichbar
- Nav-Bar: Link "Geschichte" ergänzt
- Dashboard: Karten für News, Modelle, Nerd-Ecke, KI-Agenten, Datenschutz & Sicherheit angelegt

## Offene Punkte

- Seiten für die 5 neuen Themen anlegen, danach in die Nav-Bar und im Dashboard verlinken
- News: tagesaktuelle Inhalte rund um KI, dafür wird eine externe Quelle (RSS oder News-API) gebraucht
- Modelle: Übersicht, welches KI-Modell was kann und wofür
- Nerd-Ecke: Quantenphysik und weitere Nerd-Themen
- KI-Agenten: wie Agenten arbeiten, anknüpfend an die Geschichte
- Datenschutz & Sicherheit: was man einer KI anvertrauen darf, Deepfakes, Risiken

## Später

- Weitere Funktionen nach Bedarf
- Startseite eventuell erweitern
- Kapitel inhaltlich ausbauen: mehr Interaktion statt reiner Info-Texte
- Echte KI-Anbindung, erst ganz am Schluss
- Monetarisierung, erst nach Auftrag

## Regeln

- Arbeitsregeln: CLAUDE.md und docs/regeln.md
- Vor jeder Antwort prüfen, nur ausführen, was beauftragt ist
