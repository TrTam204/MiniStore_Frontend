import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.value.password ?? '';
    const confirmPassword = this.form.value.confirmPassword ?? '';

    if (password !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu xác nhận không khớp.'
      });
      return;
    }

    const payload = {
      fullName: this.form.value.fullName ?? '',
      email: this.form.value.email ?? '',
      password,
      phone: this.form.value.phone ?? '',
      address: this.form.value.address ?? ''
    };

    this.userService.register(payload).subscribe({
      next: (res) => {
        this.userService.login(res.userId, res.email, res.role, res.token);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đăng ký tài khoản thành công.'
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Register error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error ?? 'Không thể đăng ký tài khoản.'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
