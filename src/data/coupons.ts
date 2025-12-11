import { Coupon } from '../types';

export const availableCoupons: Coupon[] = [
  {
    id: 'WELCOME20',
    code: 'WELCOME20',
    description: '20% off on your first order',
    discount: 20,
    minOrder: 200,
    maxDiscount: 100,
    isActive: true
  },
  {
    id: 'SAVE15',
    code: 'SAVE15',
    description: '15% off on orders above ₹500',
    discount: 15,
    minOrder: 500,
    maxDiscount: 150,
    isActive: true
  },
  {
    id: 'FLAT50',
    code: 'FLAT50',
    description: 'Flat ₹50 off on orders above ₹300',
    discount: 50,
    minOrder: 300,
    isActive: true
  },
  {
    id: 'POINTS100',
    code: 'POINTS100',
    description: 'Redeem 100 points for ₹25 off',
    discount: 25,
    minOrder: 100,
    isActive: true
  }
];