import api from './axios';

export interface CreateAuctionPayload {
  productId: string;
  startPrice: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAuctionPayload {
  startPrice?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export const auctionsApi = {
  getAuctions: async (params?: any): Promise<any[]> => {
    const res = await api.get('/auction', { params });
    // Handle both plain array and envelope { data: [], meta: {} }
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.auctions)) return raw.auctions;
    return [];
  },
  getAuction: async (id: string): Promise<any> => {
    const res = await api.get(`/auction/${id}`);
    return res.data;
  },
  createAuction: async (data: CreateAuctionPayload): Promise<any> => {
    const res = await api.post('/auction', data);
    return res.data;
  },
  updateAuction: async (id: string, data: UpdateAuctionPayload): Promise<any> => {
    const res = await api.patch(`/auction/${id}`, data);
    return res.data;
  },
  placeBid: async (auctionId: string, amount: number): Promise<any> => {
    const res = await api.post(`/auction/${auctionId}/bid`, { amount });
    return res.data;
  },
  getAuctionBids: async (auctionId: string): Promise<any[]> => {
    const res = await api.get(`/auction/${auctionId}/bids`);
    if (Array.isArray(res.data)) return res.data;
    return res.data?.data ?? [];
  },
};

