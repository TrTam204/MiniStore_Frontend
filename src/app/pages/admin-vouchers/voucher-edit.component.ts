import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-voucher-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, ToolbarModule, InputTextModule, DropdownModule, InputNumberModule, CalendarModule, MultiSelectModule, RadioButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './voucher-edit.component.html',
  styleUrls: ['./voucher-form.component.css']
})
export class VoucherEditComponent implements OnInit {
  id!: number;
  model: any = {};
  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  applicability = 0;
  constructor(private route: ActivatedRoute, private voucherService: VoucherService, public router: Router, private categoryService: CategoryService, private productService: ProductService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLookup();
    this.voucherService.getById(this.id).subscribe({ next: v => {
      this.model = v;
      // Chuyển discountType từ số sang string để match dropdown
      this.model.discountType = v.discountType === 0 ? 'Percentage' : 'FixedAmount';
      this.applicability = v.applicableType ?? 0;
      this.filteredProducts = this.products.filter(p => v.applicableProductIds?.includes(p.id));
    }, error: e => { console.error(e); this.messageService.add({severity:'error', summary:'Lỗi', detail:'Không tải được voucher'}); } });
  }

  loadLookup(): void {
    // load categories/products first
    this.categoryService.getAll().subscribe({ next: c => this.categories = c, error: e => console.error(e) });
    this.productService.getAll().subscribe({ next: p => { this.products = p; if (this.model?.applicableProductIds) this.filteredProducts = this.products.filter(pr => this.model.applicableProductIds.includes(pr.id)); }, error: e => console.error(e) });
  }

  onCategoryChange(): void {
    this.filteredProducts = this.products.filter(p => p.categoryId === this.model.applicableCategoryId);
  }

  save(): void {
    const payload: any = {
      id: this.model.id,
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
    
    this.voucherService.update(this.id, payload).subscribe({ 
      next: () => { 
        this.messageService.add({severity:'success', summary:'Thành công', detail:'Cập nhật voucher thành công'}); 
        this.router.navigate(['/admin/vouchers']); 
      }, 
      error: e => { 
        console.error('Update failed:', e); 
        this.messageService.add({severity:'error', summary:'Lỗi', detail:'Cập nhật voucher thất bại: ' + (e.error?.message || e.statusText)}); 
      } 
    });
  }

}
