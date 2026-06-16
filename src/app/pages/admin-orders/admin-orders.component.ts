import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        DialogModule,
        TagModule,
        ToastModule
    ],
    templateUrl: './admin-orders.component.html',
    styleUrl: './admin-orders.component.css',
    providers: [MessageService]
    })
    export class AdminOrdersComponent implements OnInit {
    orders: OrderHistory[] = [];
    displayDetails = false;
    productForm!: FormGroup;
    productId!: number;
    selectedOrder: OrderHistory | null = null;
    statusOptions = [
    { label: 'Chờ xác nhận thanh toán', value: 'Chờ xác nhận thanh toán' },
    { label: 'Đã thanh toán', value: 'Đã thanh toán' },
    { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
    { label: 'Đang xử lý', value: 'Đang xử lý' },
    { label: 'Đang giao hàng', value: 'Đang giao hàng' },
    { label: 'Hoàn thành', value: 'Hoàn thành' },
    { label: 'Đã hủy', value: 'Đã hủy' }
];

    constructor(
        private orderService: OrderService,
        private messageService: MessageService,
        private fb: FormBuilder,
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
        this.orderService.updateOrderStatus(order.orderId, order.status).subscribe({
            next: () => {
                this.loadOrders();
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

    markAsPaid(order: OrderHistory): void {
        this.orderService.updateOrderStatus(order.orderId, 'Đã thanh toán').subscribe({
            next: () => {
                this.loadOrders();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: `Đơn hàng #${order.orderId} đã được xác nhận thanh toán.`
                });
            },
            error: (err) => {
                console.error('Update order status error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể xác nhận thanh toán.'
                });
            }
        });
    }

    isAwaitingPaymentConfirmation(status: string): boolean {
        return status?.trim() === 'Chờ xác nhận thanh toán';
    }

    isFinalStatus(status: string): boolean {
        const normalized = status?.trim().toLowerCase();
        return normalized === 'hoàn thành' || normalized === 'đã hủy' || normalized === 'đã nhận';
    }

    getFullImageUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    return `http://localhost:5128${url}`;
    }

    viewDetails(order: OrderHistory): void {
        this.selectedOrder = order;
        this.displayDetails = true;
    }

    hideDetails(): void {
        this.displayDetails = false;
        this.selectedOrder = null;
    }

    getSelectedOrderProductTotal(): number {
        if (!this.selectedOrder || !this.selectedOrder.items) {
            return 0;
        }
        return this.selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        if (!status) {
        return 'secondary';
    }
    const s = status.trim().toLowerCase();
        switch (s) {
        case 'chờ xác nhận thanh toán':
            return 'warn';
        case 'đã thanh toán':
            return 'success';
        case 'chờ xác nhận':
            return 'warn';
        case 'đang xử lý':
            return 'info';
        case 'đang giao hàng':
            return 'info';
        case 'hoàn thành':
        case 'đã nhận':
            return 'success';
        case 'đã hủy':
            return 'danger';
        default:
            return 'secondary';
        }
    }
    }
