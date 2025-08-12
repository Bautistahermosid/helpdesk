import React, { useState } from 'react';
import { Download, RefreshCw, Settings, Wifi, WifiOff } from 'lucide-react';
import { baseDataService, BaseDataConfig } from '../services/baseDataService';
import { ticketService } from '../services/ticketService';

interface BaseDataImporterProps {
  onTicketsImported: () => void;
}

const BaseDataImporter: React.FC<BaseDataImporterProps> = ({ onTicketsImported }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState<BaseDataConfig>(baseDataService.getConfig());
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('Estado desconocido');

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await baseDataService.testConnection();
      setStatusMessage(result.message);
      setSyncStatus(result.success ? 'success' : 'error');
    } catch (error) {
      setStatusMessage('Error en la conexión');
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSampleData = () => {
    setIsLoading(true);
    try {
      const sampleData = baseDataService.loadSampleData();
      // Convertir los datos de ejemplo a tickets
      sampleData.forEach(ticketData => {
        ticketService.createTicket({
          title: ticketData.title,
          description: ticketData.description,
          requester: ticketData.requester,
          assignedTo: ticketData.assignedTo,
          status: ticketData.status,
          priority: ticketData.priority,
          tags: ticketData.tags
        });
      });
      setSyncStatus('success');
      setStatusMessage('Datos de ejemplo cargados correctamente');
      onTicketsImported();
    } catch (error) {
      setSyncStatus('error');
      setStatusMessage('Error al cargar datos de ejemplo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyService = async () => {
    setIsLoading(true);
    try {
      const result = await baseDataService.testConnection();
      setStatusMessage(result.message);
      setSyncStatus(result.success ? 'success' : 'error');
      setLastSync(new Date());
    } catch (error) {
      setStatusMessage('Error al verificar el servicio');
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Importador de Datos</h2>
      
      {/* Botón de prueba de conexión */}
      <div className="mb-6">
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Wifi className="w-4 h-4" />
          <span>Probar Conexión</span>
          <Settings className="w-4 h-4" />
        </button>
        <div className="mt-2">
          <Wifi className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Estado del servicio */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado del Servicio
        </label>
        <div className="text-sm text-gray-600">{statusMessage}</div>
      </div>

      {/* Acciones de datos */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleLoadSampleData}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Cargar Datos de Ejemplo</span>
        </button>
        <button
          onClick={handleVerifyService}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Verificar Servicio</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado:
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos los estados</option>
            <option>Abierto</option>
            <option>Pendiente</option>
            <option>En Proceso</option>
            <option>Cerrado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad:
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todas las prioridades</option>
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar:
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en tickets..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDataImporter;
