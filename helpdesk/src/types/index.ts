export type TicketStatus = 'open' | 'closed' | 'pending' | 'claimed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: string;
  assignedTo: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface StatusChange {
  id: string;
  ticketId: string;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  changedBy: string;
  changedAt: Date;
  comment?: string;
}

export interface FilterOptions {
  status?: TicketStatus;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  assignedTo?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  requester: string;
  assignedTo: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}
