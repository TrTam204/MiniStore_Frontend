export interface Voucher {
  id: number;
  code: string;
  description?: string;
  // 0 = Percentage, 1 = FixedAmount (matches backend enum)
  discountType: number;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number | null;
  startDate: string;
  endDate: string;
  quantity: number;
  usedCount: number;
  isActive: boolean;
  // Applicability: 0 = All products, 1 = ByCategory, 2 = ByProducts
  applicableType?: number;
  applicableCategoryId?: number | null;
  applicableProductIds?: number[] | null;
}
