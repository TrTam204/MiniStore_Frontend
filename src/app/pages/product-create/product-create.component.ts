import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand';
import { environment } from '../../../environments/environment';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
    selector: 'app-product-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, ButtonModule, InputGroupModule],
    templateUrl: './product-create.component.html',
    styleUrl: './product-create.component.css'
})

export class ProductCreateComponent implements OnInit {
    form!: FormGroup;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private service: ProductService,
        private messageService: MessageService,
        private categoryService: CategoryService,
        private brandService: BrandService
    ){}
    categories: Category[] = [];
    brands: Brand[] = [];

    getFullImageUrl(url: string | null | undefined): string {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        return `${environment.apiUrl}${url}`;
    }

    ngOnInit(): void {
    this.form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        sellPrice: [0, [Validators.required, Validators.min(0)]],
        importPrice: [0, [Validators.required, Validators.min(0)]],
        quantity: [0, [Validators.required, Validators.min(0)]],
        categoryId: [null, Validators.required],
            brandId: [null],
        imageUrl: ['', [Validators.required]]
    });

    this.loadCategories();
    this.loadBrands();
}
    onSaveProduct() {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({
                severity:'error', 
                summary: 'Lỗi', 
                detail: 'Vui lòng điền đầy đủ thông tin và đảm bảo dữ liệu hợp lệ!'});
            return; 
        }
    const data = this.form.value;
    if (data.importPrice > data.sellPrice) {
        this.messageService.add({
            severity:'warn', 
            summary: 'cảnh báo', 
            detail: 'Giá nhập không được lớn hơn giá bán!'});
    }
    const payload: Product =
        {
            id: 0,
            name: this.form.value.name ?? '',
            sellPrice: Number(this.form.value.sellPrice ?? 0),
            importPrice: Number(this.form.value.importPrice ?? 0),
            quantity: Number(this.form.value.quantity ?? 0),
            imageUrl: this.form.value.imageUrl ?? '',
            description: this.form.value.description ?? '',
            categoryId: Number(this.form.value.categoryId ?? 0)
            , brandId: this.form.value.brandId ? Number(this.form.value.brandId) : undefined
        };
    console.log('Dữ liệu đạt chuẩn 100%, tiến hành gọi API gửi xuống Backend:', payload);   
    this.service.create(payload).subscribe({
        next: () => {
        this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Thành công', 
                    detail: 'Đã thêm sản phẩm mới!' 
                });
                setTimeout(() => {
                    this.router.navigate(['/admin/product']);
                }, 1000);
        },
        error: (err) => {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Lỗi', 
                detail: 'Không thể lưu sản phẩm!' 
            });
        }
    });
    }
    loadBrands(): void {
        this.brandService.getAll().subscribe({
            next: (res) => {
                this.brands = res;
            },
            error: (err) => {
                console.error('Không load được thương hiệu:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể tải thương hiệu!'
                });
            }
        });
    }
    loadCategories(): void {
    this.categoryService.getAll().subscribe({
        next: (res) => {
            this.categories = res;
        },
        error: (err) => {
            console.error('Không load được danh mục:', err);
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải danh mục!'
            });
        }
    });
}
    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            if (result) {
                this.form.patchValue({
                    imageUrl: result
                });
            }
        };
        reader.readAsDataURL(file);
    }
    cancel(): void
    {this.router.navigate(['/admin/product']);}
}
