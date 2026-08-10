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
import { VoucherService } from '../../services/voucher.service';
import { CheckoutRequest } from '../../models/checkout-request';
import { CheckoutItem } from '../../models/checkout-request';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/seach.service';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';
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
  isMenuOpen = false;
  isLoggedIn = false;
  products: Product[] = [];
  suggestions: Product[] = [];
  searchKeyword: string = '';
  voucherCode: string = '';
  voucherPreview: { isValid: boolean; discountAmount: number; finalAmount: number; message: string } | null = null;
  constructor(private cartService: CartService, 
              private orderService: OrderService,
              private voucherService: VoucherService,
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

  toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMenuOpen = false;
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
    this.closeMobileMenu();
    this.router.navigate(['/product-detail', product.id]);
  }

  applyVoucher(): void {
    if (!this.voucherCode || this.voucherCode.trim() === '') {
      this.messageService.add({ severity: 'warn', summary: 'Lưu ý', detail: 'Vui lòng nhập mã giảm giá.' });
      return;
    }
    this.refreshCart();
    const subtotal = this.getTotalPrice();
    const cartItems = this.cart?.cartDetails.map<CheckoutItem>(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    
    // Lấy userId từ localStorage nếu người dùng đã đăng nhập
    const userIdStr = localStorage.getItem('currentUserId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : undefined;
    
    this.voucherService.apply(this.voucherCode.trim(), subtotal, cartItems, userId).subscribe({
      next: (res) => {
        console.log('Voucher apply response:', res);
        this.voucherPreview = res;
        if (res.isValid) {
          this.messageService.add({ severity: 'success', summary: 'Áp dụng thành công', detail: res.message || 'Mã giảm giá đã được áp dụng' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Không thể áp dụng', detail: res.message || 'Mã giảm giá không hợp lệ' });
        }
      },
      error: (err) => {
        console.error('Voucher error:', err);
        let errorDetail = 'Không thể kiểm tra voucher.';
        
        // Chi tiết lỗi 401
        if (err.status === 401) {
          errorDetail = 'Chưa đăng nhập hoặc phiên hết hạn. Vui lòng đăng nhập lại.';
        } else if (err.error?.message) {
          errorDetail = err.error.message;
        } else if (err.statusText) {
          errorDetail = err.statusText;
        }
        
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: errorDetail });
      }
    });
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
    const subtotal = this.getTotalPrice();
    const shipping = this.getShippingFee();
    const discount = this.voucherPreview && this.voucherPreview.isValid ? this.voucherPreview.discountAmount : 0;
    return subtotal + shipping - discount;
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
  getFullImageUrl(url: string | null |undefined): string {
  if (!url) {
    return 'assets/no-image.png';
  }
  if (url.startsWith('http') || url.startsWith('data:image')) {
    return url;
  }
  return `${environment.apiUrl}${url}`;
  }
  checkout(): void {
    if (!this.cart || this.cart.cartDetails.length === 0) {
      alert('Giỏ hàng đang trống.');
      return;
    }

    this.isCartOpen = false;
    this.closeMobileMenu();
    this.router.navigate(['/payment'], {
      state: {
        voucherCode: this.voucherPreview && this.voucherPreview.isValid ? this.voucherCode : '',
        voucherPreview: this.voucherPreview
      }
    });
  }
}