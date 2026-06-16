export interface CheckoutRequest {
    userId: number;
    items: CheckoutItem[];
    voucherCode?: string;
    paymentMethod: 'cod' | 'qr';
    shippingName?: string;
    shippingPhone?: string;
    shippingAddress?: string;
}
export interface CheckoutItem {
    productId: number;
    quantity: number;
}