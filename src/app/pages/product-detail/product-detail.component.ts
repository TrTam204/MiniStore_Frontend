import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../services/cart.service';
import { MessageService } from 'primeng/api';
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
        private messageService: MessageService)
    {
    }
    ngOnInit(): void
    {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.productService.getById(id).subscribe((res) =>
        {this.product = res;});
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
}}