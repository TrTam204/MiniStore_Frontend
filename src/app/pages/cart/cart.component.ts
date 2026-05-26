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
    this.loadCart();
  }
  loadCart() {
    this.cart = this.cartService.getCart();
    console.log(this.cart);
  }
  getTotalPrice(): number {
  if (!this.cart) {
    return 0;
  }
  return this.cart.cartDetails.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}
  increaseQuantity(productId: number) {
    this.cartService.increaseQuantity(productId);
    this.loadCart();
  }
  decreaseQuantity(productId: number) {
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
  this.loadCart();
}
}