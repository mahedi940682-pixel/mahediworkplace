import React, { useState } from 'react';
import { Client } from '../types';
import { 
  Plus, 
  Trash2, 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  Tag, 
  Check, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
}

export default function Clients({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
}: ClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Create Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Client['status']>('active');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onAddClient({
      name: name.trim(),
      company: company.trim() || 'Individual',
      phone: phone.trim(),
      email: email.trim(),
      status,
      notes: notes.trim(),
      nextFollowUp: nextFollowUp || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags,
    });

    // Reset Form
    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setStatus('active');
    setNotes('');
    setTagsInput('');
    setNextFollowUp('');
    setIsAdding(false);
  };

  const triggerCommunication = (clientName: string, channel: string, address: string) => {
    setAlertMsg(`Simulated ${channel} trigger for [${clientName}] - Output directed to offline queue (${address}).`);
    setTimeout(() => {
      setAlertMsg(null);
    }, 4500);
  };

  const filteredClients = clients
    .filter(c => {
      const matchText = (c.name + ' ' + c.company + ' ' + c.notes).toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    })
    .filter(c => !statusFilter || c.status === statusFilter);

  return (
    <div className="space-y-6" id="clients-root">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0 animate-pulse"></span>
            Clients Ledger & Core Accounts
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Maintain accounts, track operational SLA notes, call coordinates, and next review dates.
          </p>
        </div>

        <button
          id="btn-trigger-add-client"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Ledger Entry' : 'Add New Client Profile'}
        </button>
      </div>

      {/* Interactive simulation alert toast */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3 bg-orange-500 text-slate-950 rounded-2xl text-xs font-semibold shadow-md flex items-center gap-2 border border-orange-400"
            id="simulation-alert-toast"
          >
            <Check className="w-4 h-4 bg-slate-950 text-orange-400 rounded-full p-0.5" />
            <span>{alertMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creation panel (Dark card theme!) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800"
            id="add-client-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" />
              Register Brand Client
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-name">Client Name *</label>
                  <input
                    id="client-form-name"
                    type="text"
                    required
                    placeholder="e.g. John Doe..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-company">Company / Group</label>
                  <input
                    id="client-form-company"
                    type="text"
                    placeholder="e.g. Apex Logistics..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-status">Client Status</label>
                  <select
                    id="client-form-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="active">Active High Priority</option>
                    <option value="pending">Pending Documents</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-phone">Phone Coordinate</label>
                  <input
                    id="client-form-phone"
                    type="text"
                    placeholder="+1 (555) 019-9922"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-email">Email Coordinate</label>
                  <input
                    id="client-form-email"
                    type="email"
                    placeholder="logistics@group.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-review">Follow-Up Date</label>
                  <input
                    id="client-form-review"
                    type="date"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:bg-slate-900"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-tags">Classification Tags (comma-separated)</label>
                <input
                  id="client-form-tags"
                  type="text"
                  placeholder="retail, prime-SLA, priority"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="client-form-notes">Internal Interaction Notes & Requirements / SLA</label>
                <textarea
                  id="client-form-notes"
                  rows={3}
                  placeholder="Details regarding storage shelves, emergency instructions, pallets pricing metrics..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  id="btn-cancel-create-client"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-create-client"
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-655 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Save to Ledger
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and filters board */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            id="client-search-field"
            type="text"
            placeholder="Search accounts name, company, or note lines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 border-none rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'active', 'pending', 'inactive'].map((st) => (
            <button
              id={`btn-filter-client-${st}`}
              key={st}
              onClick={() => setStatusFilter(st === 'all' ? null : st)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold border transition ${
                (st === 'all' && statusFilter === null) || statusFilter === st
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-205 text-slate-550 hover:bg-slate-50'
              }`}
            >
              <span className="capitalize">{st}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clients profiles grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm leading-relaxed">
          <div className="max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No accounts found</h3>
            <p className="text-xs text-slate-400">
              Clear filters or quickly map a new client to access the warehouse interaction tracker.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="clients-grid">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                    client.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : client.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-550'
                  }`}>
                    {client.status} Account
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {client.id}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="font-bold text-slate-900 text-sm">{client.name}</h3>
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" /> {client.company}
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-50 h-20 overflow-y-auto">
                  {client.notes || 'No custom requirements notes recorded.'}
                </p>

                {/* Direct Communications simulation buttons */}
                <div className="space-y-1.5 border-t border-slate-50 pt-3.5">
                  {client.phone && (
                    <button
                      id={`btn-client-phone-${client.id}`}
                      onClick={() => triggerCommunication(client.name, 'Phone', client.phone)}
                      className="w-full text-left flex items-center justify-between text-xs text-slate-650 hover:text-slate-900 bg-slate-50/30 hover:bg-slate-50 p-1.5 rounded-lg transition"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-mono">{client.phone}</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-300" />
                    </button>
                  )}

                  {client.email && (
                    <button
                      id={`btn-client-email-${client.id}`}
                      onClick={() => triggerCommunication(client.name, 'Email', client.email)}
                      className="w-full text-left flex items-center justify-between text-xs text-slate-650 hover:text-slate-900 bg-slate-50/30 hover:bg-slate-50 p-1.5 rounded-lg transition"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="truncate max-w-[185px]">{client.email}</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-300" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono text-[10px]">{client.nextFollowUp}</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    id={`btn-cycle-client-status-${client.id}`}
                    onClick={() => {
                      const statuses: Client['status'][] = ['active', 'pending', 'inactive'];
                      const priorityIndex = statuses.indexOf(client.status);
                      const nextLevel = statuses[(priorityIndex + 1) % statuses.length];
                      onUpdateClient(client.id, { status: nextLevel });
                    }}
                    title="Change Account Status"
                    className="p-1 px-2.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded border border-slate-100 transition"
                  >
                    Action Status
                  </button>
                  <button
                    id={`btn-delete-client-${client.id}`}
                    onClick={() => {
                      if (confirm(`Remove ${client.name} permanently from the system database?`)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-slate-350 hover:text-rose-600 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tag representations inside profile block footer */}
              {client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {client.tags.map(t => (
                    <span key={t} className="text-[8px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
