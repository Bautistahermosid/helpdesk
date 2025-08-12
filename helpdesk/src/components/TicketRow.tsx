import React, { useState } from 'react';
import { Ticket } from '../types';
import { Edit, Trash2, History, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TicketHistory from './TicketHistory';
import QuickStatusChange from './QuickStatusChange';

interface TicketRowProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: Ticket['status'], comment?: string) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  onStatusChange,
  onEdit,
  onDelete
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showQuickStatus, setShowQuickStatus] = useState(false);

  const getStatusBadge = (status: Ticket['status']) => {
    const statusConfig = {
      open: { label: 'Abierto', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' },
      pending: { label: 'Pendiente', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800' },
      claimed: { label: 'En Proceso', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' },
      closed: { label: 'Cerrado', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status];
    return <span className={config.className}>{config.label}</span>;
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const priorityConfig = {
      low: { label: 'Baja', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800' },
      medium: { label: 'Media', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800' },
      high: { label: 'Alta', className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority];
    return <span className={config.className}>{config.label}</span>;
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{ticket.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div>
            <div className="font-medium text-gray-900">
              {ticket.title}
            </div>
            <div className="text-sm text-gray-500">
              {ticket.description.length > 100 
                ? `${ticket.description.substring(0, 100)}...` 
                : ticket.description
              }
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {ticket.requester}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {ticket.assignedTo}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            {getStatusBadge(ticket.status)}
            <button
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowQuickStatus(true)}
              title="Cambiar estado"
            >
              Cambiar Estado
            </button>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getPriorityBadge(ticket.priority)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(ticket.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => onEdit(ticket)}
              title="Editar ticket"
            >
              Editar
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowHistory(true)}
              title="Ver historial"
            >
              Historial
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => onDelete(ticket.id)}
              title="Eliminar ticket"
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>

      {/* Modal de historial */}
      {showHistory && (
        <TicketHistory
          ticketId={ticket.id}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Modal de cambio rápido de estado */}
      {showQuickStatus && (
        <QuickStatusChange
          ticket={ticket}
          onStatusChange={(status, comment) => {
            onStatusChange(ticket.id, status, comment);
            setShowQuickStatus(false);
          }}
          onClose={() => setShowQuickStatus(false)}
        />
      )}
    </>
  );
};

export default TicketRow;
