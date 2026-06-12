export interface SalesReportItem {
  orderId: number;
  orderDate: string;
  userId: number;
  fullName: string;
  email: string;
  productId: number;
  productName: string;
  categoryName: string;
  status?: string;
  quantity: number;
  price: number;
  totalAmount: number;
}

export interface SalesReportSummary {
  totalOrders: number;
  totalProductsSold: number;
  totalRevenue: number;
  items: SalesReportItem[];
}