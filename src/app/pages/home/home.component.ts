import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {CartService} from '../../services/cart.service';
import { MessageService } from 'primeng/api';
import { SearchService } from '../../services/seach.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, ChipModule, PaginatorModule, RatingModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit
{
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    products: Product[] = [];
    selectedCategoryId: string = 'all';
    imagePreview: string | null = null;
    productForm!: FormGroup;
    productId!: number;
    

    rows: number = 5;
    first: number = 0;

    productRatings: Map<number, number> = new Map();
    constructor(
        private productService: ProductService,
        private router: Router,
        private cartService: CartService,
        private categoryService: CategoryService,
        private userService: UserService,
        private searchService: SearchService,
        private messageService: MessageService,
        private fb: FormBuilder,)
        {
        }
    ngOnInit(): void
    { this.updateRowsForViewport();
    this.loadData();

    this.searchService.searchKeyword$
    .subscribe(keyword =>
    {
        if (!keyword || keyword.trim() === '')
        {
            this.filteredProducts = this.products;
            return;
        }

        this.filteredProducts = this.products.filter(product =>
            product.name.toLowerCase()
            .includes(keyword.toLowerCase())
        );
    });
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.updateRowsForViewport();
    }

    private updateRowsForViewport(): void {
        this.rows = window.innerWidth <= 576 ? 6 : 5;
    }
    loadData()
    {
        this.categoryService.getAll().subscribe((res) =>
        {
            console.log('Categories API response:', res);
            this.categories = Array.isArray(res) ? res : [];
        });
        this.productService.getAll().subscribe((res) =>
        {
            console.log('Products API response:', res);
            this.products = Array.isArray(res) ? res : [];
        this.filteredProducts = this.products;
        });
    }
    getFullImageUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    return `${environment.apiUrl}${url}`;
    }
    addToCart(product: any, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        const currentUserId = this.userService.getCurrentUserId();
        if (!currentUserId) {
            this.messageService.add({
            severity: 'warn',
            summary: 'Thông báo',
            detail: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!'
            });
            this.router.navigate(['/login']);
            return;
        }
        this.cartService.addToCart(
            product.id,
            product.name,
            product.imageUrl,
            product.sellPrice
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Đã thêm ${product.name} vào giỏ hàng!`
        });
    }
    showAllProducts(): void {
    this.selectedCategoryId = 'all';
    this.filteredProducts = this.products;
    }
    selectCategory(categoryId: number): void
    {
        this.selectedCategoryId = String(categoryId);
        this.filteredProducts = this.products.filter(
            product => product.categoryId === categoryId
        );
        window.scrollTo({
            top: 350,
            behavior: 'smooth'
        });
    }

    onCategorySelect(value: string): void {
        if (value === 'all') {
            this.showAllProducts();
            return;
        }

        const categoryId = Number(value);
        if (Number.isNaN(categoryId)) {
            return;
        }

        this.selectCategory(categoryId);
    }

    getSelectedCategoryLabel(): string {
        if (this.selectedCategoryId === 'all') {
            return 'Tất cả';
        }

        const selectedCategory = this.categories.find(category => String(category.id) === this.selectedCategoryId);
        return selectedCategory?.name ?? 'Tất cả';
    }
    goToDetail(id: number): void
    {this.router.navigate(['/product-detail', id]);}
    
    onPageChange(event: any): void {
        this.first = event.first;
        this.rows = event.rows;
    }
    
    getProductRating(productId: number): number {
        if (!this.productRatings.has(productId)) {
            this.productRatings.set(productId, Math.floor(Math.random() * 2) + 4); // Random 4-5 stars
        }
        return this.productRatings.get(productId) || 4;
    }
}   