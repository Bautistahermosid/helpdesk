import React, { useState, useEffect } from 'react';
import { Database, Plus, Settings, BarChart3 } from 'lucide-react';
import { BasePedido } from '../services/baseDataService';
import { basePedidosService } from '../services/basePedidosService';
import BaseDataForm from './BaseDataForm';
import BaseDataViewer from './BaseDataViewer';
import BaseDataEditForm from './BaseDataEditForm';

const BaseDataManager: React.FC = () => {
  const [pedidos, setPedidos] = useState<BasePedido[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPedido, setEditingPedido] = useState<BasePedido | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = () => {
    const allPedidos = basePedidosService.getAllPedidos();
    setPedidos(allPedidos);
    
    // Calcular estadísticas
    const pedidosStats = basePedidosService.getPedidosStats();
    setStats(pedidosStats);
  };

  const handleCreatePedido = (pedidoData: Omit<BasePedido, 'id'>) => {
    basePedidosService.createPedido(pedidoData);
    loadPedidos();
    setShowForm(false);
  };

  const handleUpdatePedido = (id: number, updates: Partial<BasePedido>) => {
    basePedidosService.updatePedido(id, updates);
    loadPedidos();
    setEditingPedido(null);
  };

  const handleDeletePedido = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      basePedidosService.deletePedido(id);
      loadPedidos();
    }
  };

  const handleEditPedido = (pedido: BasePedido) => {
    setEditingPedido(pedido);
  };

  const handleRestoreSampleData = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar los datos de ejemplo? Esto sobrescribirá todos los pedidos actuales.')) {
      basePedidosService.restoreSampleData();
      loadPedidos();
    }
  };

  const handleExportData = () => {
    const jsonData = basePedidosService.exportPedidos();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos_sistema_base_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (basePedidosService.importPedidos(content)) {
          loadPedidos();
          alert('Datos importados correctamente');
        } else {
          alert('Error al importar los datos. Verifica el formato del archivo.');
        }
      };
      reader.readAsText(file);
    }
    // Limpiar el input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Gestor de Pedidos - Sistema Base
              </h2>
              <p className="text-gray-600">
                Administra los pedidos del sistema base de mantenimiento
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </button>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Pedido
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-800">Total de Pedidos</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{stats.estados.abiertos}</div>
              <div className="text-sm text-red-800">Abiertos</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.estados.enProceso}</div>
              <div className="text-sm text-yellow-800">En Proceso</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.estados.cerrados}</div>
              <div className="text-sm text-green-800">Cerrados</div>
            </div>
          </div>
        )}

        {/* Estadísticas detalladas */}
        {showStats && stats && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Detalladas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Por Sector */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Pedidos por Sector</h4>
                <div className="space-y-2">
                  {Object.entries(stats.porSector).map(([sector, count]) => (
                    <div key={sector} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{sector}</span>
                      <span className="font-medium text-gray-800">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por Taller */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Pedidos por Taller</h4>
                <div className="space-y-2">
                  {Object.entries(stats.porTaller).map(([taller, count]) => (
                    <div key={taller} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{taller}</span>
                      <span className="font-medium text-gray-800">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Herramientas de administración */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Herramientas de Administración
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleRestoreSampleData}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
          >
            <div className="text-orange-600 font-medium">Restaurar Datos de Ejemplo</div>
            <div className="text-sm text-orange-600 mt-1">
              Restaura los pedidos de ejemplo iniciales
            </div>
          </button>

          <button
            onClick={handleExportData}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <div className="text-green-600 font-medium">Exportar Datos</div>
            <div className="text-sm text-green-600 mt-1">
              Descarga todos los pedidos en formato JSON
            </div>
          </button>

          <label className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
            <div className="text-blue-600 font-medium">Importar Datos</div>
            <div className="text-sm text-blue-600 mt-1">
              Carga pedidos desde un archivo JSON
            </div>
          </label>

          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que quieres limpiar todos los pedidos? Esta acción no se puede deshacer.')) {
                basePedidosService.clearAllPedidos();
                loadPedidos();
              }
            }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
          >
            <div className="text-red-600 font-medium">Limpiar Todos</div>
            <div className="text-sm text-red-600 mt-1">
              Elimina todos los pedidos del sistema
            </div>
          </button>
        </div>
      </div>

      {/* Visualizador de pedidos */}
      <BaseDataViewer
        pedidos={pedidos}
        onEdit={handleEditPedido}
        onDelete={handleDeletePedido}
        onCreateNew={() => setShowForm(true)}
      />

      {/* Formulario para crear nuevo pedido */}
      {showForm && (
        <BaseDataForm
          onSubmit={handleCreatePedido}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Formulario para editar pedido */}
      {editingPedido && (
        <BaseDataEditForm
          pedido={editingPedido}
          onSubmit={handleUpdatePedido}
          onClose={() => setEditingPedido(null)}
        />
      )}
    </div>
  );
};

export default BaseDataManager;
