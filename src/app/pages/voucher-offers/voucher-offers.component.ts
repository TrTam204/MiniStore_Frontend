import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { VoucherService } from '../../services/voucher.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Voucher } from '../../models/voucher';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

@Component({
  selector: 'app-voucher-offers',
  standalone: true,
  imports: [CommonModule, CardModule, BadgeModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './voucher-offers.component.html',
  styleUrls: ['./voucher-offers.component.css']
})
export class VoucherOffersComponent implements OnInit {
  vouchers: Voucher[] = [];
  categories: Category[] = [];
  products: Product[] = [];

  constructor(
    private voucherService: VoucherService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    forkJoin({
      vouchers: this.voucherService.getActive(),
      categories: this.categoryService.getAll(),
      products: this.productService.getAll()
    }).subscribe({
      next: (result) => {
        this.vouchers = result.vouchers || [];
        this.categories = result.categories || [];
        this.products = result.products || [];
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  getApplicabilityText(v: Voucher): string {
    if (!v || v.applicableType === undefined || v.applicableType === null) return 'Toàn bộ';
    if (v.applicableType === 0) return 'Toàn bộ';
    if (v.applicableType === 1) {
      const c = this.categories.find(x => x.id === v.applicableCategoryId);
      return c ? `Danh mục: ${c.name}` : 'Danh mục (không xác định)';
    }
    if (v.applicableType === 2) {
      if (!v.applicableProductIds || v.applicableProductIds.length === 0) return 'Chọn sản phẩm';
      const names = this.products.filter(p => v.applicableProductIds!.includes(p.id)).slice(0,3).map(p => p.name);
      return names.join(', ') + (v.applicableProductIds.length > 3 ? '...' : '');
    }
    return '';
  }

  formatDiscountInfo(v: Voucher): string {
    if (v.discountType === 0) {
      // Phần trăm
      let text = `Giảm ${v.discountValue}%`;
      if (v.maximumDiscountAmount && v.maximumDiscountAmount > 0) {
        text += ` (tối đa ${v.maximumDiscountAmount.toLocaleString('vi-VN')} đ)`;
      }
      if (v.minimumOrderAmount && v.minimumOrderAmount > 0) {
        text += ` cho đơn từ ${v.minimumOrderAmount.toLocaleString('vi-VN')} đ`;
      }
      return text;
    } else {
      // Số tiền
      let text = `Giảm ${v.discountValue.toLocaleString('vi-VN')} đ`;
      if (v.minimumOrderAmount && v.minimumOrderAmount > 0) {
        text += ` cho đơn từ ${v.minimumOrderAmount.toLocaleString('vi-VN')} đ`;
      }
      return text;
    }
  }


  formatValue(v: Voucher): string {
    return v.discountType === 0 ? `${v.discountValue}%` : `${v.discountValue.toLocaleString('vi-VN')} đ`;
  }

  copyToClipboard(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Đã sao chép', detail: `Mã ${code} đã được sao chép` });
    }).catch((err) => {
      console.error('Copy failed', err);
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể sao chép mã voucher' });
    });
  }
}

