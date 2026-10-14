import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NavBar],
  templateUrl: './shell.html',
})
export class Shell {}
