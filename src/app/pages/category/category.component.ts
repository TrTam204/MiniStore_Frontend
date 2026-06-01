import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    TableModule, RouterLink, ButtonModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  deleteCategory(id: number, categoryName: string): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        const hasProducts = products.some(p => p.categoryId === id);
        
        if (hasProducts) {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: `Không thể xóa danh mục "${categoryName}" vì còn sản phẩm trong danh mục này!`
          });
          return;
        }

        if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
          this.categoryService.delete(id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa danh mục!'
              });
              this.loadCategories();
            },
            error: (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xóa danh mục!'
              });
            }
          });
        }
      },
      error: (error) => {
        console.error('Lỗi khi kiểm tra sản phẩm:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể kiểm tra sản phẩm!'
        });
      }
    });
  }
}