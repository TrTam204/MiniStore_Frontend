import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { OrderService } from '../../services/order.service';
import { OrderHistory } from '../../models/order-history';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        DropdownModule,
        ButtonModule,
        TagModule,
        ToastModule
    ],
    templateUrl: './admin-orders.component.html',
    styleUrl: './admin-orders.component.css',
    providers: [MessageService]
    })
    export class AdminOrdersComponent implements OnInit {
    orders: OrderHistory[] = [];
    statusOptions = [
    { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
    { label: 'Đang xử lý', value: 'Đang xử lý' },
    { label: 'Đang giao hàng', value: 'Đang giao hàng' },
    { label: 'Đã nhận', value: 'Đã nhận' },
    { label: 'Đã hủy', value: 'Đã hủy' }
];

    constructor(
        private orderService: OrderService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.orderService.getAllOrders().subscribe({
        next: (orders) => {
            this.orders = Array.isArray(orders) ? orders : [];
        },
        error: (err) => {
            console.error('Load orders error:', err);
            this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách đơn hàng.'
            });
        }
        });
    }

    updateStatus(order: OrderHistory): void {
        console.log("Đang cập nhật đơn hàng:", order.orderId, "sang trạng thái:", order.status);
        this.orderService.updateOrderStatus(order.orderId, order.status).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật thành công',
            detail: `Đơn hàng #${order.orderId} đã được cập nhật trạng thái.`
            });
        },
        error: (err) => {
            console.error('Update order status error:', err);
            this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật trạng thái đơn hàng.'
            });
        }
        });
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        if (!status) {
        return 'secondary';
    }
    const s = status.trim().toLowerCase();
        switch (status.toLowerCase()) {
        case 'chờ xác nhận':
            return 'warn';
        case 'đang xử lý':
            return 'info';
        case 'đang giao hàng':
            return 'info';
        case 'đã nhận':
            return 'success';
        case 'đã hủy':
            return 'danger';
        default:
            return 'secondary';;
        }
    }
    }
