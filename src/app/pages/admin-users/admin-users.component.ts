import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    CardModule,
    ToolbarModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
  providers: [MessageService]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  get currentUserId(): number | null {
    return this.userService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Load users error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách người dùng!'
        });
      }
    });
  }

  deleteUser(id: number, email: string): void {
    if (this.currentUserId !== null && this.currentUserId === id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Không thể xóa tài khoản đang đăng nhập.'
      });
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa người dùng "${email}" không?`)) {
      return;
    }

    this.userService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa người dùng!'
        });

        this.loadUsers();
      },
      error: (err) => {
        console.error('Delete user error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa người dùng!'
        });
      }
    });
  }

  getRoleSeverity(role: string): 'info' | 'danger' {
    return role?.toLowerCase() === 'admin' ? 'danger' : 'info';
  }
}
