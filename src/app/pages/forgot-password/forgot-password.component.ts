import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, RouterLink, ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  providers: [MessageService]
})
export class ForgotPasswordComponent {
  step = 1; // 1 = enter email, 2 = verify otp and reset
  form: any;
  isLoading = false;
  resendDisabled = false;
  countdown = 0;
  private countdownSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private message: MessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sendOtp() {
    if (this.form.controls.email.invalid) {
      this.message.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập email hợp lệ' });
      return;
    }
    this.isLoading = true;
    const payload = { email: this.form.value.email!.trim() };
    console.log('Sending forgot-password payload:', payload);
    this.auth.forgotPassword(payload.email).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Gửi OTP', detail: 'OTP đã được gửi tới email' });
        this.step = 2;
        this.startCountdown();
      },
      error: (err) => {
        console.error('Forgot password error:', err);
        const serverMsg = err?.error?.message ?? (typeof err.error === 'string' ? err.error : JSON.stringify(err.error));
        this.message.add({ severity: 'error', summary: 'Lỗi', detail: serverMsg || 'Không thể gửi OTP' });
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false)
    });
  }

  resendOtp() {
    if (this.resendDisabled) return;
    if (this.form.controls.email.invalid) {
      this.message.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email không hợp lệ' });
      return;
    }
    this.isLoading = true;
    const email = this.form.value.email!.trim();
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Gửi lại OTP', detail: 'OTP đã được gửi lại' });
        this.startCountdown();
      },
      error: (err) => {
        console.error('Resend OTP error:', err);
        const serverMsg = err?.error?.message ?? (typeof err.error === 'string' ? err.error : JSON.stringify(err.error));
        this.message.add({ severity: 'error', summary: 'Lỗi', detail: serverMsg || 'Không thể gửi lại OTP' });
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false)
    });
  }

  startCountdown() {
    this.clearCountdown();
    this.countdown = 60;
    this.resendDisabled = true;
    this.countdownSub = interval(1000).subscribe(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        this.clearCountdown();
      }
    });
  }

  clearCountdown() {
    this.resendDisabled = false;
    this.countdown = 0;
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
      this.countdownSub = null;
    }
  }

  ngOnDestroy(): void {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
      this.countdownSub = null;
    }
  }

  verifyAndReset() {
    if (this.form.controls.otp.invalid || this.form.controls.newPassword.invalid) {
      this.message.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập OTP và mật khẩu mới hợp lệ' });
      return;
    }
    this.isLoading = true;
    const { email, otp, newPassword } = this.form.value;
    this.auth.resetPassword(email!, otp!, newPassword!).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Thành công', detail: 'Mật khẩu đã được đặt lại' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Reset password error:', err);
        const serverMsg = err?.error?.message ?? (typeof err.error === 'string' ? err.error : JSON.stringify(err.error));
        this.message.add({ severity: 'error', summary: 'Lỗi', detail: serverMsg || 'Không thể đặt lại mật khẩu' });
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false)
    });
  }
}
