import { ProductStatus } from "./product-status";

export const allowedTransitions: Record<ProductStatus, ProductStatus[]> = {
  DRAFT: [ProductStatus.PENDING],

  PENDING: [
    ProductStatus.APPROVED,
    ProductStatus.REJECTED
  ],

  REJECTED: [ProductStatus.DRAFT],

  APPROVED: [
    ProductStatus.ARCHIVED,
    ProductStatus.DRAFT
  ],

  ARCHIVED: [ProductStatus.DRAFT],
};

export function canTransition(
  current: ProductStatus,
  next: ProductStatus
) {
  return allowedTransitions[current]?.includes(next);
}