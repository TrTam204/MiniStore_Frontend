import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-update.component.html',
  styleUrl: './category-update.component.css'
})
export class CategoryUpdateComponent implements OnInit {
  id!: number;
  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.categoryService.getById(this.id).subscribe({
      next: (category: Category) => {
        this.categoryForm.patchValue({
          name: category.name
        });
        console.log('Đã load dữ liệu category:', category);
      },
      error: (err) => {
        console.error('Không load được category:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu danh mục!'
        });
      }
    });
  }

  updateCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền tên danh mục!'
      });
      return;
    }

    const payload: Category = {
      id: 0,
      name: this.categoryForm.value.name ?? ''
    };

    console.log('Dữ liệu đạt chuẩn, tiến hành gọi API cập nhật:', payload);

    this.categoryService.update(this.id, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật danh mục!'
        });
        setTimeout(() => {
          this.router.navigate(['/category']);
        }, 1000);
      },
      error: (err) => {
        console.error('Lỗi cập nhật:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lưu danh mục!'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/category']);
  }
}
