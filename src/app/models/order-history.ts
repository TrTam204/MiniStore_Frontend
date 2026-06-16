export interface OrderHistory {
    orderId: number;
    orderDate: string;
    totalPrice: number;
    voucherCode?: string;
    shippingFee?: number;
    discountAmount?: number;
    finalAmount?: number;
    status: string;
    buyerName?: string;
    shippingName?: string;
    shippingPhone?: string;
    shippingAddress?: string;
    items: OrderHistoryItem[];
}
export interface OrderHistoryItem {
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
}