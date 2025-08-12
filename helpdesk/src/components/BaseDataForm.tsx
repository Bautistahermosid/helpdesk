import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { BasePedido } from '../services/baseDataService';

interface BaseDataFormProps {
  onSubmit: (pedido: BasePedido) => void;
  onClose: () => void;
}

const BaseDataForm: React.FC<BaseDataFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Omit<BasePedido, 'id'>>({
    nombre: '',
    legajo: '',
    fecha: new Date().toISOString().split('T')[0],
    sector: '',
    subEquipo: '',
    taller: '',
    tipoTarea: '',
    parte: '',
    problema: '',
    estado: 'abierto'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sectors = [
    'corrugadora',
    'ward_rdc',
    'c3000_rdc',
    'c2000',
    'gral_planta',
    'otro'
  ];

  const talleres = [
    'mecanico',
    'electrico',
    'herreria',
    'otro'
  ];

  const tiposTarea = [
    'mantenimiento',
    'reparacion',
    'seguridad',
    'mejora',
    'otro'
  ];

  const estados = [
    'abierto',
    'proceso',
    'cerrado'
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.legajo.trim()) newErrors.legajo = 'El legajo es requerido';
    if (!formData.sector.trim()) newErrors.sector = 'El sector es requerido';
    if (!formData.subEquipo.trim()) newErrors.subEquipo = 'El sub-equipo es requerido';
    if (!formData.taller.trim()) newErrors.taller = 'El taller es requerido';
    if (!formData.tipoTarea.trim()) newErrors.tipoTarea = 'El tipo de tarea es requerido';
    if (!formData.parte.trim()) newErrors.parte = 'La parte es requerida';
    if (!formData.problema.trim()) newErrors.problema = 'El problema es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newPedido: BasePedido = {
        id: Date.now(), // Generar ID único
        ...formData
      };
      
      onSubmit(newPedido);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Nuevo Pedido - Sistema Base
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del solicitante */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-3">
              Información del Solicitante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre completo"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Legajo *
                </label>
                <input
                  type="text"
                  value={formData.legajo}
                  onChange={(e) => handleInputChange('legajo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.legajo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Número de legajo"
                />
                {errors.legajo && (
                  <p className="text-red-500 text-sm mt-1">{errors.legajo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Información del equipo */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-3">
              Información del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.sector ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar sector</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector.charAt(0).toUpperCase() + sector.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.sector && (
                  <p className="text-red-500 text-sm mt-1">{errors.sector}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Equipo *
                </label>
                <input
                  type="text"
                  value={formData.subEquipo}
                  onChange={(e) => handleInputChange('subEquipo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subEquipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Cabezal 1, Atadora AO5"
                />
                {errors.subEquipo && (
                  <p className="text-red-500 text-sm mt-1">{errors.subEquipo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taller *
                </label>
                <select
                  value={formData.taller}
                  onChange={(e) => handleInputChange('taller', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.taller ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar taller</option>
                  {talleres.map(taller => (
                    <option key={taller} value={taller}>
                      {taller.charAt(0).toUpperCase() + taller.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.taller && (
                  <p className="text-red-500 text-sm mt-1">{errors.taller}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Tarea *
                </label>
                <select
                  value={formData.tipoTarea}
                  onChange={(e) => handleInputChange('tipoTarea', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tipoTarea ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposTarea.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.tipoTarea && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipoTarea}</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles del pedido */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-3">
              Detalles del Pedido
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parte/Componente *
                </label>
                <input
                  type="text"
                  value={formData.parte}
                  onChange={(e) => handleInputChange('parte', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.parte ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Sistema de presión, Panel de control"
                />
                {errors.parte && (
                  <p className="text-red-500 text-sm mt-1">{errors.parte}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Problema *
                </label>
                <textarea
                  value={formData.problema}
                  onChange={(e) => handleInputChange('problema', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.problema ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe detalladamente el problema o solicitud"
                />
                {errors.problema && (
                  <p className="text-red-500 text-sm mt-1">{errors.problema}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BaseDataForm;
