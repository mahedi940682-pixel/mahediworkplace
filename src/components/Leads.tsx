import React, { useState } from 'react';
import { Lead } from '../types';
import { 
  Plus, 
  Trash2, 
  Search, 
  ClipboardList, 
  TrendingUp, 
  CheckCircle, 
  Calendar, 
  AlertCircle,
  Tag,
  Kanban,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeadsProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
}

const STAGE_CONFIG: Record<Lead['stage'], { label: string, color: string, bg: string }> = {
  new: { label: 'New Opportunity', color: 'text-blue-700 border-blue-105', bg: 'bg-blue-50' },
  contacted: { label: 'Contacted', color: 'text-purple-700 border-purple-105', bg: 'bg-purple-50' },
  negotiating: { label: 'Negotiations', color: 'text-orange-700 border-orange-105', bg: 'bg-orange-50' },
  won: { label: 'Deal Won 🎉', color: 'text-emerald-755 border-emerald-105', bg: 'bg-emerald-50' },
  lost: { label: 'Closed/Lost', color: 'text-rose-700 border-rose-105', bg: 'bg-rose-50' },
};

export default function Leads({
  leads,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
}: LeadsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [source, setSource] = useState('Outreach');
  const [stage, setStage] = useState<Lead['stage']>('new');
  const [priority, setPriority] = useState<Lead['priority']>('medium');
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onAddLead({
      name: name.trim(),
      source,
      stage,
      priority,
      notes: notes.trim(),
      nextAction: nextAction.trim() || 'Schedule intro discussion',
      followUpDate: followUpDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags,
    });

    // Reset
    setName('');
    setSource('Outreach');
    setStage('new');
    setPriority('medium');
    setNotes('');
    setNextAction('');
    setFollowUpDate('');
    setTagsInput('');
    setIsAdding(false);
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchText = (lead.name + ' ' + lead.source + ' ' + lead.notes + ' ' + lead.nextAction).toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    })
    .filter(lead => !selectedStage || lead.stage === selectedStage);

  return (
    <div className="space-y-6" id="leads-root">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
            Leads Pipeline & Deals
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Track business negotiations, inbound/outbound conversion steps, and upcoming priority follow-ups.
          </p>
        </div>

        <button
          id="btn-trigger-add-lead"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Lead Panel' : 'Capture Opportunity'}
        </button>
      </div>

      {/* Creation panel (Dark card theme!) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800"
            id="add-lead-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-orange-500" />
              Inquire New Opportunity lead
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-name">Lead / Contact Name *</label>
                  <input
                    id="lead-form-name"
                    type="text"
                    required
                    placeholder="e.g. Star Imports representative..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-source">Source Origin</label>
                  <select
                    id="lead-form-source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Inbound Web">Inbound Web / Organic</option>
                    <option value="Referral">Partner Referral</option>
                    <option value="Self Generated">Self Generated / Direct</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-stage">Startup Pipeline Stage</label>
                  <select
                    id="lead-form-stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted Initial</option>
                    <option value="negotiating">In Negotiations</option>
                    <option value="won">Deal Won</option>
                    <option value="lost">Deal Lost</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-priority">Priority Level</label>
                  <select
                    id="lead-form-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority Attention</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-action">Required Next Action Step</label>
                  <input
                    id="lead-form-action"
                    type="text"
                    placeholder="e.g. Schedule warehouse walkthrough inspection..."
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-follow">Follow-Up Target Date</label>
                  <input
                    id="lead-form-follow"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-tags">Opportunity Tags (comma-separated)</label>
                <input
                  id="lead-form-tags"
                  type="text"
                  placeholder="freight, regional, high-margin"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="lead-form-notes">Interaction Context & Details</label>
                <textarea
                  id="lead-form-notes"
                  rows={3}
                  placeholder="Notes on volume discounts, lease limits, custom climate specs needed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  id="btn-cancel-create-lead"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-create-lead"
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Save Deal Option
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter panel */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between" id="leads-filter-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            id="lead-search-field"
            type="text"
            placeholder="Search leads name, source, or upcoming action steps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 border-none rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <button
            id="btn-filter-lead-all"
            onClick={() => setSelectedStage(null)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold border transition ${
              selectedStage === null 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white border-slate-205 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Funnel
          </button>
          {(['new', 'contacted', 'negotiating', 'won', 'lost'] as const).map((st) => (
            <button
              id={`btn-filter-lead-${st}`}
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold border transition capitalize ${
                selectedStage === st
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-205 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline listings */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm leading-relaxed">
          <div className="max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-850 text-sm">No opportunity found</h3>
            <p className="text-xs text-slate-400">
              Clear filters or quickly document an active lead card to fill out the workspace pipelines.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="leads-grid">
          {filteredLeads.map((lead) => {
            const stageInfo = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.new;
            return (
              <div 
                key={lead.id} 
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase border text-[9px] ${stageInfo.color} ${stageInfo.bg}`}>
                      {stageInfo.label}
                    </span>

                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase border ${
                      lead.priority === 'high' ? 'bg-rose-50 border-rose-100 text-rose-700' : lead.priority === 'medium' ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {lead.priority} Priority
                    </span>
                  </div>

                  <div className="mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{lead.name}</h3>
                    <div className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">
                      Source: {lead.source}
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-5" style={{ minHeight: '65px' }}>
                    {lead.notes || 'No contextual operational parameters logged.'}
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-50 space-y-2 mt-2">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg shrink-0 text-[10px] uppercase font-bold tracking-wider font-mono">
                        Next action
                      </div>
                      <div className="text-xs font-semibold text-slate-700 leading-normal pt-0.5">
                        {lead.nextAction}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-mono text-[10px]">{lead.followUpDate}</span>
                  </div>

                  <div className="flex gap-2">
                    {/* cycle stages */}
                    <button
                      id={`btn-cycle-lead-stage-${lead.id}`}
                      onClick={() => {
                        const stages: Lead['stage'][] = ['new', 'contacted', 'negotiating', 'won', 'lost'];
                        const priorityIndex = stages.indexOf(lead.stage);
                        const nextLevel = stages[(priorityIndex + 1) % stages.length];
                        onUpdateLead(lead.id, { stage: nextLevel });
                      }}
                      title="Promote stage status"
                      className="p-1 px-2.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 rounded transition"
                    >
                      Cycle Stage
                    </button>
                    <button
                      id={`btn-delete-lead-${lead.id}`}
                      onClick={() => {
                        if (confirm(`Remove the opportunity ${lead.name} permanently?`)) {
                          onDeleteLead(lead.id);
                        }
                      }}
                      className="p-1.5 hover:bg-rose-50 text-slate-350 hover:text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {lead.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {lead.tags.map(t => (
                      <span key={t} className="text-[8px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
