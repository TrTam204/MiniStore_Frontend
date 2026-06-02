import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../services/cart.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit
{
    product?: Product;
    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private messageService: MessageService,
        private userService: UserService,
        private router: Router)
    {
    }
    ngOnInit(): void
    {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.productService.getById(id).subscribe((res) =>
        {this.product = res;});
        window.scrollTo(0, 0);
    }
    addToCart(product: any) {
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
}}