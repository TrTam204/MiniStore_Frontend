import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CheckoutRequest } from '../../models/checkout-request';
import { Cart } from '../../models/cart';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  cart: Cart | null = null;
  voucherCode = '';
  voucherPreview: { isValid: boolean; discountAmount: number; finalAmount: number; message: string } | null = null;
  shippingMode: 'default' | 'custom' = 'default';
  shippingName = '';
  shippingPhone = '';
  shippingAddress = '';
  paymentMethod: 'cod' | 'qr' = 'cod';
  isSubmitting = false;
  isLoadingProfile = false;
  qrUrl = '';
  bankName = 'Vietcombank';
  accountHolder = 'MiniStore';
  bankId = 'VCB';
  accountNo = '1032888088';
  orderCode = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    const navState = (this.router.getCurrentNavigation()?.extras.state as any) ?? history.state ?? {};
    this.voucherCode = navState.voucherCode ?? '';
    this.voucherPreview = navState.voucherPreview ?? null;
    this.orderCode = `PAY${Date.now()}`;
    this.generateQrUrl();
    this.loadDefaultAddress();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  loadDefaultAddress(): void {
    const currentUserId = this.userService.getCurrentUserId();
    if (!currentUserId) {
      this.shippingMode = 'custom';
      return;
    }

    this.isLoadingProfile = true;
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.shippingName = user.fullName || '';
        this.shippingPhone = user.phone || '';
        this.shippingAddress = user.address || '';
        this.generateQrUrl();
        this.isLoadingProfile = false;
      },
      error: () => {
        this.isLoadingProfile = false;
        this.shippingMode = 'custom';
        this.messageService.add({ severity: 'warn', summary: 'Lưu ý', detail: 'Không thể tải thông tin người dùng.' });
      }
    });
  }

  onShippingModeChange(): void {
    if (this.shippingMode === 'default') {
      this.loadDefaultAddress();
    }
  }

  private generateQrUrl(): void {
    const amount = this.getTotal();
    const paymentContent = this.orderCode
      ? `Thanh toan don hang #${this.orderCode}`
      : 'Thanh toan don hang';
    this.qrUrl = `https://img.vietqr.io/image/${this.bankId}-${this.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(paymentContent)}`;
  }

  getSubtotal(): number {
    if (!this.cart) {
      return 0;
    }
    return this.cart.cartDetails.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getShippingFee(): number {
    return this.getSubtotal() >= 500000 ? 0 : 30000;
  }

  getDiscount(): number {
    return this.voucherPreview?.isValid ? this.voucherPreview.discountAmount : 0;
  }

  getTotal(): number {
    return Math.max(0, this.getSubtotal() + this.getShippingFee() - this.getDiscount());
  }

  placeOrder(): void {
    if (!this.cart || this.cart.cartDetails.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Lưu ý', detail: 'Giỏ hàng đang trống.' });
      return;
    }

    if (!this.shippingName.trim() || !this.shippingPhone.trim() || !this.shippingAddress.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Lưu ý', detail: 'Vui lòng nhập đầy đủ thông tin giao hàng.' });
      return;
    }

    this.isSubmitting = true;

    const request: CheckoutRequest = {
      userId: this.cart.userId,
      items: this.cart.cartDetails.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      voucherCode: this.voucherPreview && this.voucherPreview.isValid ? this.voucherCode : undefined,
      paymentMethod: this.paymentMethod,
      shippingName: this.shippingName,
      shippingPhone: this.shippingPhone,
      shippingAddress: this.shippingAddress
    };

    this.orderService.checkout(request).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.messageService.add({
          severity: 'success',
          summary: 'Đặt hàng thành công',
          detail: `Đơn hàng của bạn đã được ghi nhận bằng phương thức ${this.paymentMethod === 'cod' ? 'COD' : 'QR Pay'}.`
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isSubmitting = false;
        const errorMessage = err?.error?.message || err?.error || 'Thanh toán thất bại. Vui lòng thử lại.';
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: errorMessage });
      }
    });
  }
}
