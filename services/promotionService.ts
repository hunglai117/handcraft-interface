import { get } from './api';

const PREFIX_PATH = '/promotions';

export enum PromotionType {
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FIXED_AMOUNT_DISCOUNT = 'FIXED_AMOUNT_DISCOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  promoCode: string;
  startDate: string;
  endDate: string;
  type: PromotionType;
  discountValue: number;
  minimumOrderAmount: number;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValidatePromoCodeResponse {
  valid: boolean;
  promotion?: Promotion;
  message?: string;
  id: string;
  name: string;
  description: string;
  promoCode: string;
  startDate: string;
  endDate: string;
  type: PromotionType;
  discountValue: number;
  minimumOrderAmount: number;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const promotionService = {
  // Get all active promotions
  getActivePromotions: () => get<Promotion[]>(`${PREFIX_PATH}/active`),

  // Validate a promotion code
  validateCode: (code: string) => get<ValidatePromoCodeResponse>(`${PREFIX_PATH}/validate/${code}`),
};

export default promotionService;
