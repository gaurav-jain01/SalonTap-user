import { ApiEndpoints } from "@/constants/ApiEndpoints";
import { apiClient } from "./apiClient";

export interface CheckoutRequest {
  addressId: string;
  bookingDate: string;
  startTime: string;
  notes?: string;
  paymentMethod?: "COD" | "ONLINE";
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface CouponResponse {
  success: boolean;
  data: {
    _id: string;
    code: string;
    discountType: "PERCENTAGE" | "PERCENT" | "FLAT" | "FIXED";
    discountAmount?: number;
    discountValue?: number;
    minOrderAmount: number;
    isApplicable?: boolean;
    potentialDiscount?: number;
    message?: string;
  } | any[];
}

export const bookingService = {
  checkout: async (data: CheckoutRequest): Promise<BookingResponse> => {
    const response = await apiClient.post(ApiEndpoints.bookings.checkout, data);
    return response.data;
  },

  getMyBookings: async (): Promise<BookingResponse> => {
    const response = await apiClient.get(ApiEndpoints.bookings.myBookings);
    return response.data;
  },

  getBookingById: async (id: string): Promise<BookingResponse> => {
    const response = await apiClient.get(ApiEndpoints.bookings.detail(id));
    return response.data;
  },

  cancelBooking: async (id: string, reason: string): Promise<BookingResponse> => {
    const response = await apiClient.patch(ApiEndpoints.bookings.cancel(id), { reason });
    return response.data;
  },

  applyCoupon: async (couponCode: string): Promise<CouponResponse> => {
    const response = await apiClient.post(ApiEndpoints.bookings.applyCoupon, { couponCode });
    return response.data;
  },

  getAvailableCoupons: async (cartTotal?: number): Promise<CouponResponse> => {
    const response = await apiClient.get(
      cartTotal !== undefined 
        ? `${ApiEndpoints.bookings.availableCoupons}?cartTotal=${cartTotal}`
        : ApiEndpoints.bookings.availableCoupons
    );
    return response.data;
  },
};
