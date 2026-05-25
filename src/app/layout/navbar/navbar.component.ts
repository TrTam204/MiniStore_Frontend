import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,
            ButtonModule,
            InputTextModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
}
