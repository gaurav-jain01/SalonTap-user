import { create } from "zustand";

export interface Address {
    main_text: string;
    secondary_text: string;
    description?: string;
    place_id: string;
    latitude: number;
    longitude: number;
    houseNumber?: string;
    landmark?: string;
    label?: string;
    isDefault?: boolean;
}

interface AddressState {
    selectedAddress: Address | null;
    addressList: Address[];

    setSelectedAddress: (address: Address) => void;
    setAddressList: (addresses: Address[]) => void;
    addAddress: (address: Address) => void;
    clearAddress: () => void;
}

export const useAddressStore = create<AddressState>((set) => ({
    selectedAddress: null,
    addressList: [],

    setSelectedAddress: (address) =>
        set({ selectedAddress: address }),

    setAddressList: (addresses) =>
        set({ addressList: addresses }),

    addAddress: (address) =>
        set((state) => ({
            addressList: [...state.addressList, address],
        })),

    clearAddress: () =>
        set({ selectedAddress: null, addressList: [] }),
}));