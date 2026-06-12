import { Routes } from '@angular/router';

import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { adminGuard } from './services/admin.guard';

// IMPORT CÁC TRANG USER
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// IMPORT CÁC TRANG ADMIN
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductUpdateComponent } from './pages/product-update/product-update.component';
import { CategoriesComponent } from './pages/category/category.component';
import { CategoryCreateComponent } from './pages/category-create/category-create.component';
import { CategoryUpdateComponent } from './pages/category-update/category-update.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminUserCreateComponent } from './pages/admin-user-create/admin-user-create.component';
import { AdminUserUpdateComponent } from './pages/admin-user-update/admin-user-update.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';

export const routes: Routes = [
  // ==========================================
  // KHU VỰC KHÁCH HÀNG (Dùng vỏ bọc UserLayout - có Navbar/Footer)
  // ==========================================
{
    path: '', 
    component: UserLayoutComponent, 
    children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
      // User tự xem thông tin cá nhân (Không cần lồng children phức tạp lúc này)
    { path: 'user-info', component: UserInfoComponent }, 
    { path: 'product-detail/:id', component: ProductDetailComponent },
    ]
},

  // ==========================================
  // KHU VỰC QUẢN TRỊ VIÊN (Dùng vỏ bọc AdminLayout - có Sidebar trái)
  // ==========================================
    {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardComponent },

      // CRUD Category dành cho Admin
    { path: 'category', component: CategoriesComponent },
    { path: 'category/add', component: CategoryCreateComponent },
    { path: 'category/edit/:id', component: CategoryUpdateComponent },

      // CRUD Product dành cho Admin (User không được phép thêm sửa xóa)
    { path: 'product', component: ProductsComponent },
    { path: 'product/add', component: ProductCreateComponent },
    { path: 'product/edit/:id', component: ProductUpdateComponent },
    
    // Quản lý người dùng
    { path: 'users', component: AdminUsersComponent },
    { path: 'users/add', component: AdminUserCreateComponent },
    { path: 'users/edit/:id', component: AdminUserUpdateComponent },
    { path: 'orders', component: AdminOrdersComponent },
      
      // GHI CHÚ: Sau này bạn nên tạo một trang AdminProductListComponent
      // để hiển thị bảng sản phẩm dành riêng cho Admin ở đường dẫn: path: 'product'
    ]
},

  // ==========================================
  // URL KHÔNG TỒN TẠI
  // ==========================================
  { path: '**', redirectTo: 'home' }
];