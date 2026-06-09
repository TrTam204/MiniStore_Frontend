import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

import { UserUpdate } from '../../models/user-update.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, ToolbarModule],
  templateUrl: './admin-user-update.component.html',
  styleUrl: './admin-user-update.component.css',
  providers: [MessageService]
})
export class AdminUserUpdateComponent implements OnInit {
  form: FormGroup;

  private userId = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['User', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/admin/users']);
      return;
    }

    this.userId = id;

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role
        });
      },
      error: (err) => {
        console.error('Load user by id error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin người dùng.'
        });
        this.router.navigate(['/admin/users']);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UserUpdate = {
      fullName: this.form.value.fullName ?? '',
      email: this.form.value.email ?? '',
      phone: this.form.value.phone ?? '',
      address: this.form.value.address ?? '',
      role: this.form.value.role ?? 'User'
    };

    this.userService.update(this.userId, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật người dùng.'
        });
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('Update user error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message ?? 'Không thể cập nhật người dùng.'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
