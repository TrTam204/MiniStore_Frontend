import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { CartDetail } from '../models/cart-detail';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart | null = null;
  constructor(private userService: UserService) {}
  private getCartKey(userId: number): string {
  return `cart_user_${userId}`;
}

private saveCart(): void {
  if (!this.cart) {
    return;
  }
  localStorage.setItem(
    this.getCartKey(this.cart.userId),
    JSON.stringify(this.cart)
  );
}

private loadCart(userId: number): Cart | null {
  const cartData = localStorage.getItem(this.getCartKey(userId));
  if (!cartData) {
    return null;
  }
  return JSON.parse(cartData) as Cart;
}
  initializeCart() {
    const currentUserId = this.userService.getCurrentUserId();
    if (!currentUserId) {
      this.cart = null;
      return;
    }
    this.cart = {
      id: 1,
      userId: currentUserId,
      cartDetails: []
    };
      this.saveCart();
  }
  addToCart(
    productId: number,
    productName: string,
    imageUrl: string,
    price: number
  ) {
    if (!this.cart) {
      this.initializeCart();
    }
    if (!this.cart) {
      return;
    }
    const existingItem = this.cart.cartDetails.find(
      x => x.productId === productId
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const newCartDetail: CartDetail = {
        id: this.cart.cartDetails.length + 1,
        cartId: this.cart.id,
        productId: productId,
        productName: productName,
        imageUrl: imageUrl,
        quantity: 1,  
        price: price
      };
      this.cart.cartDetails.push(newCartDetail);
    }
    this.saveCart();
  }
  getCart(): Cart | null {
    const currentUserId = this.userService.getCurrentUserId();
  if (!currentUserId) {
    this.cart = null;
    return null;
  }
  this.cart = this.loadCart(currentUserId);
  return this.cart;
}
  increaseQuantity(productId: number) {
  const item = this.cart?.cartDetails.find(
    x => x.productId === productId
  );
  if (item) {
    item.quantity++;
  }
  this.saveCart();
}
decreaseQuantity(productId: number) {
  const item = this.cart?.cartDetails.find(
    x => x.productId === productId
  );
  if (!item) {
    return;
  }
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    this.cart!.cartDetails =
      this.cart!.cartDetails.filter(
        x => x.productId !== productId
      );
  }
  this.saveCart();
}
clearCurrentCart(): void {
  this.cart = null;
}
clearCart(): void {
  if (!this.cart) {
    return;
  }
  const userId = this.cart.userId;
  const cartId = this.cart.id;
  localStorage.removeItem(this.getCartKey(userId));
  this.cart = {
    id: cartId,
    userId: userId,
    cartDetails: []
  };
  this.saveCart();
}
}
