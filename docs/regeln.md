# Arbeitsregeln für Claude

## Grundregeln

- Vor jeder Antwort prüfen, nicht raten. Dateien, Repo-Stand und Verlauf zuerst ansehen, bevor etwas behauptet wird.
- Nur ausführen, was ausdrücklich beauftragt ist. Keine eigenen Vorschläge, keine zusätzlichen Schritte, keine Umbauten.
- Keine Entscheidungen treffen, ob etwas gut oder schlecht ist. Der Nutzer entscheidet.
- Keine doppelten Anforderungen stellen. Ist der Auftrag klar, direkt umsetzen.
- Fehler und Hinweise sofort aufgreifen und die Lösung liefern, nicht nur erklären und nicht übergehen.
- Keine Vorträge, keine langen Erklärungen, keine Schleifen. Kurz antworten.
- Ist ein Auftrag unklar, genau eine offene Frage im Text stellen. Keine Auswahl-Buttons (ask_user_input).
- Tokens sparen: keine unnötigen Dateien, keine unnötigen Tool-Aufrufe, keine ungefragten Features.
- Fachbegriffe gehören in die App selbst, nicht in den Chat.

## Schritt für Schritt

- Ein Schritt nach dem anderen. Erst der Befehl, dann der Inhalt, dann der Commit.
- Bei neuen Dateien zuerst der PowerShell-Befehl, der die leere Datei anlegt. Danach der Code zum Kopieren, nur im Chat.
- Bei Angular-Komponenten die Reihenfolge HTML, dann TS, dann CSS einhalten.
- Kein `cd` ausgeben, wenn der Nutzer bereits im richtigen Ordner steht.

## Code

- Immer vollständige Dateien liefern, keine Snippets und keine "setze hier ein"-Anweisungen.
- Code direkt im Chat als Text zeigen, keine Datei-Anhänge oder Downloads.
- Vor dem Liefern prüfen, ob der Code zum aktuellen Stand im Repo passt.
- Keine bestehende Datei überschreiben, ohne dass der Nutzer es ausdrücklich bestätigt.
- Mobile First, responsive, Viewport 320px bis 1440px.
- Kein Overflow. `overflow-hidden` ist nicht erlaubt.
- Nur sauberen Code, keine Symptom-Lösungen.
- Kein `!important`.
- Schriftgrößen nie kleiner als 14px. Ausnahmen nur nach vorheriger Absprache.
- JS/TS-Dateien: JSDoc verwenden, sonst keine Kommentare.
- Weitere Regeln aus der Regeldatei des Projekts gelten zusätzlich, sobald sie hier eingefügt sind.

## Commits

- Nach jeder Code-Änderung die Commit-Befehle nennen.
- Commit-Nachricht immer auf Englisch, kurz und beschreibend.
- Format: `git add <datei>`, `git commit -m "<Nachricht>"`, `git push`

## Terminal und Projekt

- Zu Beginn jeder Session am Angular-Projekt `ng serve` ausführen und prüfen, ob die App läuft.
- Projektordner: `C:\Users\cwiem\Desktop\Projekte\LernApp\ki-lernapp`
- Repo: github.com/CWhymann/ki_lernapp
- Keine Befehle, die viele Dateien verändern oder löschen, ohne Bestätigung.

## Projektziel

- KI-LernApp: Angular und Tailwind, Lernkapitel zu KI mit interaktiven Elementen, futuristisches Design.
- Die echte KI-Anbindung kommt erst am Schluss.
- Geplant: spätere Monetarisierung. Erst umsetzen, wenn der Nutzer es beauftragt.
