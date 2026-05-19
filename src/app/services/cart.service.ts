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

  initializeCart() {

    const currentUserId = this.userService.getCurrentUserId();

    if (!currentUserId) {
      return;
    }
    this.cart = {
      id: 1,
      userId: currentUserId,
      cartDetails: []
    };
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
  }
  getCart(): Cart | null {
    return this.cart;
  }
  increaseQuantity(productId: number) {

  const item = this.cart?.cartDetails.find(
    x => x.productId === productId
  );

  if (item) {
    item.quantity++;
  }

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
}
}