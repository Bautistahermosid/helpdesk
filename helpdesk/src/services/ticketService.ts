import { Ticket, StatusChange, FilterOptions } from '../types';

const TICKETS_KEY = 'helpdesk_tickets';
const STATUS_CHANGES_KEY = 'helpdesk_status_changes';

class TicketService {
  private getTickets(): Ticket[] {
    const tickets = localStorage.getItem(TICKETS_KEY);
    if (tickets) {
      return JSON.parse(tickets).map((ticket: any) => ({
        ...ticket,
        createdAt: new Date(ticket.createdAt),
        updatedAt: new Date(ticket.updatedAt),
        closedAt: ticket.closedAt ? new Date(ticket.closedAt) : undefined
      }));
    }
    return [];
  }

  private saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  }

  private getStatusChanges(): StatusChange[] {
    const changes = localStorage.getItem(STATUS_CHANGES_KEY);
    if (changes) {
      return JSON.parse(changes).map((change: any) => ({
        ...change,
        changedAt: new Date(change.changedAt)
      }));
    }
    return [];
  }

  private saveStatusChanges(changes: StatusChange[]): void {
    localStorage.setItem(STATUS_CHANGES_KEY, JSON.stringify(changes));
  }

  getAllTickets(): Ticket[] {
    return this.getTickets();
  }

  getTicketById(id: string): Ticket | undefined {
    return this.getTickets().find(ticket => ticket.id === id);
  }

  createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket {
    const tickets = this.getTickets();
    const newTicket: Ticket = {
      ...ticketData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tickets.push(newTicket);
    this.saveTickets(tickets);
    
    // Registrar el cambio de estado inicial
    this.recordStatusChange(newTicket.id, 'open', 'open', 'Sistema', 'Ticket creado');
    
    return newTicket;
  }

  updateTicket(id: string, updates: Partial<Ticket>): Ticket | null {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === id);
    
    if (ticketIndex === -1) return null;
    
    const oldStatus = tickets[ticketIndex].status;
    const newStatus = updates.status || oldStatus;
    
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveTickets(tickets);
    
    // Registrar cambio de estado si cambió
    if (oldStatus !== newStatus) {
      this.recordStatusChange(id, oldStatus, newStatus, 'Usuario', updates.statusComment);
    }
    
    return tickets[ticketIndex];
  }

  changeTicketStatus(id: string, newStatus: Ticket['status'], comment?: string): Ticket | null {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === id);
    
    if (ticketIndex === -1) return null;
    
    const oldStatus = tickets[ticketIndex].status;
    
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      status: newStatus,
      updatedAt: new Date(),
      closedAt: newStatus === 'closed' ? new Date() : tickets[ticketIndex].closedAt
    };
    
    this.saveTickets(tickets);
    
    // Registrar el cambio de estado
    this.recordStatusChange(id, oldStatus, newStatus, 'Usuario', comment);
    
    return tickets[ticketIndex];
  }

  deleteTicket(id: string): boolean {
    const tickets = this.getTickets();
    const filteredTickets = tickets.filter(t => t.id !== id);
    
    if (filteredTickets.length === tickets.length) return false;
    
    this.saveTickets(filteredTickets);
    return true;
  }

  filterTickets(filters: FilterOptions): Ticket[] {
    let tickets = this.getTickets();
    
    if (filters.status) {
      tickets = tickets.filter(t => t.status === filters.status);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      tickets = tickets.filter(t => 
        filters.tags!.some(tag => t.tags.includes(tag))
      );
    }
    
    if (filters.dateFrom) {
      tickets = tickets.filter(t => t.createdAt >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      tickets = tickets.filter(t => t.createdAt <= filters.dateTo!);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm) ||
        t.requester.toLowerCase().includes(searchTerm) ||
        t.assignedTo.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.assignedTo) {
      tickets = tickets.filter(t => t.assignedTo === filters.assignedTo);
    }
    
    return tickets;
  }

  getStatusChangesForTicket(ticketId: string): StatusChange[] {
    return this.getStatusChanges()
      .filter(change => change.ticketId === ticketId)
      .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  }

  private recordStatusChange(
    ticketId: string, 
    fromStatus: Ticket['status'], 
    toStatus: Ticket['status'], 
    changedBy: string, 
    comment?: string
  ): void {
    const changes = this.getStatusChanges();
    const newChange: StatusChange = {
      id: this.generateId(),
      ticketId,
      fromStatus,
      toStatus,
      changedBy,
      changedAt: new Date(),
      comment
    };
    
    changes.push(newChange);
    this.saveStatusChanges(changes);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Datos de ejemplo para empezar
  initializeSampleData(): void {
    if (this.getTickets().length === 0) {
      const sampleTickets: Ticket[] = [
        {
          id: '1',
          title: 'Problema con el sistema de login',
          description: 'Los usuarios no pueden acceder al sistema desde esta mañana',
          requester: 'Juan Pérez',
          assignedTo: 'Ana García',
          status: 'open',
          priority: 'high',
          tags: ['login', 'acceso', 'urgente'],
          createdAt: new Date('2024-01-15T09:00:00'),
          updatedAt: new Date('2024-01-15T09:00:00')
        },
        {
          id: '2',
          title: 'Solicitud de nueva funcionalidad',
          description: 'Necesitamos agregar un reporte de ventas mensual',
          requester: 'María López',
          assignedTo: 'Carlos Ruiz',
          status: 'pending',
          priority: 'medium',
          tags: ['nueva funcionalidad', 'reportes'],
          createdAt: new Date('2024-01-14T14:30:00'),
          updatedAt: new Date('2024-01-14T14:30:00')
        },
        {
          id: '3',
          title: 'Error en la impresión de facturas',
          description: 'Las facturas se imprimen con formato incorrecto',
          requester: 'Roberto Silva',
          assignedTo: 'Ana García',
          status: 'claimed',
          priority: 'medium',
          tags: ['impresión', 'facturas'],
          createdAt: new Date('2024-01-13T11:15:00'),
          updatedAt: new Date('2024-01-13T11:15:00')
        }
      ];
      
      this.saveTickets(sampleTickets);
      
      // Crear historial de cambios para los tickets de ejemplo
      sampleTickets.forEach(ticket => {
        this.recordStatusChange(ticket.id, 'open', ticket.status, 'Sistema', 'Ticket creado');
      });
    }
  }
}

export const ticketService = new TicketService();
