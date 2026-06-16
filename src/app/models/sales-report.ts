export interface SalesReportItem {
  orderId: number;
  orderDate: string;
  userId: number;
  fullName: string;
  email: string;
  productNames: string;
  categoryName: string;
  status?: string;
  totalQuantity: number;
  totalAmount: number;
}

export interface CategoryBreakdown {
  categoryName: string;
  totalQuantity: number;
  totalAmount: number;
}

export interface SalesReportSummary {
  totalOrders: number;
  totalProductsSold: number;
  totalRevenue: number;
  items: SalesReportItem[];
  categoryBreakdown: CategoryBreakdown[];
}