import React, { useState } from 'react';
import { useFarmerVerification } from '../hooks/useFarmerVerification';
import { ShieldCheck, Search, CheckCircle2, XCircle, Clock, Tractor } from 'lucide-react';
import { format } from 'date-fns';

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface FilteredFarmersPageProps {
  status?: VerificationStatus;
  title: string;
  description: string;
}

function FilteredFarmersPage({ status, title, description }: FilteredFarmersPageProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { verifications, reviewVerification } = useFarmerVerification(page, 20, status);

  const list = (verifications.data?.data || []).filter((v: any) =>
    v.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReview = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    let rejectionReason;
    if (newStatus === 'REJECTED') {
      rejectionReason = window.prompt('Please provide a reason for rejection:');
      if (rejectionReason === null) return;
    } else {
      if (!window.confirm("Approve this farmer's verification?")) return;
    }
    try {
      await reviewVerification.mutateAsync({ id, data: { status: newStatus, rejectionReason } });
    } catch (e) {
      console.error('Failed to review:', e);
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const Icon = status === 'APPROVED' ? CheckCircle2 : status === 'REJECTED' ? XCircle : status === 'PENDING' ? Clock : Tractor;
  const iconColor = status === 'APPROVED' ? 'text-green-600' : status === 'REJECTED' ? 'text-red-600' : status === 'PENDING' ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon className={iconColor} size={24} />
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <span className="self-center text-sm text-gray-500">{list.length} records</span>
        </div>

        {verifications.isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <Tractor size={32} className="opacity-30" />
            <p>No farmers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Farmer</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Documents</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Submitted</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((v: any) => (
                  <tr key={v.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
                          {v.farmer?.name?.charAt(0) || 'F'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{v.farmer?.name || '—'}</p>
                          <p className="text-xs text-gray-500">{v.farmer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{v.documents?.length || 0} files</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(v.status)}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {v.createdAt ? format(new Date(v.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {v.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleReview(v.id, 'APPROVED')} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 transition-colors">Approve</button>
                          <button onClick={() => handleReview(v.id, 'REJECTED')} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 transition-colors">Reject</button>
                        </div>
                      )}
                      {v.status !== 'PENDING' && <span className="text-xs text-gray-400">Reviewed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function PendingFarmersPage() {
  return <FilteredFarmersPage status="PENDING" title="Pending Verification" description="Farmers awaiting KYC approval." />;
}

export function ApprovedFarmersPage() {
  return <FilteredFarmersPage status="APPROVED" title="Approved Farmers" description="Farmers who have been verified and approved." />;
}

export function RejectedFarmersPage() {
  return <FilteredFarmersPage status="REJECTED" title="Rejected Farmers" description="Farmers whose applications were rejected." />;
}

export default FilteredFarmersPage;
