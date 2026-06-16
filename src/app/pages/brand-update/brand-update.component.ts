import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-brand-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.css']
})
export class BrandUpdateComponent implements OnInit {
  brandForm!: FormGroup;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private brandService: BrandService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      description: ['']
    });

    this.brandService.getById(this.id).subscribe({
      next: (brand: Brand) => {
        this.brandForm.patchValue({
          name: brand.name,
          country: brand.country,
          description: brand.description
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu thương hiệu'
        });
      }
    });
  }

  updateBrand(): void {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    const request: Brand = {
      id: this.id,
      name: this.brandForm.value.name,
      country: this.brandForm.value.country,
      description: this.brandForm.value.description
    };

    this.brandService.update(this.id, request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật thương hiệu'
        });
        this.router.navigate(['/admin/brand']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật thương hiệu'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/brand']);
  }
}
