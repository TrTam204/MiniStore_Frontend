import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-product-detail',
  standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, RatingModule, FormsModule, TagModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit
{
    product?: Product;
    productRating: number = 0;
    relatedProducts: Product[] = [];
    imagePreview: string | null = null;
    productForm!: FormGroup;
    productId!: number;
    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private messageService: MessageService,
        private userService: UserService,
        private router: Router,
        private fb: FormBuilder,)
    {
    }
    ngOnInit(): void
    {
        this.route.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        this.productService.getById(id).subscribe(res => {
            this.product = res;
            this.productRating =
                Math.floor(Math.random() * 2) + 4;
            if (res?.categoryId && res?.id) {
                this.productService
                    .getRelatedProducts(
                        res.categoryId,
                        res.id
                    )
                    .subscribe(related => {
                        this.relatedProducts =
                            Array.isArray(related)
                                ? related
                                : [];
                    });
            }
        });
    });
    }
    getFullImageUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    return `http://localhost:5128${url}`;
    }
    goToDetail(id: number): void
    {this.router.navigate(['/product-detail', id]);}
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