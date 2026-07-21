import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, ArrowLeft, Home } from 'lucide-react';

const PAGE_DESCRIPTIONS: Record<string, { title: string; description: string; eta: string }> = {
  'warehouse': { title: 'Warehouse Management', description: 'Manage warehouse locations, bins, and storage zones.', eta: 'Q3 2026' },
  'transfer': { title: 'Stock Transfer', description: 'Transfer stock between warehouses and fulfillment centers.', eta: 'Q3 2026' },
  'damaged': { title: 'Damaged Products', description: 'Track and report damaged or expired inventory.', eta: 'Q3 2026' },
  'roles': { title: 'User Roles', description: 'Configure and assign custom roles to users.', eta: 'Q2 2026' },
  'permissions': { title: 'Permissions', description: 'Granular permission control for each admin action.', eta: 'Q2 2026' },
  'blocked': { title: 'Blocked Users', description: 'Review and manage suspended or banned accounts.', eta: 'Q2 2026' },
  'methods': { title: 'Payment Methods', description: 'Manage accepted payment gateways and providers.', eta: 'Q3 2026' },
  'wallet': { title: 'Wallet', description: 'Farmer and buyer wallet management with topup and withdrawal.', eta: 'Q3 2026' },
  'invoices': { title: 'Invoices', description: 'Auto-generated invoices for all completed transactions.', eta: 'Q3 2026' },
  'chats': { title: 'Live Chats', description: 'Real-time chat interface with buyers and farmers.', eta: 'Q3 2026' },
  'farmer-chats': { title: 'Farmer Chats', description: 'Dedicated channel for farmer support conversations.', eta: 'Q3 2026' },
  'banner': { title: 'Announcement Banner', description: 'Publish site-wide banners for promotions and alerts.', eta: 'Q2 2026' },
  'campaigns': { title: 'Campaigns', description: 'Plan and run marketing campaigns with targeting.', eta: 'Q4 2026' },
  'offers': { title: 'Offers', description: 'Create time-limited offers and product discounts.', eta: 'Q3 2026' },
  'referrals': { title: 'Referral Program', description: 'Incentivized referral tracking and reward distribution.', eta: 'Q4 2026' },
  'states': { title: 'States', description: 'Manage Indian states for delivery zone configuration.', eta: 'Q2 2026' },
  'cities': { title: 'Cities', description: 'City-level configuration for delivery and service areas.', eta: 'Q2 2026' },
  'villages': { title: 'Villages', description: 'Village and pincode-level delivery reach configuration.', eta: 'Q2 2026' },
  'zones': { title: 'Delivery Zones', description: 'Group delivery areas into custom zones for logistics.', eta: 'Q2 2026' },
  'areas': { title: 'Service Areas', description: 'Define service area boundaries and coverage maps.', eta: 'Q2 2026' },
  'backup': { title: 'Backup & Restore', description: 'Scheduled database backups and disaster recovery.', eta: 'Q3 2026' },
  'keys': { title: 'API Keys', description: 'Generate and manage API keys for third-party integrations.', eta: 'Q3 2026' },
  'security': { title: 'Security Settings', description: '2FA enforcement, IP whitelist, and session controls.', eta: 'Q3 2026' },
  '2fa': { title: 'Two Factor Auth', description: 'Set up authenticator app or SMS-based 2FA for your account.', eta: 'Q2 2026' },
  'terms': { title: 'Terms & Conditions', description: 'Edit and publish the platform\'s terms of service.', eta: 'Q2 2026' },
  'privacy': { title: 'Privacy Policy', description: 'Manage and update the privacy policy document.', eta: 'Q2 2026' },
  'health': { title: 'System Health', description: 'Real-time server health metrics, uptime and alerts.', eta: 'Q3 2026' },
};

export default function PlaceholderPage() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'page';
  const info = PAGE_DESCRIPTIONS[lastSegment];

  const title = info?.title || lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const description = info?.description || 'This module is part of the roadmap and will be available soon.';
  const eta = info?.eta;

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
      >
        <Wrench size={40} className="text-gray-400 dark:text-gray-500" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          Under Construction
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-base leading-relaxed mb-2">
          {description}
        </p>

        {eta && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
            Estimated availability: <span className="font-semibold text-gray-600 dark:text-gray-300">{eta}</span>
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-green-600 hover:bg-green-700 text-white transition-colors shadow-sm shadow-green-500/20"
          >
            <Home size={16} />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
