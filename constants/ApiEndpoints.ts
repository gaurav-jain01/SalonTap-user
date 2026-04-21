import { Config } from './Config';

const BASE_URL = Config.BASE_URL;

export const ApiEndpoints = {
  auth: {
    sendOtp: `${BASE_URL}/auth/send-otp`,
    verifyOtp: `${BASE_URL}/auth/verify-otp`,
  },
  user: {
    profile: `${BASE_URL}/auth/profile`,
  },
  home: {
    home: `${BASE_URL}/home`,
    subCategories: (id: string) => `${BASE_URL}/home/sub-categories/${id}`,
    services: (id: string) => `${BASE_URL}/home/services/${id}`,
    servicesBySubCategory: (id: string, page: number = 1) => `${BASE_URL}/services?subCategoryId=${id}&page=${page}&limit=10`,
  },
  address: {
    create: `${BASE_URL}/address`,
    list: `${BASE_URL}/address`,
    update: `${BASE_URL}/address`,
    delete: `${BASE_URL}/address`,
  },
  bookings: {
    checkout: `${BASE_URL}/bookings`,
    myBookings: `${BASE_URL}/bookings`,
    cancel: (id: string) => `${BASE_URL}/bookings/cancel/${id}`,
    detail: (id: string) => `${BASE_URL}/bookings/${id}`,
    applyCoupon: `${BASE_URL}/bookings/apply-coupon`,
    availableCoupons: `${BASE_URL}/bookings/available-coupons`,
  },
  cart: {
    add: `${BASE_URL}/cart/add`,
    get: `${BASE_URL}/cart`,
    remove: (serviceId: string) => `${BASE_URL}/cart/remove/${serviceId}`,
    clear: `${BASE_URL}/cart/clear`,
  },
};
