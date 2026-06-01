import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductUpdateComponent } from './pages/product-update/product-update.component';
import { LoginComponent } from './pages/login/login.component';
import { CategoriesComponent } from './pages/category/category.component';
import { CategoryCreateComponent } from './pages/category-create/category-create.component';
import { CategoryUpdateComponent } from './pages/category-update/category-update.component';

export const routes: Routes = [
{path: '', redirectTo: 'home', pathMatch: 'full'},
{path: 'home', component : HomeComponent},
{path: 'product', component: ProductsComponent},
{path: 'category', component: CategoriesComponent},
{path: 'category/add', component: CategoryCreateComponent},
{path: 'category/edit/:id', component: CategoryUpdateComponent},
{path: 'product/add', component: ProductCreateComponent},
{path: 'product/edit/:id', component: ProductUpdateComponent},
{path:'product-detail/:id', component: ProductDetailComponent},
{path:'product-create', component: ProductCreateComponent},

{path:'product-update/:id', component: ProductUpdateComponent},
{path:'user-info', component: UserInfoComponent,
    children:[
        {path: '', component: UserInfoComponent},
        {path: 'edit', component: UserInfoComponent},
        {path: 'edit/:id', component: UserInfoComponent},
        {path: 'add', component: UserInfoComponent}
    ]},
{path: 'login', component:LoginComponent},
{path: '**', redirectTo: 'home'}

];
