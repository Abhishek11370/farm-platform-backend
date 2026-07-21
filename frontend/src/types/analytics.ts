// Analytics types matching backend response shapes

export interface DashboardStats {
  users: {
    total: number;
    farmers: number;
    buyers: number;
    admins: number;
  };
  products: number;
  categories: number;
  orders: number;
  revenue: number;
  auctions: number;
  payments: number;
  reviews: number;
  notifications: number;
  coupons: number;
}

export interface RevenueTimelinePoint {
  date: string;
  revenue: number;
}

export interface TopProduct {
  product: {
    id: string;
    name: string;
    price: number;
    owner?: { name: string };
    images?: { url: string }[];
  };
  totalQuantitySold: number;
}

export interface UserGrowthPoint {
  month: string;
  farmers: number;
  buyers: number;
}

export interface OrderStatusStat {
  status: string;
  count: number;
}

export interface AuctionStats {
  live: number;
  closed: number;
  cancelled: number;
  totalBids: number;
  totalBidVolume: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
