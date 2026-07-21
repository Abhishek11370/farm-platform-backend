import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";

// User pages
import UsersPage from "./pages/UsersPage";
import { BuyersPage, FarmersListPage, AdminsPage } from "./pages/FilteredUsersPage";

// Farmer pages
import FarmerVerificationPage from "./pages/FarmerVerificationPage";
import { PendingFarmersPage, ApprovedFarmersPage, RejectedFarmersPage } from "./pages/FilteredFarmersPage";

// Product & Category pages
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";

// Inventory
import InventoryPage from "./pages/InventoryPage";

// Orders
import OrdersPage from "./pages/OrdersPage";
import {
  PendingOrdersPage,
  ConfirmedOrdersPage,
  ProcessingOrdersPage,
  PackedOrdersPage,
  ShippedOrdersPage,
  DeliveredOrdersPage,
  CancelledOrdersPage,
  ReturnedOrdersPage,
} from "./pages/FilteredOrdersPage";

// Auctions
import AuctionsPage from "./pages/AuctionsPage";
import { LiveAuctionsPage, UpcomingAuctionsPage, ClosedAuctionsPage } from "./pages/FilteredAuctionsPage";

// Other modules
import PaymentsPage from "./pages/PaymentsPage";
import CouponsPage from "./pages/CouponsPage";
import ReviewsPage from "./pages/ReviewsPage";
import NotificationsPage from "./pages/NotificationsPage";
import DeliveryPage from "./pages/DeliveryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import SettingsPage from "./pages/SettingsPage";
import CMSDashboard from "./pages/CMSDashboard";
import ReportsDashboard from "./pages/ReportsDashboard";
import AIDashboard from "./pages/AIDashboard";
import SupportTicketsPage from "./pages/SupportTicketsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminChatsPage from "./pages/AdminChatsPage";

// Role dashboards
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";

// Auth
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Layout & shared
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
// Removed PlaceholderPage import

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes wrapped in DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>

                {/* Dashboard */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/dashboard/sales" element={<ReportsDashboard />} />
                <Route path="/admin/dashboard/revenue" element={<ReportsDashboard />} />
                <Route path="/admin/dashboard/live" element={<AdminDashboard />} />
                <Route path="/admin/dashboard/activities" element={<ActivityLogsPage />} />
                <Route path="/admin/dashboard/health" element={<AdminDashboard />} />

                {/* User Management */}
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/users/buyers" element={<BuyersPage />} />
                <Route path="/admin/users/farmers" element={<FarmersListPage />} />
                <Route path="/admin/users/admins" element={<AdminsPage />} />
                <Route path="/admin/users/roles" element={<UsersPage />} />
                <Route path="/admin/users/permissions" element={<UsersPage />} />
                <Route path="/admin/users/blocked" element={<UsersPage />} />
                <Route path="/admin/users/kyc" element={<FarmerVerificationPage />} />

                {/* Farmer Management */}
                <Route path="/admin/farmers" element={<FarmerVerificationPage />} />
                <Route path="/admin/farmers/pending" element={<PendingFarmersPage />} />
                <Route path="/admin/farmers/approved" element={<ApprovedFarmersPage />} />
                <Route path="/admin/farmers/rejected" element={<RejectedFarmersPage />} />
                <Route path="/admin/farmers/profiles" element={<FarmersListPage />} />
                <Route path="/admin/farmers/products" element={<ProductsPage />} />
                <Route path="/admin/farmers/earnings" element={<PaymentsPage />} />
                <Route path="/admin/farmers/performance" element={<AnalyticsPage />} />

                {/* Product Management */}
                <Route path="/admin/products" element={<ProductsPage />} />
                <Route path="/admin/products/add" element={<ProductsPage />} />
                <Route path="/admin/categories" element={<CategoriesPage />} />
                <Route path="/admin/products/subcategories" element={<CategoriesPage />} />
                <Route path="/admin/products/units" element={<ProductsPage />} />
                <Route path="/admin/products/approval" element={<ProductsPage />} />
                <Route path="/admin/products/images" element={<ProductsPage />} />
                <Route path="/admin/products/reviews" element={<ReviewsPage />} />
                <Route path="/admin/products/featured" element={<ProductsPage />} />

                {/* Inventory Management */}
                <Route path="/admin/inventory" element={<InventoryPage />} />
                <Route path="/admin/inventory/stock" element={<InventoryPage />} />
                <Route path="/admin/inventory/alerts" element={<InventoryPage />} />
                <Route path="/admin/inventory/warehouse" element={<InventoryPage />} />
                <Route path="/admin/inventory/transfer" element={<InventoryPage />} />
                <Route path="/admin/inventory/history" element={<InventoryPage />} />
                <Route path="/admin/inventory/damaged" element={<InventoryPage />} />

                {/* Orders */}
                <Route path="/admin/orders" element={<OrdersPage />} />
                <Route path="/admin/orders/pending" element={<PendingOrdersPage />} />
                <Route path="/admin/orders/confirmed" element={<ConfirmedOrdersPage />} />
                <Route path="/admin/orders/processing" element={<ProcessingOrdersPage />} />
                <Route path="/admin/orders/packed" element={<PackedOrdersPage />} />
                <Route path="/admin/orders/shipped" element={<ShippedOrdersPage />} />
                <Route path="/admin/orders/delivered" element={<DeliveredOrdersPage />} />
                <Route path="/admin/orders/cancelled" element={<CancelledOrdersPage />} />
                <Route path="/admin/orders/returned" element={<ReturnedOrdersPage />} />
                <Route path="/admin/orders/refunds" element={<OrdersPage />} />
                <Route path="/admin/orders/timeline" element={<OrdersPage />} />

                {/* Auction Management */}
                <Route path="/admin/auctions" element={<AuctionsPage />} />
                <Route path="/admin/auctions/live" element={<LiveAuctionsPage />} />
                <Route path="/admin/auctions/upcoming" element={<UpcomingAuctionsPage />} />
                <Route path="/admin/auctions/create" element={<AuctionsPage />} />
                <Route path="/admin/auctions/bids" element={<AuctionsPage />} />
                <Route path="/admin/auctions/winners" element={<ClosedAuctionsPage />} />
                <Route path="/admin/auctions/reports" element={<ReportsDashboard />} />

                {/* Payment Management */}
                <Route path="/admin/payments" element={<PaymentsPage />} />
                <Route path="/admin/payments/history" element={<PaymentsPage />} />
                <Route path="/admin/payments/methods" element={<PaymentsPage />} />
                <Route path="/admin/payments/wallet" element={<PaymentsPage />} />
                <Route path="/admin/payments/refunds" element={<PaymentsPage />} />
                <Route path="/admin/payments/coupons" element={<CouponsPage />} />
                <Route path="/admin/payments/settlements" element={<PaymentsPage />} />
                <Route path="/admin/payments/invoices" element={<PaymentsPage />} />

                {/* Delivery Management */}
                <Route path="/admin/delivery" element={<DeliveryPage />} />
                <Route path="/admin/delivery/partners" element={<DeliveryPage />} />
                <Route path="/admin/delivery/assign" element={<DeliveryPage />} />
                <Route path="/admin/delivery/delivered" element={<DeliveryPage />} />
                <Route path="/admin/delivery/failed" element={<DeliveryPage />} />
                <Route path="/admin/delivery/tracking" element={<DeliveryPage />} />
                <Route path="/admin/delivery/reports" element={<ReportsDashboard />} />

                {/* Reviews & Ratings */}
                <Route path="/admin/reviews" element={<ReviewsPage />} />
                <Route path="/admin/reviews/products" element={<ReviewsPage />} />
                <Route path="/admin/reviews/farmers" element={<ReviewsPage />} />
                <Route path="/admin/reviews/buyers" element={<ReviewsPage />} />
                <Route path="/admin/reviews/reported" element={<ReviewsPage />} />

                {/* Chat & Support */}
                <Route path="/admin/support" element={<SupportTicketsPage />} />
                <Route path="/admin/support/chats" element={<AdminChatsPage />} />
                <Route path="/admin/support/farmer-chats" element={<AdminChatsPage />} />

                <Route path="/admin/support/complaints" element={<SupportTicketsPage />} />
                <Route path="/admin/support/faqs" element={<CMSDashboard />} />

                {/* Notifications */}
                <Route path="/admin/notifications" element={<NotificationsPage />} />
                <Route path="/admin/notifications/send" element={<NotificationsPage />} />
                <Route path="/admin/notifications/push" element={<NotificationsPage />} />
                <Route path="/admin/notifications/email" element={<NotificationsPage />} />
                <Route path="/admin/notifications/sms" element={<NotificationsPage />} />
                <Route path="/admin/notifications/banner" element={<NotificationsPage />} />

                {/* Reports */}
                <Route path="/admin/reports" element={<ReportsDashboard />} />
                <Route path="/admin/reports/sales" element={<ReportsDashboard />} />
                <Route path="/admin/reports/revenue" element={<ReportsDashboard />} />
                <Route path="/admin/reports/products" element={<ReportsDashboard />} />
                <Route path="/admin/reports/farmers" element={<ReportsDashboard />} />
                <Route path="/admin/reports/customers" element={<ReportsDashboard />} />
                <Route path="/admin/reports/inventory" element={<ReportsDashboard />} />
                <Route path="/admin/reports/auctions" element={<ReportsDashboard />} />
                <Route path="/admin/reports/payments" element={<ReportsDashboard />} />
                <Route path="/admin/reports/delivery" element={<ReportsDashboard />} />
                <Route path="/admin/reports/tax" element={<ReportsDashboard />} />

                {/* Analytics */}
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/revenue" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/users" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/farmers" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/products" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/orders" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/auctions" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/payments" element={<AnalyticsPage />} />
                <Route path="/admin/analytics/ai" element={<AIDashboard />} />

                {/* AI Center */}
                <Route path="/admin/ai" element={<AIDashboard />} />
                <Route path="/admin/ai/crops" element={<AIDashboard />} />
                <Route path="/admin/ai/price" element={<AIDashboard />} />
                <Route path="/admin/ai/demand" element={<AIDashboard />} />
                <Route path="/admin/ai/sales" element={<AIDashboard />} />
                <Route path="/admin/ai/reports" element={<AIDashboard />} />

                {/* CMS */}
                <Route path="/admin/cms" element={<CMSDashboard />} />
                <Route path="/admin/cms/banners" element={<CMSDashboard />} />
                <Route path="/admin/cms/home" element={<CMSDashboard />} />
                <Route path="/admin/cms/blogs" element={<CMSDashboard />} />
                <Route path="/admin/cms/news" element={<CMSDashboard />} />
                <Route path="/admin/cms/faq" element={<CMSDashboard />} />
                <Route path="/admin/cms/terms" element={<CMSDashboard />} />
                <Route path="/admin/cms/privacy" element={<CMSDashboard />} />

                {/* Marketing */}
                <Route path="/admin/marketing" element={<CouponsPage />} />
                <Route path="/admin/marketing/coupons" element={<CouponsPage />} />
                <Route path="/admin/marketing/promos" element={<CouponsPage />} />
                <Route path="/admin/marketing/campaigns" element={<CouponsPage />} />
                <Route path="/admin/marketing/offers" element={<CouponsPage />} />
                <Route path="/admin/marketing/referrals" element={<CouponsPage />} />

                {/* Location Management */}
                <Route path="/admin/locations/states" element={<SettingsPage />} />
                <Route path="/admin/locations/cities" element={<SettingsPage />} />
                <Route path="/admin/locations/villages" element={<SettingsPage />} />
                <Route path="/admin/locations/zones" element={<SettingsPage />} />
                <Route path="/admin/locations/areas" element={<SettingsPage />} />

                {/* System Settings */}
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/settings/company" element={<SettingsPage />} />
                <Route path="/admin/settings/email" element={<SettingsPage />} />
                <Route path="/admin/settings/sms" element={<SettingsPage />} />
                <Route path="/admin/settings/payment" element={<SettingsPage />} />
                <Route path="/admin/settings/shipping" element={<SettingsPage />} />
                <Route path="/admin/settings/tax" element={<SettingsPage />} />
                <Route path="/admin/settings/notifications" element={<SettingsPage />} />
                <Route path="/admin/settings/backup" element={<SettingsPage />} />
                <Route path="/admin/settings/logs" element={<ActivityLogsPage />} />
                <Route path="/admin/settings/keys" element={<SettingsPage />} />
                <Route path="/admin/settings/security" element={<SettingsPage />} />

                {/* Profile */}
                <Route path="/admin/profile" element={<ProfilePage />} />
                <Route path="/admin/profile/password" element={<ProfilePage />} />
                <Route path="/admin/profile/2fa" element={<ProfilePage />} />
                <Route path="/admin/profile/login-history" element={<ActivityLogsPage />} />
                <Route path="/admin/profile/activity" element={<ActivityLogsPage />} />

                {/* Catch-all for any unregistered /admin/* paths */}
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
                <Route path="/farmer" element={<FarmerDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
                <Route path="/buyer" element={<BuyerDashboard />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
