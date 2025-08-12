import React, { useState, useMemo } from 'react';
import { Ticket, FilterOptions } from '../types';
import { Search, Plus } from 'lucide-react';
import TicketRow from './TicketRow';
import StatusFilters from './StatusFilters';
import BaseDataImporter from './BaseDataImporter';

interface TicketListProps {
  tickets: Ticket[];
  onStatusChange: (id: string, status: Ticket['status'], comment?: string) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  onCreateTicket: () => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onStatusChange,
  onEdit,
  onDelete,
  onCreateTicket
}) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Aplicar búsqueda en tiempo real
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term) ||
        ticket.requester.toLowerCase().includes(term) ||
        ticket.assignedTo.toLowerCase().includes(term) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Aplicar filtros adicionales
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    if (filters.assignedTo) {
      filtered = filtered.filter(ticket => ticket.assignedTo === filters.assignedTo);
    }

    return filtered;
  }, [tickets, searchTerm, filters]);

  const handleStatusFilter = (status: Ticket['status'] | undefined) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? undefined : status
    }));
  };

  const handlePriorityFilter = (priority: 'low' | 'medium' | 'high' | undefined) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority === priority ? undefined : priority
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getStatusCount = (status: Ticket['status']) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  const getPriorityCount = (priority: 'low' | 'medium' | 'high') => {
    return tickets.filter(ticket => ticket.priority === priority).length;
  };

  const getStatusLabel = (status: Ticket['status']) => {
    const labels = {
      'open': 'Abiertos',
      'pending': 'Pendientes',
      'claimed': 'En Proceso',
      'closed': 'Cerrados'
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high') => {
    const labels = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };
    return labels[priority];
  };

  const handleTicketsImported = () => {
    // Recargar tickets después de importar
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Importador de Datos */}
      <BaseDataImporter onTicketsImported={handleTicketsImported} />

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado:
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as Ticket['status'] || undefined)}
            >
              <option value="">Todos los estados</option>
              <option value="open">Abierto</option>
              <option value="pending">Pendiente</option>
              <option value="claimed">En Proceso</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          {/* Filtro de Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad:
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.priority || ''}
              onChange={(e) => handlePriorityFilter(e.target.value as 'low' | 'medium' | 'high' || undefined)}
            >
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Campo de búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar:
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar en tickets..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de tickets */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 space-y-1">
          <div>Total de Tickets {tickets.length}</div>
          <div>Abiertos {getStatusCount('open')}</div>
          <div>Pendientes {getStatusCount('pending')}</div>
          <div>Cerrados {getStatusCount('closed')}</div>
        </div>
      </div>

      {/* Botón Nuevo Ticket */}
      <div className="flex justify-start">
        <button
          onClick={onCreateTicket}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Ticket</span>
        </button>
      </div>

      {/* Tabla de tickets */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado a</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron tickets que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;
