import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usernameInput: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onLogin() {
    if (this.usernameInput.trim() !== '') {
      this.isLoading = true;
        this.userService
        .getUserByEmail(this.usernameInput)
        .subscribe({
          next: (userFromBackend) => {
            this.userService.login(userFromBackend.id);
            alert(
              `Chào mừng ${userFromBackend.fullName} đã quay lại!`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert('Email này không tồn tại trong hệ thống!');
          console.error(err);
          this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
        }
      });
    } else {
      alert('Vui lòng nhập Email!');
    }
  }
  logout() {

  this.userService.logout();

  this.router.navigate(['/login']);

}
}
