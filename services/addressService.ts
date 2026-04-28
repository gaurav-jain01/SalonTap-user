import { ApiEndpoints } from "@/constants/ApiEndpoints";
import { apiClient } from "./apiClient";

export const addressService = {
  fetchAddresses: async () => {
    const response = await apiClient.get(ApiEndpoints.address.list);
    return response.data;
  },
};

