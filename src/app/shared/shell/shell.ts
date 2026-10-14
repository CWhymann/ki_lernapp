import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';

/**
 * Rahmen mit Navigation und Inhaltsbereich für alle Seiten außer der Landing Page.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NavBar],
  templateUrl: './shell.html',
})
export class Shell {}
