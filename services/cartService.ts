import { ApiEndpoints } from "@/constants/ApiEndpoints";
import { apiClient } from "./apiClient";

export interface CartResponse {
  success: boolean;
  data: {
    _id: string;
    items: any[];
    totalRegularPrice: number;
    totalSalePrice: number;
    couponCode?: string;
    discountAmount?: number;
    total?: number;
  };
}

export const cartService = {
  addToCart: async (serviceId: string, quantity: number = 1): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(ApiEndpoints.cart.add, { serviceId, quantity });
    return response.data;
  },

  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get(ApiEndpoints.cart.get);
    return response.data;
  },
  
  removeFromCart: async (serviceId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(ApiEndpoints.cart.remove(serviceId));
    return response.data;
  },

  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(ApiEndpoints.cart.clear);
    return response.data;
  },
};
