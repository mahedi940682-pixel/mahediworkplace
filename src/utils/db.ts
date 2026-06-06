import { WorkspaceBackup, Memory, Client, Lead, ResearchItem, Investment, SocialIdea, TeamMember, LocalTask, ActivityLog } from '../types';

export const INITIAL_SEED_DATA: WorkspaceBackup = {
  memories: [
    {
      id: 'mem-1',
      title: 'Warehouse Rent Negotiation Guidelines',
      content: 'Maintain terms under $12/sqft. Ask for dynamic utility caps in Section 4 of the new contract. Contact landlord by end of autumn.',
      tags: ['finance', 'legal', 'warehouse'],
      pinned: true,
      archived: false,
      priority: 'high',
      createdAt: '2026-06-01T09:00:00Z',
      updatedAt: '2026-06-01T09:00:00Z'
    },
    {
      id: 'mem-2',
      title: 'Bulk discount formula for inventory partners',
      content: 'For orders > 10,000 units, apply 12.5% discount. Orders > 25,000 units require custom executive approval by Farhan.',
      tags: ['sales', 'operations'],
      pinned: false,
      archived: false,
      priority: 'medium',
      createdAt: '2026-06-03T14:15:00Z',
      updatedAt: '2026-06-03T14:15:00Z'
    },
    {
      id: 'mem-3',
      title: 'Emergency Contact Numbers and Fire Safety Drill',
      content: 'Key contacts: Local dispatcher (555-0199), Warehouse Shift Supervisor (555-0144). Fire extinguishers inspected on June 1st.',
      tags: ['safety', 'internal'],
      pinned: true,
      archived: false,
      priority: 'high',
      createdAt: '2026-06-05T08:30:00Z',
      updatedAt: '2026-06-05T08:30:00Z'
    }
  ],
  clients: [
    {
      id: 'cli-1',
      name: 'Apex Retail Group',
      company: 'Apex Logistics LLC',
      phone: '+1 (555) 381-9922',
      email: 'logistics@apexretail.com',
      status: 'active',
      notes: 'Premier retail client. Focuses on seasonal shipment drops. Next review requires high-level freight forecast integration.',
      nextFollowUp: '2026-06-12',
      tags: ['retail', 'enterprise', 'high-tier'],
      createdAt: '2026-05-15T11:00:00Z',
      updatedAt: '2026-05-15T11:00:00Z'
    },
    {
      id: 'cli-2',
      name: 'Nexus Tech Solutions',
      company: 'Nexus Manufacturing',
      phone: '+1 (555) 723-1188',
      email: 'procurement@nexustech.io',
      status: 'active',
      notes: 'Supplies hardware inventory across 3 hubs. Extremely strict SLA timeline requirements (24-hour delivery target).',
      nextFollowUp: '2026-06-18',
      tags: ['technology', 'SLA-priority'],
      createdAt: '2026-05-20T10:30:00Z',
      updatedAt: '2026-05-20T10:30:00Z'
    },
    {
      id: 'cli-3',
      name: 'Pinnacle Foods Inc.',
      company: 'Pinnacle Distribution',
      phone: '+1 (555) 891-4477',
      email: 'shipping@pinnaclefoods.org',
      status: 'pending',
      notes: 'Cold storage storage pilot project starting soon. Awaiting final signed environmental agreement sheets.',
      nextFollowUp: '2026-06-09',
      tags: ['cold-chain', 'food'],
      createdAt: '2026-06-02T16:45:00Z',
      updatedAt: '2026-06-02T16:45:00Z'
    }
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'Global Freight Corp',
      source: 'Cold Outreach',
      stage: 'negotiating',
      priority: 'high',
      notes: 'Looking to park 50 containers monthly starting in August. Drafted price scheme at $1,200/container/mo. Decision makers are review board.',
      nextAction: 'Send updated tariff quote sheet',
      followUpDate: '2026-06-07',
      tags: ['container-parking', 'enterprise'],
      createdAt: '2026-05-28T09:12:00Z',
      updatedAt: '2026-06-04T15:20:00Z'
    },
    {
      id: 'lead-2',
      name: 'Eco-Pack Distributors',
      source: 'Inbound Web',
      stage: 'contacted',
      priority: 'medium',
      notes: 'Biodegradable packaging supplies. Wants a clean, dry mezzanine section of 4,000 sq ft. Needs climate stability proof reports.',
      nextAction: 'Call management to schedule physical walkthrough tour',
      followUpDate: '2026-06-10',
      tags: ['eco', 'mezzanine'],
      createdAt: '2026-06-01T14:00:00Z',
      updatedAt: '2026-06-01T14:30:00Z'
    },
    {
      id: 'lead-3',
      name: 'Star Imports Inc.',
      source: 'Referral',
      stage: 'new',
      priority: 'high',
      notes: 'Introduced by Apex Group owner. Fast customs clearance processing priority. Needs high priority attention.',
      nextAction: 'Send warm introductory email with service catalog',
      followUpDate: '2026-06-08',
      tags: ['referral', 'imports'],
      createdAt: '2026-06-05T12:00:00Z',
      updatedAt: '2026-06-05T12:00:00Z'
    }
  ],
  researchItems: [
    {
      id: 'res-1',
      title: 'Automated AGV (Automated Guided Vehicles) Market Analysis',
      sourceUrl: 'https://mhi.org/agv-research-2026',
      summary: 'AGVs can boost sorting efficiencies by 35% and reduce workplace transit hazards. Small-scale warehouse pilots cost ~$45,000 for 3 basic units.',
      notes: 'Highly relevant for the Section B expansion layout next fiscal year. Needs detailed energy capacity reports.',
      tags: ['automation', 'efficiency', 'warehouse-expansion'],
      createdAt: '2026-05-30T10:00:00Z',
      updatedAt: '2026-05-30T10:00:00Z',
      pinned: true
    },
    {
      id: 'res-2',
      title: 'Cold Storage Humidity and Thermal Compliance Guidelines',
      sourceUrl: 'https://fda.gov/cold-chain-handling-standards',
      summary: 'Required constant temp of -18°C to -22°C for seafood batches. Humidity logs must be kept in immutable system logs for up to 3 years.',
      notes: 'Useful for auditing Pinnacle Foods proposed contract rules.',
      tags: ['cold-chain', 'regulatory', 'compliance'],
      createdAt: '2026-06-02T11:15:00Z',
      updatedAt: '2026-06-02T11:15:00Z',
      pinned: false
    }
  ],
  investments: [
    {
      id: 'inv-1',
      assetName: 'East Wing Mezzanine Construction Support',
      category: 'Real Estate / Facility Upgrade',
      amount: 42000,
      entryPrice: 42000,
      notes: 'Full addition of steel platforms, increasing vertical stacking volume by 18,000 cu ft. Expected payback period: 14 months via premium lease pricing.',
      tags: ['capital-expenditure', 'facility', 'expansion'],
      reviewDate: '2026-12-01',
      createdAt: '2026-04-10T09:00:00Z',
      updatedAt: '2026-04-10T09:00:00Z'
    },
    {
      id: 'inv-2',
      assetName: 'Solar Panel System - Roof Grid A',
      category: 'Energy Infrastructure',
      amount: 35000,
      entryPrice: 35000,
      notes: '35kW grid installed. Expected to offset monthly heating/cooling overhead by 40%. Standard state utility credits kick in starting next cycle.',
      tags: ['eco', 'infrastructure', 'cost-cutting'],
      reviewDate: '2026-09-15',
      createdAt: '2026-05-12T14:00:00Z',
      updatedAt: '2026-05-12T14:00:00Z'
    }
  ],
  socialIdeas: [
    {
      id: 'soc-1',
      platform: 'linkedin',
      title: '3 Golden Rules of Maximizing Vertical Space in Mid-Size Warehouses',
      content: 'Draft post sharing practical lessons on vertical layout designs, using pallet racking systems instead of horizontal floor expansion, and how safety rails prevent accidental inventory tipping.',
      status: 'draft',
      tags: ['branding', 'linkedin-tips', 'warehouse-tips'],
      createdAt: '2026-06-04T10:00:00Z',
      updatedAt: '2026-06-04T10:05:00Z'
    },
    {
      id: 'soc-2',
      platform: 'twitter',
      title: 'IoT sensor tech stack for cold storage monitoring',
      content: 'Quick list of temperature probes, ESP32 nodes, and AWS IoT integration that solved real-time tracking for perishable items. Keep it technical but conversational.',
      status: 'scheduled',
      tags: ['tech-stack', 'iot', 'cold-storage'],
      createdAt: '2026-06-05T14:30:00Z',
      updatedAt: '2026-06-05T14:40:00Z'
    }
  ],
  teamMembers: [
    {
      id: 'team-1',
      name: 'Farhan',
      role: 'Owner & Chief Director',
      permissions: ['admin', 'read', 'write'],
      notes: 'Primary workplace administrator and direct business decision maker.',
      status: 'active',
      createdAt: '2026-01-01T08:00:00Z',
      updatedAt: '2026-01-01T08:00:00Z'
    },
    {
      id: 'team-2',
      name: 'Mahedi',
      role: 'Lead Project Architect',
      permissions: ['read', 'write'],
      notes: 'Designs structural workflow operations, client integrations, and IT system architecture.',
      status: 'active',
      createdAt: '2026-01-05T09:00:00Z',
      updatedAt: '2026-01-05T09:00:00Z'
    },
    {
      id: 'team-3',
      name: 'Aria Rahman',
      role: 'Operations & Safety Coordinator',
      permissions: ['read', 'write'],
      notes: 'Oversees safety regulatory standards, cold-room checks, and equipment maintenance.',
      status: 'active',
      createdAt: '2026-02-10T10:00:00Z',
      updatedAt: '2026-02-10T10:00:00Z'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Audit emergency exit pathways and signage clarity',
      completed: true,
      priority: 'high',
      dueDate: '2026-06-05',
      tags: ['safety'],
      createdAt: '2026-06-04T08:00:00Z',
      updatedAt: '2026-06-05T16:00:00Z'
    },
    {
      id: 'task-2',
      title: 'Review Apex Retail peak-season contract drafts',
      completed: false,
      priority: 'high',
      dueDate: '2026-06-08',
      tags: ['contract', 'apex-retail'],
      createdAt: '2026-06-05T09:00:00Z',
      updatedAt: '2026-06-05T09:00:00Z'
    },
    {
      id: 'task-3',
      title: 'Calibrate automated temperature alerts in Fridge C',
      completed: false,
      priority: 'medium',
      dueDate: '2026-06-11',
      tags: ['maintenance', 'cold-chain'],
      createdAt: '2026-06-06T00:30:00Z',
      updatedAt: '2026-06-06T00:30:00Z'
    },
    {
      id: 'task-4',
      title: 'Prepare financial performance summary slides',
      completed: false,
      priority: 'low',
      dueDate: '2026-06-15',
      tags: ['reporting'],
      createdAt: '2026-06-06T01:00:00Z',
      updatedAt: '2026-06-06T01:00:00Z'
    }
  ],
  activityLogs: [
    {
      id: 'act-1',
      module: 'System',
      action: 'Initialize',
      description: 'Mahediworkplace workspace database initialized successfully fully offline.',
      timestamp: '2026-06-06T01:00:00Z'
    },
    {
      id: 'act-2',
      module: 'Safety Task',
      action: 'Complete',
      description: 'Task "Audit emergency exit pathways and signage" completed by Aria Rahman.',
      timestamp: '2026-06-06T01:10:00Z'
    },
    {
      id: 'act-3',
      module: 'Leads',
      action: 'Update',
      description: 'Global Freight Corp lead status set to "Negotiating" and pricing proposal drafted.',
      timestamp: '2026-06-06T01:20:00Z'
    }
  ],
  settings: {
    theme: 'warm',
    syncEnabled: false,
    userEmail: 'mahedi940682@gmail.com'
  }
};

const STORAGE_KEY = 'mahedi_workplace_data_v1';
const OLD_STORAGE_KEY = 'mahesi_workplace_data_v1';

export function getWorkspaceData(): WorkspaceBackup {
  let dataStr = localStorage.getItem(STORAGE_KEY);
  if (!dataStr) {
    const oldDataStr = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldDataStr) {
      localStorage.setItem(STORAGE_KEY, oldDataStr);
      localStorage.removeItem(OLD_STORAGE_KEY);
      dataStr = oldDataStr;
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
      return INITIAL_SEED_DATA;
    }
  }
  try {
    return JSON.parse(dataStr);
  } catch (err) {
    console.error('Error parsing storage data, fallback to seed', err);
    return INITIAL_SEED_DATA;
  }
}

export function saveWorkspaceData(data: WorkspaceBackup) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Log a dynamic action
export function addLogEntry(data: WorkspaceBackup, module: string, action: string, description: string): WorkspaceBackup {
  const newLog: ActivityLog = {
    id: 'log-' + Math.random().toString(36).substr(2, 9),
    module,
    action,
    description,
    timestamp: new Date().toISOString()
  };
  
  // Keep logs at a reasonable limit (e.g. 100 entries)
  const activityLogs = [newLog, ...data.activityLogs].slice(0, 100);
  return { ...data, activityLogs };
}
