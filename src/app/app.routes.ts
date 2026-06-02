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

// IMPORT CÁC TRANG ADMIN
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductUpdateComponent } from './pages/product-update/product-update.component';
import { CategoriesComponent } from './pages/category/category.component';
import { CategoryCreateComponent } from './pages/category-create/category-create.component';
import { CategoryUpdateComponent } from './pages/category-update/category-update.component';

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
    canActivate: [adminGuard], // BẮT BUỘC: Lính canh kiểm tra quyền Admin
    children: [
      // Nếu gõ /admin -> Tự động chuyển đến /admin/category
    { path: '', redirectTo: 'category', pathMatch: 'full' },

      // CRUD Category dành cho Admin
    { path: 'category', component: CategoriesComponent },
    { path: 'category/add', component: CategoryCreateComponent },
    { path: 'category/edit/:id', component: CategoryUpdateComponent },

      // CRUD Product dành cho Admin (User không được phép thêm sửa xóa)
    { path: 'product', component: ProductsComponent },
    { path: 'product/add', component: ProductCreateComponent },
    { path: 'product/edit/:id', component: ProductUpdateComponent },
    
      // GHI CHÚ: Sau này bạn nên tạo một trang AdminProductListComponent
      // để hiển thị bảng sản phẩm dành riêng cho Admin ở đường dẫn: path: 'product'
    ]
},

  // ==========================================
  // BẪY LỖI: URL KHÔNG TỒN TẠI
  // ==========================================
  { path: '**', redirectTo: 'home' }
];