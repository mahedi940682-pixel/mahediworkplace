export interface Memory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  notes: string;
  nextFollowUp: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  stage: 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  nextAction: string;
  followUpDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  sourceUrl: string;
  summary: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface Investment {
  id: string;
  assetName: string;
  category: string; // Crypto, Stocks, Real Estate, Business, etc.
  amount: number;
  entryPrice: number;
  notes: string;
  tags: string[];
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialIdea {
  id: string;
  platform: 'twitter' | 'linkedin' | 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'other';
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  permissions: string[]; // e.g. ["read", "write", "admin"]
  notes: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface LocalTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  module: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface WorkspaceBackup {
  memories: Memory[];
  clients: Client[];
  leads: Lead[];
  researchItems: ResearchItem[];
  investments: Investment[];
  socialIdeas: SocialIdea[];
  teamMembers: TeamMember[];
  tasks: LocalTask[];
  activityLogs: ActivityLog[];
  settings: {
    theme: 'light' | 'nord' | 'warm';
    syncEnabled: boolean;
    userEmail: string;
  };
}
