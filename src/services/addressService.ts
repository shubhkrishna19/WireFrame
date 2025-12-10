// User Address Service for Bluewud Furniture Platform
import apiClient from './api';

interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAddressData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  addressType?: string;
}

interface UpdateAddressData extends Partial<CreateAddressData> { }

export const addressService = {
  // Get user's addresses
  async getUserAddresses(): Promise<Address[]> {
    const response = await apiClient.get('/user/addresses');
    return response.data;
  },

  // Get user's default address
  async getDefaultAddress(): Promise<Address | null> {
    try {
      const response = await apiClient.get('/user/addresses/default');
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create a new address
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    const response = await apiClient.post('/user/addresses', addressData);
    return response.data;
  },

  // Update an address
  async updateAddress(addressId: string, addressData: UpdateAddressData): Promise<Address> {
    const response = await apiClient.put(`/user/addresses/${addressId}`, addressData);
    return response.data;
  },

  // Delete an address
  async deleteAddress(addressId: string): Promise<void> {
    await apiClient.delete(`/user/addresses/${addressId}`);
  },

  // Set an address as default
  async setDefaultAddress(addressId: string): Promise<Address> {
    const response = await apiClient.put(`/user/addresses/${addressId}/default`);
    return response.data;
  },

  // Verify if a pincode is serviceable
  async checkPincodeServiceable(pincode: string): Promise<{ serviceable: boolean; estimatedDays?: number; errorMessage?: string }> {
    try {
      const response = await apiClient.get(`/user/pincode/${pincode}/check`);
      return response.data;
    } catch (error) {
      return {
        serviceable: false,
        errorMessage: (error as any).response?.data?.message || 'Error checking pincode serviceability'
      };
    }
  },

  // Get all serviceable pincodes (admin only)
  async getServiceablePincodes(): Promise<Array<{ pincode: string; estimatedDays: number }>> {
    const response = await apiClient.get('/admin/pincodes');
    return response.data;
  },

  // Update serviceable pincodes (admin only)
  async updateServiceablePincodes(pincodes: Array<{ pincode: string; estimatedDays: number }>): Promise<void> {
    await apiClient.put('/admin/pincodes', { pincodes });
  },
};
