import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrderService } from '../../services/order.service';
import { CheckoutRequest } from '../../models/checkout-request';
import { MessageService } from 'primeng/api';
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
  constructor(private cartService: CartService, 
              private orderService: OrderService,
              private messageService: MessageService) {}
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
  checkout(): void {
  if (!this.cart || this.cart.cartDetails.length === 0) {
    alert('Giỏ hàng đang trống.');
    return;
  }
  const request: CheckoutRequest = {
    userId: this.cart.userId,
    items: this.cart.cartDetails.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };
  this.orderService.checkout(request).subscribe({
  next: (res) => {
    this.messageService.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Đang xử lý thanh toán...'
  });
    this.cartService.clearCart();
    this.refreshCart();
    setTimeout(() => {
    window.location.reload();
  }, 2500);
  },
  error: (err) => {
    console.log(err);
    this.messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Thanh toán thất bại. Vui lòng kiểm tra lại.'
    });
  }
});
}
}