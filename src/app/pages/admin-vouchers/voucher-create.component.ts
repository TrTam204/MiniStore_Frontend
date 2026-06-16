import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VoucherService } from '../../services/voucher.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

@Component({
  selector: 'app-voucher-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, ToolbarModule, InputTextModule, DropdownModule, InputNumberModule, CalendarModule, MultiSelectModule, RadioButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './voucher-create.component.html',
  styleUrls: ['./voucher-form.component.css']
})
export class VoucherCreateComponent {
  model: any = {
    code: '',
    description: '',
    discountType: 'Percentage',
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: 0,
    startDate: '',
    endDate: '',
    quantity: 1,
    isActive: true
  };

  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  // 0 All, 1 ByCategory, 2 ByProducts
  applicability = 0;

  constructor(private voucherService: VoucherService, public router: Router, private categoryService: CategoryService, private productService: ProductService, private messageService: MessageService) {
    this.loadLookup();
  }

  loadLookup(): void {
    this.categoryService.getAll().subscribe({ next: c => this.categories = c, error: e => console.error(e) });
    this.productService.getAll().subscribe({ next: p => this.products = p, error: e => console.error(e) });
  }

  onCategoryChange(): void {
    this.filteredProducts = this.products.filter(p => p.categoryId === this.model.applicableCategoryId);
  }

  save(): void {
    // map to API shape
    const payload: any = {
      code: this.model.code,
      description: this.model.description,
      discountType: this.model.discountType === 'Percentage' ? 0 : 1,
      discountValue: this.model.discountValue,
      minimumOrderAmount: this.model.minimumOrderAmount || 0,
      maximumDiscountAmount: this.model.maximumDiscountAmount || null,
      startDate: this.model.startDate,
      endDate: this.model.endDate,
      applicableType: this.applicability,
      quantity: this.model.quantity,
      isActive: this.model.isActive
    };
    
    // Chỉ gửi applicableCategoryId khi applicableType = 1 (ByCategory)
    if (this.applicability === 1) {
      payload.applicableCategoryId = this.model.applicableCategoryId || null;
      payload.applicableProductIds = null;
    } 
    // Chỉ gửi applicableProductIds khi applicableType = 2 (ByProducts)
    else if (this.applicability === 2) {
      payload.applicableProductIds = this.model.applicableProductIds || null;
      payload.applicableCategoryId = null;
    } 
    // applicableType = 0 (All) - không cần cả hai
    else {
      payload.applicableCategoryId = null;
      payload.applicableProductIds = null;
    }
    
    this.voucherService.create(payload).subscribe({ 
      next: () => {
        this.messageService.add({severity:'success', summary:'Thành công', detail:'Tạo voucher thành công'});
        this.router.navigate(['/admin/vouchers']);
      }, 
      error: e => { 
        console.error('Create failed:', e); 
        this.messageService.add({severity:'error', summary:'Lỗi', detail:'Tạo voucher thất bại: ' + (e.error?.message || e.statusText)}); 
      } 
    });
  }
}
