import { Component } from '@angular/core';
import { UserService, LoginRequest } from '../../services/user.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usernameInput: string = '';
  passwordInput: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin(): void {
    if (this.usernameInput.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng nhập Email!'
      });
      return;
    }

    if (this.passwordInput.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng nhập mật khẩu!'
      });
      return;
    }

    const request: LoginRequest = {
      email: this.usernameInput,
      password: this.passwordInput
    };

    this.isLoading = true;

    this.userService.loginWithJwt(request).subscribe({
      next: (res) => {
        this.userService.login(res.userId, res.email, res.token);

        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đăng nhập thành công!`
        });

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Email hoặc mật khẩu không đúng!'
        });

        console.error(err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}