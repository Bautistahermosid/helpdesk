import React, { useEffect, useState } from 'react';
import { StatusChange } from '../types';
import { ticketService } from '../services/ticketService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';

interface TicketHistoryProps {
  ticketId: string;
  onClose: () => void;
}

const TicketHistory: React.FC<TicketHistoryProps> = ({ ticketId, onClose }) => {
  const [statusChanges, setStatusChanges] = useState<StatusChange[]>([]);

  useEffect(() => {
    const changes = ticketService.getStatusChangesForTicket(ticketId);
    setStatusChanges(changes);
  }, [ticketId]);

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      open: 'Abierto',
      pending: 'Pendiente',
      claimed: 'Reclamado',
      closed: 'Cerrado'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: es });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Historial de Cambios - Ticket #{ticketId}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div>
          {statusChanges.length > 0 ? (
            statusChanges.map((change, index) => (
              <div key={change.id} className="history-item">
                <div className="history-time">
                  {formatDate(change.changedAt)} - {change.changedBy}
                </div>
                <div className="history-change">
                  Estado cambiado de <strong>{getStatusLabel(change.fromStatus)}</strong> a{' '}
                  <strong>{getStatusLabel(change.toStatus)}</strong>
                  {change.comment && (
                    <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                      Comentario: {change.comment}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No hay historial de cambios para este ticket
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketHistory;
