import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    return true;
  }
  alert('Bạn không có quyền truy cập vào trang này!');
  router.navigate(['/home']);
  return false;
};
