import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  get currentEmail(): string | null {
    return this.userService.getCurrentUserEmail();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
