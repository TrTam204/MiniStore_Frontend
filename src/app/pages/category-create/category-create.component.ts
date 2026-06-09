import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {CategoryService} from '../../services/category.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent implements OnInit {

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
createCategory() {

    if (this.categoryForm.invalid) {
        this.categoryForm.markAllAsTouched();
        return;
    }

    const request = {
        id: 0,
        name: this.categoryForm.value.name
    };

    this.categoryService.create(request)
        .subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Category created successfully'
                });
                this.router.navigate(['/admin/category']);
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message ?? 'Failed to create category'
                });
            }
        });
}
    cancel(): void
    {this.router.navigate(['/admin/category']);}
}
