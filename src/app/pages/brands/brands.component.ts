import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TableModule, ToolbarModule, ButtonModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];

  constructor(
    private brandService: BrandService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: (res) => {
        this.brands = Array.isArray(res) ? res : [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách thương hiệu.'
        });
      }
    });
  }

  deleteBrand(id: number, name: string): void {
    if (!confirm(`Xác nhận xóa thương hiệu "${name}"?`)) {
      return;
    }
    this.brandService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa thương hiệu'
        });
        this.loadBrands();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Xóa thương hiệu thất bại'
        });
      }
    });
  }
}
