import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderHistory } from '../../models/order-history';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    TagModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  orders: OrderHistory[] = [];
  constructor(public userService: UserService, 
              private orderService: OrderService,
              private router: Router) {}
  ngOnInit(): void {
  const currentUserId = this.userService.getCurrentUserId();
  if (!currentUserId) {
    return;
  }
    this.orderService.getOrdersByUserId(currentUserId).subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {
        console.log('Load order history error:', err);
      }
    });
}
  logout(): void {
  this.userService.logout();

  this.router.navigate(['/home']).then(() => {
    window.location.reload();
  });
}
}
