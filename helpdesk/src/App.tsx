import React, { useEffect, useState } from 'react';
import { Ticket } from './types';
import { ticketService } from './services/ticketService';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import Header from './components/Header';
import './App.css';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    // Inicializar datos de ejemplo si no hay tickets
    ticketService.initializeSampleData();
    loadTickets();
  }, []);

  const loadTickets = () => {
    const allTickets = ticketService.getAllTickets();
    setTickets(allTickets);
  };

  const handleCreateTicket = (ticketData: any) => {
    ticketService.createTicket(ticketData);
    loadTickets();
    setShowForm(false);
  };

  const handleUpdateTicket = (ticketData: Partial<Ticket>) => {
    if (editingTicket) {
      ticketService.updateTicket(editingTicket.id, ticketData);
      loadTickets();
      setEditingTicket(null);
    }
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      ticketService.deleteTicket(id);
      loadTickets();
    }
  };

  const handleStatusChange = (id: string, newStatus: Ticket['status'], comment?: string) => {
    ticketService.changeTicketStatus(id, newStatus, comment);
    loadTickets();
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setShowForm(true);
  };

  return (
    <div className="App">
      <Header onCreateTicket={() => setShowForm(true)} />
      
      <div className="container">
        <TicketList
          tickets={tickets}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
          onCreateTicket={() => setShowForm(true)}
        />
      </div>

      {(showForm || editingTicket) && (
        <TicketForm
          ticket={editingTicket}
          onSubmit={editingTicket ? handleUpdateTicket : handleCreateTicket}
          onClose={() => {
            setShowForm(false);
            setEditingTicket(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
