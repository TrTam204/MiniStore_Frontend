import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule, ToolbarModule, CardModule, TagModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  getFullImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    return `${environment.apiUrl}${url}`;
  }

  constructor(private service: ProductService,
              private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
    this.service.getAll().subscribe((res) => {
      console.log('Products API response:', res);
      this.products = Array.isArray(res) ? res : [];
      const lowCount = this.products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
      if (lowCount > 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: `Có ${lowCount} sản phẩm sắp hết hàng.`,
          life: 5000
        });
      }
    }); 
}
delete(id: number): void {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  this.service.delete(id).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Xóa sản phẩm thành công!'
      });

      this.loadData();
    },

    error: (error: any) => {
      console.error('Error deleting product:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Xóa sản phẩm thất bại!'
      });
    }
  });
}
}