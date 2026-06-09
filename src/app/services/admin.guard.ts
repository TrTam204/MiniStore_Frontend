import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const role = localStorage.getItem('role');

  if (role?.toLowerCase() === 'admin') {
    return true;
  }

  alert('Bạn không có quyền truy cập vào trang quản trị!');
  router.navigate(['/home']);
  return false;
};