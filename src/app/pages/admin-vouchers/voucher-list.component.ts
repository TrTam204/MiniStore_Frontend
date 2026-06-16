import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { VoucherService } from '../../services/voucher.service';
import { Voucher } from '../../models/voucher';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule, CardModule, ToolbarModule, TagModule],
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.css']
})
export class VoucherListComponent implements OnInit {
  vouchers: Voucher[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  constructor(private voucherService: VoucherService, private router: Router, private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.voucherService.getAll().subscribe({ next: v => this.vouchers = v, error: e => console.error(e) });
    this.categoryService.getAll().subscribe({ next: c => this.categories = c, error: e => console.error(e) });
    this.productService.getAll().subscribe({ next: p => this.products = p, error: e => console.error(e) });
  }

  create(): void {
    this.router.navigate(['/admin/vouchers/add']);
  }

  edit(id: number): void {
    this.router.navigate(['/admin/vouchers/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Xóa voucher này?')) return;
    this.voucherService.delete(id).subscribe({ next: () => this.load(), error: e => console.error(e) });
  }

  toggle(id: number): void {
    this.voucherService.toggle(id).subscribe({ next: () => this.load(), error: e => console.error(e) });
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
}
