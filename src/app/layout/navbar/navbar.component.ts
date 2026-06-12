import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrderService } from '../../services/order.service';
import { CheckoutRequest } from '../../models/checkout-request';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/seach.service';
import { Product } from '../../models/product';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ButtonModule,
    InputTextModule,
    DrawerModule,
    AutoCompleteModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cart: Cart | null = null;
  isCartOpen = false;
  isLoggedIn = false;
  products: Product[] = [];
  suggestions: Product[] = [];
  searchKeyword: string = '';
  constructor(private cartService: CartService, 
              private orderService: OrderService,
              private searchService: SearchService,
              private productService: ProductService,
              private messageService: MessageService,
              private router: Router) 
  {this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.checkLoginStatus();
    });}
  onSearch(): void {
  this.searchService.setKeyword(this.searchKeyword);
  }
  ngOnInit(): void {
    this.checkLoginStatus();
    this.productService.getAll().subscribe(res => {
      this.products = Array.isArray(res) ? res : [];
      console.log('Products loaded:', this.products);
    });
  }
  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }
  filterProducts(event: any): void {
    const query = event.query.toLowerCase();
    this.suggestions = this.products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    console.log('Suggestions:', this.suggestions);
  }

  onSelectProduct(product: Product): void {
    console.log('Selected product:', product);
    this.searchKeyword = '';
    this.router.navigate(['/product-detail', product.id]);
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

  getShippingFee(): number {
    const subtotal = this.getTotalPrice();
    return subtotal >= 500000 ? 0 : 30000;
  }

  getFinalTotal(): number {
    return this.getTotalPrice() + this.getShippingFee();
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