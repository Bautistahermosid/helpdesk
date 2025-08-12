import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onCreateTicket: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTicket }) => {
  return (
    <header className="header">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Sistema de Helpdesk</h1>
          <button 
            className="btn btn-primary"
            onClick={onCreateTicket}
          >
            <Plus size={20} />
            Nuevo Ticket
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
