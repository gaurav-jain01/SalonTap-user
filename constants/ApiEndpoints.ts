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
  },
  address: {
    create: `${BASE_URL}/address`,
    list: `${BASE_URL}/address`,
    update: `${BASE_URL}/address`,
    delete: `${BASE_URL}/address`,
  },
  // Add more endpoints as needed
};
