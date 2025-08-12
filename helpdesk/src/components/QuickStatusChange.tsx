import React, { useState } from 'react';
import { Ticket } from '../types';
import { X } from 'lucide-react';

interface QuickStatusChangeProps {
  ticket: Ticket;
  onStatusChange: (status: Ticket['status'], comment?: string) => void;
  onClose: () => void;
}

const QuickStatusChange: React.FC<QuickStatusChangeProps> = ({
  ticket,
  onStatusChange,
  onClose
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Ticket['status']>(ticket.status);
  const [comment, setComment] = useState('');

  const statusOptions = [
    { value: 'open', label: 'Abierto', className: 'btn-success' },
    { value: 'pending', label: 'Pendiente', className: 'btn-warning' },
    { value: 'claimed', label: 'Reclamado', className: 'btn-danger' },
    { value: 'closed', label: 'Cerrado', className: 'btn-secondary' }
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusChange(selectedStatus, comment.trim() || undefined);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cambio Rápido de Estado</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ticket:</label>
            <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <strong>#{ticket.id}</strong> - {ticket.title}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Estado Actual:</label>
            <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              {ticket.status}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nuevo Estado:</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {statusOptions.map(({ value, label, className }) => (
                <button
                  key={value}
                  type="button"
                  className={`btn ${selectedStatus === value ? 'btn-primary' : className}`}
                  onClick={() => setSelectedStatus(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Comentario (opcional):</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Agregar un comentario sobre el cambio de estado..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Cambiar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickStatusChange;
