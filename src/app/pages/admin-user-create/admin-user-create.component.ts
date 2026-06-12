import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { UserCreate } from '../../models/user-create.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, ToolbarModule, ToastModule],
  templateUrl: './admin-user-create.component.html',
  styleUrl: './admin-user-create.component.css',
  providers: [MessageService]
})
export class AdminUserCreateComponent {
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
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['User', [Validators.required]]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: UserCreate = {
      fullName: this.form.value.fullName ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
      phone: this.form.value.phone ?? '',
      address: this.form.value.address ?? '',
      role: this.form.value.role ?? 'User'
    };

    this.userService.create(payload).subscribe({
        next: () => {
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã thêm người dùng mới.'
    });
    setTimeout(() => {
      this.router.navigate(['/admin/users']);
    }, 800);
  },
      error: (err) => {
        console.error('Create user error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message ?? 'Không thể tạo người dùng.'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
