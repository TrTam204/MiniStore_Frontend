import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ReportService } from '../../services/report.service';

import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { SalesReportSummary } from '../../models/sales-report';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToolbarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: [MessageService]
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  totalProducts = 0;
  totalCategories = 0;
  lowStockProducts = 0;
  totalInventoryValue = 0;

  report: SalesReportSummary = {
    totalOrders: 0,
    totalProductsSold: 0,
    totalRevenue: 0,
    items: []
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private reportService: ReportService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadReport();
  }

  loadDashboardData(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = Array.isArray(products) ? products : [];

        this.totalProducts = this.products.length;

        this.lowStockProducts = this.products.filter(
          product => product.quantity <= 5
        ).length;

        this.totalInventoryValue = this.products.reduce(
          (total, product) => total + product.sellPrice * product.quantity,
          0
        );
      },
      error: (error) => {
        console.error('Load products dashboard error:', error);
      }
    });

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = Array.isArray(categories) ? categories : [];
        this.totalCategories = this.categories.length;
      },
      error: (error) => {
        console.error('Load categories dashboard error:', error);
      }
    });
  }

  loadReport(): void {
    this.reportService.getSalesReport().subscribe({
      next: (res) => {
        this.report = res;
      },
      error: (err) => {
        console.error('Load sales report error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải báo cáo bán hàng.'
        });
      }
    });
  }

  exportExcel(): void {
    const data = this.report.items.map((item) => ({
      'Mã đơn hàng': item.orderId,
      'Ngày đặt': item.orderDate,
      'Người mua': item.fullName,
      'Email': item.email,
      'Sản phẩm': item.productName,
      'Danh mục': item.categoryName,
      'Số lượng': item.quantity,
      'Đơn giá': item.price,
      'Thành tiền': item.totalAmount
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCaoBanHang');

    XLSX.writeFile(workbook, 'bao-cao-ban-hang.xlsx');
  }
}