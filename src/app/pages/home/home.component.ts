import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {CartService} from '../../services/cart.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit
{
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    products: Product[] = [];
    constructor(
        private productService: ProductService,
        private router: Router,
        private cartService: CartService,
        private categoryService: CategoryService,
        private userService: UserService,
        private messageService: MessageService)
        {
        }
    ngOnInit(): void
    {this.loadData();}
    loadData()
    {
        this.categoryService.getAll().subscribe((res) =>
        {
            console.log('Categories API response:', res);
            this.categories = Array.isArray(res) ? res : [];
        });
        const currentUserId = this.userService.getCurrentUserId();
        if (!currentUserId) {
            console.log('Chưa có user nào đăng nhập. Chuyển hướng sang trang Login...');
        this.router.navigate(['/login']);
        return;
        }
        console.log('User đang hoạt động hợp lệ có ID là:', currentUserId);
        {console.log(this.userService.getCurrentUserId());};
        this.productService.getAll().subscribe((res) =>
        {
            console.log('Products API response:', res);
            this.products = Array.isArray(res) ? res : [];
        this.filteredProducts = this.products;
        });
    }
        addToCart(product: any) {
        this.cartService.addToCart(
        product.id,
        product.name,
        product.imageUrl,
        product.sellPrice
        );
        console.log('Đã thêm vào cart');
        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Đã thêm ${product.name} vào giỏ hàng!`
        });
    }
    selectCategory(categoryId: number): void
    {
        this.filteredProducts = this.products.filter(
            product => product.categoryId === categoryId
        );
        window.scrollTo({
            top: 350,
            behavior: 'smooth'
        });
    }
    goToDetail(id: number): void
    {this.router.navigate(['/product-detail', id]);}
}   