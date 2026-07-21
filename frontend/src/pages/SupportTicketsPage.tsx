import React, { useState } from 'react';
import { useSupport } from '../hooks/useSupport';
import { LifeBuoy, Search, Filter, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function SupportTicketsPage() {
  const { tickets, replyToTicket, closeTicket } = useSupport();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    replyToTicket.mutate(
      { id: selectedTicket.id, message: replyText },
      { onSuccess: () => { setReplyText(''); setSelectedTicket(null); } }
    );
  };

  const handleClose = (id: string) => {
    if (confirm('Are you sure you want to close this ticket?')) {
      closeTicket.mutate(id);
      setSelectedTicket(null);
    }
  };

  const filtered = tickets.data?.filter((t: any) => 
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex h-[calc(100vh-120px)] overflow-hidden relative">
      
      {/* List Column */}
      <div className={`flex-1 flex flex-col space-y-4 ${selectedTicket ? 'hidden md:flex md:w-1/2 lg:w-2/3' : 'w-full'}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="text-blue-600 dark:text-blue-500" />
            Support Tickets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage user inquiries and support requests.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by subject or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
          {tickets.isLoading && <div className="text-center py-10 text-gray-500">Loading...</div>}
          
          {filtered.map((ticket: any) => (
            <div 
              key={ticket.id} 
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 bg-white dark:bg-gray-900 border rounded-2xl cursor-pointer transition-all ${
                selectedTicket?.id === ticket.id 
                  ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  ticket.status === 'OPEN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{ticket.message}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1"><MessageSquare size={14} /> {ticket.user?.name}</div>
                <div className="flex items-center gap-1"><Clock size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !tickets.isLoading && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              No tickets found.
            </div>
          )}
        </div>
      </div>

      {/* Detail Column */}
      {selectedTicket && (
        <div className="absolute inset-0 md:static md:w-1/2 lg:w-1/3 flex flex-col bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg md:shadow-none overflow-hidden z-10">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 dark:text-white truncate pr-4">Ticket Details</h2>
            <button onClick={() => setSelectedTicket(null)} className="text-gray-500 hover:text-gray-700 md:hidden">&times; Close</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subject</div>
              <div className="font-medium text-gray-900 dark:text-white text-lg">{selectedTicket.subject}</div>
            </div>
            
            <div className="flex gap-4 border-y border-gray-200 dark:border-gray-800 py-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">User</div>
                <div className="text-sm font-medium dark:text-gray-300">{selectedTicket.user?.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</div>
                <div className="text-sm font-medium dark:text-gray-300">{selectedTicket.user?.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                <div className="text-sm font-medium dark:text-gray-300">{selectedTicket.status}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Message</div>
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedTicket.message}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {selectedTicket.status !== 'CLOSED' ? (
              <form onSubmit={handleReply} className="space-y-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                  rows={3}
                  required
                />
                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => handleClose(selectedTicket.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <CheckCircle size={16}/> Mark Closed
                  </button>
                  <button type="submit" disabled={replyToTicket.isPending} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50">
                    {replyToTicket.isPending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl">
                This ticket is closed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
