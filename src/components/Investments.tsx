import React, { useState } from 'react';
import { Investment } from '../types';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  PieChart, 
  Calendar, 
  FolderPlus, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvestmentsProps {
  investments: Investment[];
  onAddInvestment: (investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteInvestment: (id: string) => void;
}

export default function Investments({
  investments,
  onAddInvestment,
  onDeleteInvestment,
}: InvestmentsProps) {
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('Facility Upgrade');
  const [amount, setAmount] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim() || !amount) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onAddInvestment({
      assetName: assetName.trim(),
      category,
      amount: parseFloat(amount) || 0,
      entryPrice: parseFloat(entryPrice) || parseFloat(amount) || 0,
      notes: notes.trim(),
      tags,
      reviewDate: reviewDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // default 180 days out
    });

    setAssetName('');
    setAmount('');
    setEntryPrice('');
    setNotes('');
    setTagsInput('');
    setReviewDate('');
    setIsAdding(false);
  };

  const totalCap = investments.reduce((sum, inv) => sum + inv.amount, 0);

  // Group by categories
  const categoriesMap = investments.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + current.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6" id="investments-root">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
            Capital Overhead & Investments
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Track business assets, equipment upgrades, solar grid conversions, and payback evaluation.
          </p>
        </div>

        <button
          id="btn-trigger-add-investment"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Allocation' : 'Track Asset Allocation'}
        </button>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="investments-stats">
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-orange-500 text-white rounded-2xl font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Allocated Capital</p>
            <h3 className="text-2xl font-bold font-mono text-orange-400 mt-0.5">${totalCap.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Asset Keys</p>
            <h3 className="text-2xl font-bold font-mono text-slate-800 mt-0.5">{investments.length} logged</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Risk Mitigation Mode</p>
            <h3 className="text-sm font-semibold text-rose-700 mt-1">100% Offline Vault</h3>
          </div>
        </div>
      </div>

      {/* Investment creation panel (Dark card theme!) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800"
            id="add-investment-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-orange-500" />
              Capital Overhead Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="investment-form-asset">Asset / Project Name</label>
                  <input
                    id="investment-form-asset"
                    type="text"
                    required
                    placeholder="e.g. Mezzanine steel layout B..."
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="investment-form-category">Category</label>
                  <select
                    id="investment-form-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="Facility Upgrade">Facility Upgrade</option>
                    <option value="Energy Infrastructure">Energy Infrastructure</option>
                    <option value="IT Systems / Hardware">IT Systems / Hardware</option>
                    <option value="Heavy Machinery">Heavy Machinery</option>
                    <option value="Cash / Capital Pool">Cash / Capital Pool</option>
                    <option value="SaaS Subscriptions">SaaS / Integration Software</option>
                    <option value="Equity Investment">Equity Investment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="investment-form-review">Scheduled Review Date</label>
                  <input
                    id="investment-form-review"
                    type="date"
                    value={reviewDate}
                    onChange={(e) => setReviewDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-405" htmlFor="investment-form-amount">Amount Expended ($)</label>
                  <input
                    id="investment-form-amount"
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-405" htmlFor="investment-form-price">Entry Valuation Unit ($)</label>
                  <input
                    id="investment-form-price"
                    type="number"
                    placeholder="e.g. 45000"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-405" htmlFor="investment-form-tags">Overhead Tags</label>
                  <input
                    id="investment-form-tags"
                    type="text"
                    placeholder="capex, roof, solar"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-404" htmlFor="investment-form-notes">Risk Mitigation Notes / Return Projections</label>
                <textarea
                  id="investment-form-notes"
                  rows={3}
                  placeholder="Expected paybacks, structural parameters, electricity billing discounts, landlord approvals..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  id="btn-cancel-create-investment"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-create-investment"
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Add Allocation Record
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Breakdown Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: allocations details list */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Indexed Capex Assets</h2>
          
          {investments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <p className="text-slate-400 text-xs">No investments or facility overhead tracked yet.</p>
            </div>
          ) : (
            <div className="space-y-4" id="investments-list">
              {investments.map((inv) => (
                <div 
                  key={inv.id} 
                  className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-slate-200 transition duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                        {inv.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">
                        ID: {inv.id}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{inv.assetName}</h4>
                    <p className="text-slate-500 text-xs mt-1 max-w-lg leading-relaxed">{inv.notes || 'No entry evaluation notes.'}</p>
                    
                    <div className="flex gap-1 mt-3">
                      {inv.tags.map(t => (
                        <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto border-t md:border-0 border-slate-50 mt-3 md:mt-0 pt-3 md:pt-0 gap-2 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Total Cost</span>
                      <div className="text-lg font-bold font-mono text-slate-800">${inv.amount.toLocaleString()}</div>
                    </div>

                    <div className="text-left md:text-right hidden md:block">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1 justify-end">
                        <Calendar className="w-2.5 h-2.5 text-orange-500" /> Review Date
                      </span>
                      <div className="text-[11px] font-mono text-slate-650">{inv.reviewDate}</div>
                    </div>

                    <button
                      id={`btn-delete-investment-${inv.id}`}
                      onClick={() => {
                        if (confirm(`Remove asset ${inv.assetName} allocation permanently?`)) {
                          onDeleteInvestment(inv.id);
                        }
                      }}
                      className="p-1.5 text-slate-350 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Categorization allocations */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Category Allocations
            </h3>

            {totalCap === 0 ? (
              <p className="text-slate-405 text-xs py-8 text-center">No allocations mapped yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoriesMap).map(([cat, amt]) => {
                  const pct = totalCap > 0 ? (amt / totalCap) * 100 : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 truncate mr-2">{cat}</span>
                        <div className="font-mono text-slate-900 font-bold whitespace-nowrap shrink-0">
                          ${amt.toLocaleString()} <span className="text-[10px] text-slate-400">({pct.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-slate-800 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guidelines info */}
          <div className="bg-orange-50/40 rounded-3xl p-5 border border-orange-500/10 text-xs text-slate-650 space-y-2.5">
            <h4 className="font-bold text-orange-850 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
              Asset Audit Protocols
            </h4>
            <p className="leading-relaxed">
              Expended assets represent initial hardware, solar platform cost, and vertical stacking logistics. Check compliance guidelines regularly in the **Research** file system.
            </p>
            <div className="flex items-center text-orange-700 font-semibold cursor-pointer hover:underline text-[11px] gap-1 pt-1.5 border-t border-orange-500/5">
              <span>Payback evaluation criteria</span> <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
