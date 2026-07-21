import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Tractor, Package, Box, ShoppingCart, Gavel, 
  CreditCard, Truck, Star, MessageSquare, Bell, FileText, Activity, 
  Brain, FileEdit, Megaphone, MapPin, Settings, UserCircle, LogOut,
  ChevronDown, ChevronRight, X
} from 'lucide-react';

export interface SidebarItem {
  name: string;
  href?: string;
  icon?: React.ElementType;
  badge?: string;
  subItems?: { name: string; href: string; badge?: string }[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: 'Dashboard', icon: LayoutDashboard,
    subItems: [
      { name: 'Overview', href: '/admin' },
      { name: 'Analytics', href: '/admin/dashboard/analytics' },
      { name: 'Sales Dashboard', href: '/admin/dashboard/sales' },
      { name: 'Revenue Dashboard', href: '/admin/dashboard/revenue' },
      { name: 'Live Statistics', href: '/admin/dashboard/live' },
      { name: 'Recent Activities', href: '/admin/dashboard/activities' },
      { name: 'System Health', href: '/admin/dashboard/health' },
    ]
  },
  {
    name: 'User Management', icon: Users,
    subItems: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'Buyers', href: '/admin/users/buyers' },
      { name: 'Farmers', href: '/admin/users/farmers' },
      { name: 'Admins', href: '/admin/users/admins' },
      { name: 'User Roles', href: '/admin/users/roles' },
      { name: 'Permissions', href: '/admin/users/permissions' },
      { name: 'Blocked Users', href: '/admin/users/blocked' },
      { name: 'KYC Verification', href: '/admin/users/kyc', badge: '5' },
    ]
  },
  {
    name: 'Farmer Management', icon: Tractor,
    subItems: [
      { name: 'All Farmers', href: '/admin/farmers' },
      { name: 'Pending Verification', href: '/admin/farmers/pending', badge: '12' },
      { name: 'Approved Farmers', href: '/admin/farmers/approved' },
      { name: 'Rejected Farmers', href: '/admin/farmers/rejected' },
      { name: 'Farmer Profiles', href: '/admin/farmers/profiles' },
      { name: 'Farmer Products', href: '/admin/farmers/products' },
      { name: 'Farmer Earnings', href: '/admin/farmers/earnings' },
      { name: 'Farmer Performance', href: '/admin/farmers/performance' },
    ]
  },
  {
    name: 'Product Management', icon: Package,
    subItems: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/add' },
      { name: 'Categories', href: '/admin/categories' },
      { name: 'Sub Categories', href: '/admin/products/subcategories' },
      { name: 'Units', href: '/admin/products/units' },
      { name: 'Product Approval', href: '/admin/products/approval', badge: '8' },
      { name: 'Product Images', href: '/admin/products/images' },
      { name: 'Product Reviews', href: '/admin/products/reviews' },
      { name: 'Featured Products', href: '/admin/products/featured' },
    ]
  },
  {
    name: 'Inventory Management', icon: Box,
    subItems: [
      { name: 'Inventory List', href: '/admin/inventory' },
      { name: 'Stock Management', href: '/admin/inventory/stock' },
      { name: 'Low Stock Alerts', href: '/admin/inventory/alerts', badge: '3' },
      { name: 'Warehouse', href: '/admin/inventory/warehouse' },
      { name: 'Stock Transfer', href: '/admin/inventory/transfer' },
      { name: 'Stock History', href: '/admin/inventory/history' },
      { name: 'Damaged Products', href: '/admin/inventory/damaged' },
    ]
  },
  {
    name: 'Orders', icon: ShoppingCart,
    subItems: [
      { name: 'All Orders', href: '/admin/orders' },
      { name: 'Pending', href: '/admin/orders/pending', badge: '15' },
      { name: 'Confirmed', href: '/admin/orders/confirmed' },
      { name: 'Processing', href: '/admin/orders/processing' },
      { name: 'Packed', href: '/admin/orders/packed' },
      { name: 'Shipped', href: '/admin/orders/shipped' },
      { name: 'Delivered', href: '/admin/orders/delivered' },
      { name: 'Cancelled', href: '/admin/orders/cancelled' },
      { name: 'Returned', href: '/admin/orders/returned' },
      { name: 'Refund Requests', href: '/admin/orders/refunds', badge: '2' },
      { name: 'Order Timeline', href: '/admin/orders/timeline' },
    ]
  },
  {
    name: 'Auction Management', icon: Gavel,
    subItems: [
      { name: 'Live Auctions', href: '/admin/auctions/live', badge: '4' },
      { name: 'Upcoming Auctions', href: '/admin/auctions/upcoming' },
      { name: 'Closed Auctions', href: '/admin/auctions' },
      { name: 'Create Auction', href: '/admin/auctions/create' },
      { name: 'Bid History', href: '/admin/auctions/bids' },
      { name: 'Auction Winners', href: '/admin/auctions/winners' },
      { name: 'Auction Reports', href: '/admin/auctions/reports' },
    ]
  },
  {
    name: 'Payment Management', icon: CreditCard,
    subItems: [
      { name: 'Transactions', href: '/admin/payments' },
      { name: 'Payment History', href: '/admin/payments/history' },
      { name: 'Payment Methods', href: '/admin/payments/methods' },
      { name: 'Wallet', href: '/admin/payments/wallet' },
      { name: 'Refunds', href: '/admin/payments/refunds' },
      { name: 'Coupons', href: '/admin/payments/coupons' },
      { name: 'Settlements', href: '/admin/payments/settlements' },
      { name: 'Invoices', href: '/admin/payments/invoices' },
    ]
  },
  {
    name: 'Delivery Management', icon: Truck,
    subItems: [
      { name: 'Delivery Partners', href: '/admin/delivery/partners' },
      { name: 'Assign Delivery', href: '/admin/delivery/assign' },
      { name: 'Active Deliveries', href: '/admin/delivery' },
      { name: 'Delivered Orders', href: '/admin/delivery/delivered' },
      { name: 'Failed Deliveries', href: '/admin/delivery/failed' },
      { name: 'Delivery Tracking', href: '/admin/delivery/tracking' },
      { name: 'Delivery Reports', href: '/admin/delivery/reports' },
    ]
  },
  {
    name: 'Reviews & Ratings', icon: Star,
    subItems: [
      { name: 'Product Reviews', href: '/admin/reviews/products' },
      { name: 'Farmer Reviews', href: '/admin/reviews/farmers' },
      { name: 'Buyer Reviews', href: '/admin/reviews/buyers' },
      { name: 'Pending Reviews', href: '/admin/reviews', badge: '10' },
      { name: 'Reported Reviews', href: '/admin/reviews/reported' },
    ]
  },
  {
    name: 'Chat & Support', icon: MessageSquare,
    subItems: [
      { name: 'User Chats', href: '/admin/support/chats' },
      { name: 'Farmer Chats', href: '/admin/support/farmer-chats' },
      { name: 'Support Tickets', href: '/admin/support' },
      { name: 'Complaints', href: '/admin/support/complaints' },
      { name: 'FAQ Management', href: '/admin/support/faqs' },
    ]
  },
  {
    name: 'Notifications', icon: Bell,
    subItems: [
      { name: 'Send Notification', href: '/admin/notifications/send' },
      { name: 'Push Notifications', href: '/admin/notifications/push' },
      { name: 'Email Notifications', href: '/admin/notifications/email' },
      { name: 'SMS Notifications', href: '/admin/notifications/sms' },
      { name: 'Announcement Banner', href: '/admin/notifications/banner' },
      { name: 'Notification History', href: '/admin/notifications' },
    ]
  },
  {
    name: 'Reports', icon: FileText,
    subItems: [
      { name: 'Sales Report', href: '/admin/reports/sales' },
      { name: 'Revenue Report', href: '/admin/reports/revenue' },
      { name: 'Product Report', href: '/admin/reports/products' },
      { name: 'Farmer Report', href: '/admin/reports/farmers' },
      { name: 'Customer Report', href: '/admin/reports/customers' },
      { name: 'Inventory Report', href: '/admin/reports/inventory' },
      { name: 'Auction Report', href: '/admin/reports/auctions' },
      { name: 'Payment Report', href: '/admin/reports/payments' },
      { name: 'Delivery Report', href: '/admin/reports/delivery' },
      { name: 'Tax Report', href: '/admin/reports/tax' },
    ]
  },
  {
    name: 'Analytics', icon: Activity,
    subItems: [
      { name: 'Dashboard Analytics', href: '/admin/analytics' },
      { name: 'Revenue Analytics', href: '/admin/analytics/revenue' },
      { name: 'User Analytics', href: '/admin/analytics/users' },
      { name: 'Farmer Analytics', href: '/admin/analytics/farmers' },
      { name: 'Product Analytics', href: '/admin/analytics/products' },
      { name: 'Order Analytics', href: '/admin/analytics/orders' },
      { name: 'Auction Analytics', href: '/admin/analytics/auctions' },
      { name: 'Payment Analytics', href: '/admin/analytics/payments' },
      { name: 'AI Insights', href: '/admin/analytics/ai' },
    ]
  },
  {
    name: 'AI Center', icon: Brain,
    subItems: [
      { name: 'Crop Recommendation', href: '/admin/ai/crops' },
      { name: 'Price Prediction', href: '/admin/ai/price' },
      { name: 'Demand Forecast', href: '/admin/ai/demand' },
      { name: 'Sales Forecast', href: '/admin/ai/sales' },
      { name: 'AI Reports', href: '/admin/ai/reports' },
      { name: 'AI Assistant', href: '/admin/ai' },
    ]
  },
  {
    name: 'CMS', icon: FileEdit,
    subItems: [
      { name: 'Banner Management', href: '/admin/cms/banners' },
      { name: 'Homepage Content', href: '/admin/cms/home' },
      { name: 'Blogs', href: '/admin/cms/blogs' },
      { name: 'News', href: '/admin/cms/news' },
      { name: 'FAQ', href: '/admin/cms/faq' },
      { name: 'Terms & Conditions', href: '/admin/cms/terms' },
      { name: 'Privacy Policy', href: '/admin/cms/privacy' },
    ]
  },
  {
    name: 'Marketing', icon: Megaphone,
    subItems: [
      { name: 'Coupons', href: '/admin/marketing/coupons' },
      { name: 'Promo Codes', href: '/admin/marketing/promos' },
      { name: 'Campaigns', href: '/admin/marketing/campaigns' },
      { name: 'Offers', href: '/admin/marketing/offers' },
      { name: 'Referral Program', href: '/admin/marketing/referrals' },
    ]
  },
  {
    name: 'Location Management', icon: MapPin,
    subItems: [
      { name: 'States', href: '/admin/locations/states' },
      { name: 'Cities', href: '/admin/locations/cities' },
      { name: 'Villages', href: '/admin/locations/villages' },
      { name: 'Delivery Zones', href: '/admin/locations/zones' },
      { name: 'Service Areas', href: '/admin/locations/areas' },
    ]
  },
  {
    name: 'System Settings', icon: Settings,
    subItems: [
      { name: 'General Settings', href: '/admin/settings' },
      { name: 'Company Details', href: '/admin/settings/company' },
      { name: 'Email Settings', href: '/admin/settings/email' },
      { name: 'SMS Settings', href: '/admin/settings/sms' },
      { name: 'Payment Gateway', href: '/admin/settings/payment' },
      { name: 'Shipping Settings', href: '/admin/settings/shipping' },
      { name: 'Tax Settings', href: '/admin/settings/tax' },
      { name: 'Notification Settings', href: '/admin/settings/notifications' },
      { name: 'Backup & Restore', href: '/admin/settings/backup' },
      { name: 'Logs', href: '/admin/settings/logs' },
      { name: 'API Keys', href: '/admin/settings/keys' },
      { name: 'Security Settings', href: '/admin/settings/security' },
    ]
  },
  {
    name: 'Profile', icon: UserCircle,
    subItems: [
      { name: 'My Profile', href: '/admin/profile' },
      { name: 'Change Password', href: '/admin/profile/password' },
      { name: 'Two Factor Auth', href: '/admin/profile/2fa' },
      { name: 'Login History', href: '/admin/profile/login-history' },
      { name: 'Activity Logs', href: '/admin/profile/activity' },
    ]
  },
];

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  user: any;
  logout: () => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user, logout }: AdminSidebarProps) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isCurrentSection = (items: { href: string }[]) => {
    return items.some(item => location.pathname === item.href || location.pathname.startsWith(`${item.href}/`));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: sidebarOpen ? '16rem' : '0rem',
        opacity: sidebarOpen ? 1 : 0
      }}
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl transition-all overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'}`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20">F</div>
          <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white whitespace-nowrap">FarmPlatform</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {SIDEBAR_ITEMS.map((section) => {
          // Open if manually toggled, or if it contains the current active route
          const isOpen = openSections[section.name] !== undefined 
            ? openSections[section.name] 
            : isCurrentSection(section.subItems || []);
            
          const Icon = section.icon;

          return (
            <div key={section.name} className="mb-1">
              <button
                onClick={() => toggleSection(section.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isOpen 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon size={18} className={isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />}
                  <span className="whitespace-nowrap">{section.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {section.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold">
                      {section.badge}
                    </span>
                  )}
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && section.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-11 pr-2 py-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-5 my-1">
                      {section.subItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                              isActive
                                ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            <span className="whitespace-nowrap">{item.name}</span>
                            {item.badge && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="mt-8 mb-2 border-t border-gray-100 dark:border-gray-800 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300 shrink-0">
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-gray-500 truncate capitalize">{user?.role?.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
