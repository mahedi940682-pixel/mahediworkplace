import React, { useState } from 'react';
import { TeamMember } from '../types';
import { 
  Plus, 
  Trash2, 
  Shield, 
  Users, 
  AlertCircle,
  Activity,
  UserCheck,
  ToggleLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeamProps {
  teamMembers: TeamMember[];
  onAddTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  onDeleteTeamMember: (id: string) => void;
}

export default function Team({
  teamMembers,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
}: TeamProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Shift Supervisor');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  
  // Permissions checkbox states
  const [permRead, setPermRead] = useState(true);
  const [permWrite, setPermWrite] = useState(true);
  const [permAdmin, setPermAdmin] = useState(false);

  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const permissions: string[] = [];
    if (permRead) permissions.push('read');
    if (permWrite) permissions.push('write');
    if (permAdmin) permissions.push('admin');

    onAddTeamMember({
      name: name.trim(),
      role,
      permissions,
      notes: notes.trim(),
      status,
    });

    setName('');
    setRole('Shift Supervisor');
    setNotes('');
    setPermRead(true);
    setPermWrite(true);
    setPermAdmin(false);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6" id="team-root">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
            Operators & Team Matrix
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Track shifts, system log coordinate clearance permissions, and assign operational roles offline.
          </p>
        </div>

        <button
          id="btn-trigger-add-team"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Operational Board' : 'Onboard Shift Operator'}
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
            id="add-team-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              Onboard Shift Operator
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="team-form-name">Full Name *</label>
                  <input
                    id="team-form-name"
                    type="text"
                    required
                    placeholder="e.g. Tania Akter..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="team-form-role">Operational Title / Role</label>
                  <select
                    id="team-form-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="Chief Director">Chief Director</option>
                    <option value="Project Lead Architect">Project Lead Architect</option>
                    <option value="Shift Supervisor">Shift Supervisor</option>
                    <option value="Safety Coordinator">Safety Coordinator</option>
                    <option value="Inventory Controller">Inventory Controller</option>
                    <option value="Warehouse Dispatcher">Warehouse Dispatcher</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="team-form-status">Initial Shift Duty</label>
                  <select
                    id="team-form-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="active">Active On-Duty</option>
                    <option value="inactive">Off-Duty / Standby</option>
                  </select>
                </div>

              </div>

              {/* Clearance checklist */}
              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Systems Level Clearances:</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs" htmlFor="perm-read-cb">
                    <input
                      id="perm-read-cb"
                      type="checkbox"
                      checked={permRead}
                      onChange={(e) => setPermRead(e.target.checked)}
                      className="rounded border-slate-800 text-orange-500 bg-slate-950 focus:ring-orange-500/30"
                    />
                    <span>Audit read logs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs" htmlFor="perm-write-cb">
                    <input
                      id="perm-write-cb"
                      type="checkbox"
                      checked={permWrite}
                      onChange={(e) => setPermWrite(e.target.checked)}
                      className="rounded border-slate-800 text-orange-500 bg-slate-950 focus:ring-orange-500/30"
                    />
                    <span>Write/Modify guidelines</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs animate-pulse text-orange-400 font-bold" htmlFor="perm-admin-cb">
                    <input
                      id="perm-admin-cb"
                      type="checkbox"
                      checked={permAdmin}
                      onChange={(e) => setPermAdmin(e.target.checked)}
                      className="rounded border-slate-800 text-orange-500 bg-slate-950 focus:ring-orange-500/40"
                    />
                    <span>Vault Admin permission</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="team-form-notes">Operator Qualifications / Training Log Notes</label>
                <textarea
                  id="team-form-notes"
                  rows={2}
                  placeholder="Notes on licensed forklift usage, First-Aid certificates, cold-room auditing procedures training..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  id="btn-cancel-create-team"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-create-team"
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Operator Profiles listings */}
      {teamMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm leading-relaxed">
          <div className="max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No onboarded system operators</h3>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="team-grid">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    member.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    <Activity className={`w-3 h-3 ${member.status === 'active' ? 'animate-pulse text-emerald-600' : 'text-slate-400'}`} />
                    <span className="capitalize">{member.status === 'active' ? 'On-Duty' : 'Off-Duty'}</span>
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {member.id}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed mb-4 p-3 bg-slate-50/50 rounded-2xl border border-slate-50" style={{ minHeight: '60px' }}>
                  {member.notes || 'No specialized qualifications logged.'}
                </p>

                {/* System level clearances table view */}
                <div className="space-y-2 pt-3 border-t border-slate-50">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Clearance matrix</span>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {member.permissions.map((p) => (
                      <span key={p} className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100/50 flex items-center gap-1 capitalize">
                        <Shield className="w-3 h-3" />
                        {p}
                      </span>
                    ))}
                    {member.permissions.length === 0 && (
                      <span className="text-[10px] text-zinc-400">None assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-5">
                <button
                  id={`btn-toggle-team-status-${member.id}`}
                  onClick={() => {
                    onUpdateTeamMember(member.id, { status: member.status === 'active' ? 'inactive' : 'active' });
                  }}
                  className="text-[11px] font-bold text-indigo-650 hover:underline flex items-center gap-1"
                >
                  <ToggleLeft className="w-4 h-4" /> Toggle shift duty
                </button>

                <button
                  id={`btn-delete-team-${member.id}`}
                  onClick={() => {
                    if (confirm(`Remove the operator ${member.name} from systems database permanently?`)) {
                      onDeleteTeamMember(member.id);
                    }
                  }}
                  className="p-1.5 hover:bg-rose-50 text-slate-350 hover:text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
