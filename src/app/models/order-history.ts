export interface OrderHistory {
    orderId: number;
    orderDate: string;
    totalPrice: number;
    status: string;
    items: OrderHistoryItem[];
}
export interface OrderHistoryItem {
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
}