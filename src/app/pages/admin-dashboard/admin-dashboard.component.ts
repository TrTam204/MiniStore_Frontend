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
import { OrderService } from '../../services/order.service';

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
      position: 'right',
      labels: {
        color: '#ffffff',
        font: {
          size: 14,
          weight: 'bold'
        },
        boxWidth: 20,
        boxHeight: 12,
        padding: 15
      }
    },

    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.parsed;
          return `${context.label}: ${value?.toLocaleString('vi-VN')} ₫`;
        }
      }
    }
  },

  animation: {
    duration: 300
  },

  layout: {
    padding: 10
  }
};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private reportService: ReportService,
    private messageService: MessageService,
    private orderService: OrderService
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
        // try to enrich report items with order status from Orders API
        this.orderService.getAllOrders().subscribe({
          next: (orders) => {
            const statusMap = new Map<number, string>();
            (orders || []).forEach(o => statusMap.set(o.orderId, o.status));
            if (Array.isArray(this.report.items)) {
              this.report.items.forEach(item => {
                item.status = statusMap.get(item.orderId) || '';
              });
            }
            this.buildCategoryDoughnutChart(Array.isArray(res.items) ? res.items : []);
          },
          error: () => {
            // if orders fetch fails, still build chart without status
            this.buildCategoryDoughnutChart(Array.isArray(res.items) ? res.items : []);
          }
        });
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
    const grouped = items.reduce((acc, item) => {
      const category = item.categoryName || 'Khác';
      if (!acc[category]) {
        acc[category] = { quantity: 0, total: 0 };
      }
      acc[category].quantity += item.quantity ?? 0;
      acc[category].total += item.totalAmount ?? 0;
      return acc;
    }, {} as Record<string, { quantity: number; total: number }>);

    const labels = Object.keys(grouped);
    const data = labels.map(label => grouped[label].total);

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
      'Sản phẩm': item.productName,
      'Danh mục': item.categoryName,
      'Số lượng': item.quantity,
      'Thành tiền': item.totalAmount,
      'Trạng thái': item.status || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCaoBanHang');
    XLSX.writeFile(workbook, 'bao-cao-ban-hang.xlsx');
  }

}