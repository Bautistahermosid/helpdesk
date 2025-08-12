import React from 'react';
import { Ticket } from '../types';

interface StatusFiltersProps {
  currentStatus?: Ticket['status'];
  onStatusChange: (status: Ticket['status'] | undefined) => void;
}

const StatusFilters: React.FC<StatusFiltersProps> = ({ currentStatus, onStatusChange }) => {
  const statusOptions = [
    { value: 'open', label: 'Abierto', className: 'btn-success' },
    { value: 'pending', label: 'Pendiente', className: 'btn-warning' },
    { value: 'claimed', label: 'Reclamado', className: 'btn-danger' },
    { value: 'closed', label: 'Cerrado', className: 'btn-secondary' }
  ] as const;

  return (
    <div className="status-filters">
      {statusOptions.map(({ value, label, className }) => (
        <button
          key={value}
          className={`btn ${currentStatus === value ? 'btn-primary' : className}`}
          onClick={() => onStatusChange(currentStatus === value ? undefined : value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilters;
