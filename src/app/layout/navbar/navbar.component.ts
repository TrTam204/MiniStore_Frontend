import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,
            ButtonModule,
            InputTextModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private cartService: CartService) {}
  getCartQuantity(): number {
  const cart = this.cartService.getCart();
  if (!cart) {
    return 0;
  }
  return cart.cartDetails.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}
}
