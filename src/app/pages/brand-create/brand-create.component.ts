import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-brand-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.css']
})
export class BrandCreateComponent implements OnInit {
  brandForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {}

  createBrand(): void {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    const request = {
      id: 0,
      name: this.brandForm.value.name,
      country: this.brandForm.value.country,
      description: this.brandForm.value.description
    };

    this.brandService.create(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã tạo thương hiệu mới'
        });
        this.router.navigate(['/admin/brand']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.error?.message ?? 'Không thể tạo thương hiệu'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/brand']);
  }
}
