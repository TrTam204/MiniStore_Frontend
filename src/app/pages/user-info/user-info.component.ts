import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [

  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  constructor(public userService: UserService) {}
  ngOnInit(): void {
    const currentUserEmail = this.userService.getCurrentUserEmail();
  }
  logout(): void {
    this.userService.logout();  
  }
}
