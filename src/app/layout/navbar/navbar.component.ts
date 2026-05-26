import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ButtonModule,
    InputTextModule,
    DrawerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cart: Cart | null = null;
  isCartOpen = false;
  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.refreshCart();
  }
  refreshCart(): void {
    this.cart = this.cartService.getCart();
  }
  openCart(): void {
    this.refreshCart();
    this.isCartOpen = true;
  }
  getCartQuantity(): number {
    this.refreshCart();
    if (!this.cart) {
      return 0;
    }
    return this.cart.cartDetails.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
  getTotalPrice(): number {
    this.refreshCart();
    if (!this.cart) {
      return 0;
    }
    return this.cart.cartDetails.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }
  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
    this.refreshCart();
  }
  decreaseQuantity(productId: number): void {
    this.refreshCart();
    if (!this.cart) {
      return;
    }
    const item = this.cart.cartDetails.find(x => x.productId === productId);
    if (!item) {
      return;
    }
    if (item.quantity === 1) {
      const isConfirmed = confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?');
      if (!isConfirmed) {
        return;
      }
    }
    this.cartService.decreaseQuantity(productId);
    this.refreshCart();
  }
}