import React, { useState } from 'react';
import { useCms } from '../hooks/useCms';
import { useSettings } from '../hooks/useSettings';
import { FileText, Image, MessageCircle, Shield, FileSignature, Plus, Search, Trash2, Edit } from 'lucide-react';

export default function CMSDashboard() {
  const { blogs, banners, faqs, deleteBlog, deleteBanner, deleteFAQ } = useCms();
  const { settings, bulkUpsert } = useSettings();
  const [activeTab, setActiveTab] = useState<'blogs'|'banners'|'faqs'|'terms'|'privacy'>('blogs');
  const [searchTerm, setSearchTerm] = useState('');

  const termsSetting = settings.data?.find((s: any) => s.key === 'TERMS_CONDITIONS')?.value || '';
  const privacySetting = settings.data?.find((s: any) => s.key === 'PRIVACY_POLICY')?.value || '';
  
  const [termsText, setTermsText] = useState(termsSetting);
  const [privacyText, setPrivacyText] = useState(privacySetting);

  const tabs = [
    { id: 'blogs', name: 'Blogs', icon: FileText },
    { id: 'banners', name: 'Banners', icon: Image },
    { id: 'faqs', name: 'FAQs', icon: MessageCircle },
    { id: 'terms', name: 'Terms & Conditions', icon: FileSignature },
    { id: 'privacy', name: 'Privacy Policy', icon: Shield },
  ] as const;

  const handleSaveTerms = () => {
    bulkUpsert.mutate([{ key: 'TERMS_CONDITIONS', value: termsText }]);
  };

  const handleSavePrivacy = () => {
    bulkUpsert.mutate([{ key: 'PRIVACY_POLICY', value: privacyText }]);
  };

  const renderTable = (items: any[], type: 'blog' | 'banner' | 'faq') => {
    const filtered = items?.filter(item => 
      (item.title || item.question)?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">{type === 'faq' ? 'Question' : 'Title'}</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.title || item.question}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 transition-colors"><Edit size={16}/></button>
                    <button 
                      onClick={() => {
                        if(confirm('Are you sure you want to delete this?')) {
                          if (type === 'blog') deleteBlog.mutate(item.id);
                          if (type === 'banner') deleteBanner.mutate(item.id);
                          if (type === 'faq') deleteFAQ.mutate(item.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management (CMS)</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage website content, banners, and policies.</p>
        </div>
        {['blogs', 'banners', 'faqs'].includes(activeTab) && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <Plus size={18} />
            Add New
          </button>
        )}
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {tab.name}
            </button>
          )
        })}
      </div>

      {['blogs', 'banners', 'faqs'].includes(activeTab) && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      )}

      {activeTab === 'blogs' && renderTable(blogs.data || [], 'blog')}
      {activeTab === 'banners' && renderTable(banners.data || [], 'banner')}
      {activeTab === 'faqs' && renderTable(faqs.data || [], 'faq')}

      {activeTab === 'terms' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Terms & Conditions</h2>
          <textarea 
            rows={12} 
            value={termsText}
            onChange={e => setTermsText(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
            placeholder="Enter terms and conditions text..."
          />
          <div className="mt-4 flex justify-end">
            <button onClick={handleSaveTerms} disabled={bulkUpsert.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
              {bulkUpsert.isPending ? 'Saving...' : 'Save Terms'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
          <textarea 
            rows={12} 
            value={privacyText}
            onChange={e => setPrivacyText(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
            placeholder="Enter privacy policy text..."
          />
          <div className="mt-4 flex justify-end">
            <button onClick={handleSavePrivacy} disabled={bulkUpsert.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
              {bulkUpsert.isPending ? 'Saving...' : 'Save Policy'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
