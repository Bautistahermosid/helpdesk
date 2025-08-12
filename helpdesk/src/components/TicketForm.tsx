import React, { useState, useEffect } from 'react';
import { Ticket, TicketFormData } from '../types';
import { X } from 'lucide-react';

interface TicketFormProps {
  ticket?: Ticket | null;
  onSubmit: (data: TicketFormData | Partial<Ticket>) => void;
  onClose: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    requester: '',
    assignedTo: '',
    priority: 'medium',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        requester: ticket.requester,
        assignedTo: ticket.assignedTo,
        priority: ticket.priority,
        tags: [...ticket.tags]
      });
    }
  }, [ticket]);

  const handleInputChange = (field: keyof TicketFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ticket) {
      // Modo edición
      onSubmit({
        id: ticket.id,
        ...formData
      });
    } else {
      // Modo creación
      onSubmit(formData);
    }
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.description.trim() && 
           formData.requester.trim() && 
           formData.assignedTo.trim();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{ticket ? 'Editar Ticket' : 'Nuevo Ticket'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Título del ticket"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción *</label>
            <textarea
              className="form-input"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción detallada del problema o solicitud"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Solicitante *</label>
              <input
                type="text"
                className="form-input"
                value={formData.requester}
                onChange={(e) => handleInputChange('requester', e.target.value)}
                placeholder="Nombre del solicitante"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Asignado a *</label>
              <input
                type="text"
                className="form-input"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="Nombre del responsable"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Prioridad</label>
            <select
              className="form-input"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Etiquetas</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nueva etiqueta"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddTag}
              >
                Agregar
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!isFormValid()}
            >
              {ticket ? 'Actualizar' : 'Crear'} Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
