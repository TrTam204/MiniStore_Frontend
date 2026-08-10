import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ReportService } from '../../services/report.service';
import { VoucherService } from '../../services/voucher.service';

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
    ToolbarModule,
    ChartModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: [MessageService]
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  vouchers: any[] = [];
  categories: Category[] = [];

  totalProducts = 0;
  totalCategories = 0;
  lowStockProducts = 0;
  totalInventoryValue = 0;

  report: SalesReportSummary = {
    totalOrders: 0,
    totalProductsSold: 0,
    totalRevenue: 0,
    items: [],
    categoryBreakdown: []
  };

  // Chart data
  chartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };
  chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
    position: 'bottom',
    align: 'center',
    labels: {
      color: '#111827',
      font: {
        size: 11,
        weight: '600'
      },
      boxWidth: 24,
      boxHeight: 12,
      padding: 12
        }
    },

    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.parsed;
          return  `${context.label}: Đã bán ${value?.toLocaleString('vi-VN')} sản phẩm`;
        }
      }
    }
  },

  animation: {
    duration: 300
  },

  cutout: '74%',
  radius: '76%',

  layout: {
    padding: 2
  }
};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private reportService: ReportService,
    private messageService: MessageService,
    private voucherService: VoucherService
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

          if (this.lowStockProducts > 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Cảnh báo',
              detail: `Có ${this.lowStockProducts} sản phẩm sắp hết hàng.`,
              life: 5000
            });
          }

        // compute inventory value using best percentage voucher per product (if any)
        this.voucherService.getAll().subscribe({
          next: (vouchers) => {
            this.vouchers = Array.isArray(vouchers) ? vouchers : [];
            this.totalInventoryValue = this.products.reduce((total, product) => {
              const bestPercent = this.vouchers
                .filter(v => v.isActive)
                .filter(v => {
                  const now = new Date();
                  const start = new Date(v.startDate);
                  const end = new Date(v.endDate);
                  if (start > now || end < now) return false;
                  if (v.applicableType === 1 && v.applicableCategoryId !== product.categoryId) return false;
                  if (v.applicableType === 2 && Array.isArray(v.applicableProductIds) && !v.applicableProductIds.includes(product.id)) return false;
                  return true;
                })
                .filter(v => v.discountType === 0) // only percentage-based vouchers
                .map(v => v.discountValue ?? 0);

              const maxPercent = bestPercent.length > 0 ? Math.max(...bestPercent) : 0;
              const discountedPrice = product.sellPrice * (1 - (maxPercent / 100));
              return total + Math.round(discountedPrice) * product.quantity;
            }, 0);
          },
          error: () => {
            // fallback to base price if voucher fetch fails
            this.totalInventoryValue = this.products.reduce((total, product) => total + product.sellPrice * product.quantity, 0);
          }
        });
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
        this.buildCategoryDoughnutChart(Array.isArray(res.categoryBreakdown) ? res.categoryBreakdown : []);
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

  buildCategoryDoughnutChart(items: any[]): void {
    const labels = items.map(item => item.categoryName || 'Khác');
    const data = items.map(item => item.totalQuantity ?? 0);

    this.chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#EC407A',
            '#AB47BC',
            '#29B6F6',
            '#FFCA28'
          ],
          hoverOffset: 4,
          offset: 0,
          borderWidth: 2,
          borderColor: '#18181b'
        }
      ]
    };
  }

  exportExcel(): void {
    const data = this.report.items.map((item) => ({
      'Mã đơn hàng': item.orderId,
      'Ngày đặt': item.orderDate,
      'Người mua': item.fullName,
      'Email': item.email,
      'Sản phẩm': item.productNames,
      'Tổng SL': item.totalQuantity,
      'Thành tiền': item.totalAmount,
      'Trạng thái': item.status || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCaoBanHang');
    XLSX.writeFile(workbook, 'bao-cao-ban-hang.xlsx');
  }

}