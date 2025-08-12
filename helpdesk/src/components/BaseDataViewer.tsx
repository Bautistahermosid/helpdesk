import React, { useState } from 'react';
import { Eye, Edit, Trash2, Filter, Search, Plus } from 'lucide-react';
import { BasePedido } from '../services/baseDataService';

interface BaseDataViewerProps {
  pedidos: BasePedido[];
  onEdit: (pedido: BasePedido) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

const BaseDataViewer: React.FC<BaseDataViewerProps> = ({ 
  pedidos, 
  onEdit, 
  onDelete, 
  onCreateNew 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterTaller, setFilterTaller] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortBy, setSortBy] = useState<keyof BasePedido>('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sectors = ['corrugadora', 'ward_rdc', 'c3000_rdc', 'c2000', 'gral_planta', 'otro'];
  const talleres = ['mecanico', 'electrico', 'herreria', 'otro'];
  const estados = ['abierto', 'proceso', 'cerrado'];

  // Filtrar y ordenar pedidos
  const filteredPedidos = pedidos
    .filter(pedido => {
      const matchesSearch = 
        pedido.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.legajo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.parte.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.problema.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = !filterSector || pedido.sector === filterSector;
      const matchesTaller = !filterTaller || pedido.taller === filterTaller;
      const matchesEstado = !filterEstado || pedido.estado === filterEstado;

      return matchesSearch && matchesSector && matchesTaller && matchesEstado;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const handleSort = (field: keyof BasePedido) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'proceso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cerrado':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSectorColor = (sector: string) => {
    const colors = {
      corrugadora: 'bg-blue-100 text-blue-800 border-blue-200',
      ward_rdc: 'bg-purple-100 text-purple-800 border-purple-200',
      c3000_rdc: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      c2000: 'bg-pink-100 text-pink-800 border-pink-200',
      gral_planta: 'bg-orange-100 text-orange-800 border-orange-200',
      otro: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[sector as keyof typeof colors] || colors.otro;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSector('');
    setFilterTaller('');
    setFilterEstado('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Pedidos del Sistema Base
          </h3>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, legajo, parte o problema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtro por sector */}
          <div>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los sectores</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector.charAt(0).toUpperCase() + sector.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por taller */}
          <div>
            <select
              value={filterTaller}
              onChange={(e) => setFilterTaller(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los talleres</option>
              {talleres.map(taller => (
                <option key={taller} value={taller}>
                  {taller.charAt(0).toUpperCase() + taller.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(searchTerm || filterSector || filterTaller || filterEstado) && (
          <div className="mt-3">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Tabla de pedidos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortBy === 'id' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nombre')}
              >
                <div className="flex items-center gap-1">
                  Solicitante
                  {sortBy === 'nombre' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('fecha')}
              >
                <div className="flex items-center gap-1">
                  Fecha
                  {sortBy === 'fecha' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sector/Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parte
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estado')}
              >
                <div className="flex items-center gap-1">
                  Estado
                  {sortBy === 'estado' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPedidos.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 text-gray-300" />
                    <p>No se encontraron pedidos con los filtros aplicados</p>
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{pedido.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pedido.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        Legajo: {pedido.legajo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(pedido.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSectorColor(pedido.sector)}`}>
                        {pedido.sector}
                      </span>
                      <span className="text-sm text-gray-600">
                        {pedido.subEquipo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {pedido.taller}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pedido.parte}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pedido.tipoTarea}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(pedido)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(pedido.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con estadísticas */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Abiertos: {pedidos.filter(p => p.estado === 'abierto').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              En proceso: {pedidos.filter(p => p.estado === 'proceso').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Cerrados: {pedidos.filter(p => p.estado === 'cerrado').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDataViewer;
