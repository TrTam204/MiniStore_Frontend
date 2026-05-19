import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import {OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  constructor(
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    console.log(this.cart);
  }
  increaseQuantity(productId: number) {this.cartService.increaseQuantity(productId);}

decreaseQuantity(productId: number) {this.cartService.decreaseQuantity(productId);}
}