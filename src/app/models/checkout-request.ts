export interface CheckoutRequest {
    userId: number;
    items: CheckoutItem[];
}
export interface CheckoutItem {
    productId: number;
    quantity: number;
}