import { BasePedido } from './baseDataService';

class BasePedidosService {
  private storageKey = 'base_pedidos';
  private pedidos: BasePedido[] = [];

  constructor() {
    this.loadPedidos();
  }

  /**
   * Carga los pedidos desde localStorage
   */
  private loadPedidos(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.pedidos = JSON.parse(stored);
      } else {
        // Cargar datos de ejemplo si no hay nada guardado
        this.pedidos = this.getSamplePedidos();
        this.savePedidos();
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.pedidos = this.getSamplePedidos();
      this.savePedidos();
    }
  }

  /**
   * Guarda los pedidos en localStorage
   */
  private savePedidos(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.pedidos));
    } catch (error) {
      console.error('Error al guardar pedidos:', error);
    }
  }

  /**
   * Obtiene todos los pedidos
   */
  getAllPedidos(): BasePedido[] {
    return [...this.pedidos];
  }

  /**
   * Obtiene un pedido por ID
   */
  getPedidoById(id: number): BasePedido | undefined {
    return this.pedidos.find(pedido => pedido.id === id);
  }

  /**
   * Crea un nuevo pedido
   */
  createPedido(pedidoData: Omit<BasePedido, 'id'>): BasePedido {
    const newPedido: BasePedido = {
      id: this.generateId(),
      ...pedidoData
    };

    this.pedidos.push(newPedido);
    this.savePedidos();
    return newPedido;
  }

  /**
   * Actualiza un pedido existente
   */
  updatePedido(id: number, updates: Partial<BasePedido>): BasePedido | null {
    const index = this.pedidos.findIndex(pedido => pedido.id === id);
    if (index === -1) return null;

    this.pedidos[index] = { ...this.pedidos[index], ...updates };
    this.savePedidos();
    return this.pedidos[index];
  }

  /**
   * Elimina un pedido
   */
  deletePedido(id: number): boolean {
    const index = this.pedidos.findIndex(pedido => pedido.id === id);
    if (index === -1) return false;

    this.pedidos.splice(index, 1);
    this.savePedidos();
    return true;
  }

  /**
   * Cambia el estado de un pedido
   */
  changePedidoEstado(id: number, newEstado: string): BasePedido | null {
    return this.updatePedido(id, { estado: newEstado });
  }

  /**
   * Busca pedidos por criterios
   */
  searchPedidos(criteria: {
    searchTerm?: string;
    sector?: string;
    taller?: string;
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): BasePedido[] {
    return this.pedidos.filter(pedido => {
      // Búsqueda por texto
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        const matchesSearch = 
          pedido.nombre.toLowerCase().includes(searchLower) ||
          pedido.legajo.toLowerCase().includes(searchLower) ||
          pedido.parte.toLowerCase().includes(searchLower) ||
          pedido.problema.toLowerCase().includes(searchLower) ||
          pedido.subEquipo.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por sector
      if (criteria.sector && pedido.sector !== criteria.sector) {
        return false;
      }

      // Filtro por taller
      if (criteria.taller && pedido.taller !== criteria.taller) {
        return false;
      }

      // Filtro por estado
      if (criteria.estado && pedido.estado !== criteria.estado) {
        return false;
      }

      // Filtro por fecha
      if (criteria.fechaDesde || criteria.fechaHasta) {
        const pedidoFecha = new Date(pedido.fecha);
        
        if (criteria.fechaDesde) {
          const fechaDesde = new Date(criteria.fechaDesde);
          if (pedidoFecha < fechaDesde) return false;
        }
        
        if (criteria.fechaHasta) {
          const fechaHasta = new Date(criteria.fechaHasta);
          if (pedidoFecha > fechaHasta) return false;
        }
      }

      return true;
    });
  }

  /**
   * Obtiene estadísticas de los pedidos
   */
  getPedidosStats() {
    const total = this.pedidos.length;
    const abiertos = this.pedidos.filter(p => p.estado === 'abierto').length;
    const enProceso = this.pedidos.filter(p => p.estado === 'proceso').length;
    const cerrados = this.pedidos.filter(p => p.estado === 'cerrado').length;

    const porSector = this.pedidos.reduce((acc, pedido) => {
      acc[pedido.sector] = (acc[pedido.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porTaller = this.pedidos.reduce((acc, pedido) => {
      acc[pedido.taller] = (acc[pedido.taller] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      estados: { abiertos, enProceso, cerrados },
      porSector,
      porTaller
    };
  }

  /**
   * Genera un ID único para nuevos pedidos
   */
  private generateId(): number {
    const maxId = Math.max(...this.pedidos.map(p => p.id), 0);
    return maxId + 1;
  }

  /**
   * Obtiene pedidos de ejemplo para inicializar el sistema
   */
  private getSamplePedidos(): BasePedido[] {
    return [
      {
        id: 80001,
        nombre: "Juan Pérez",
        legajo: "LP001",
        fecha: "2024-01-15",
        sector: "corrugadora",
        subEquipo: "Cabezal 1",
        taller: "mecanico",
        tipoTarea: "mantenimiento",
        parte: "Sistema de presión",
        problema: "Fuga de aceite en el cabezal principal. Se requiere revisión y posible cambio de juntas.",
        estado: "abierto"
      },
      {
        id: 80002,
        nombre: "María González",
        legajo: "LP002",
        fecha: "2024-01-15",
        sector: "ward_rdc",
        subEquipo: "Atadora mosca AO5",
        taller: "electrico",
        tipoTarea: "seguridad",
        parte: "Sistema eléctrico",
        problema: "Corto circuito en el panel de control. Intermitente, requiere diagnóstico completo.",
        estado: "proceso"
      },
      {
        id: 80003,
        nombre: "Carlos López",
        legajo: "LP003",
        fecha: "2024-01-15",
        sector: "c3000_rdc",
        subEquipo: "Feed master",
        taller: "mecanico",
        tipoTarea: "mejora",
        parte: "Transportador de entrada",
        problema: "Optimización del sistema de alimentación para aumentar velocidad de producción.",
        estado: "abierto"
      },
      {
        id: 80004,
        nombre: "Ana Martínez",
        legajo: "LP004",
        fecha: "2024-01-14",
        sector: "c2000",
        subEquipo: "Colero",
        taller: "herreria",
        tipoTarea: "mantenimiento",
        parte: "Estructura del colero",
        problema: "Desgaste en las guías de movimiento. Se requiere soldadura y refuerzo.",
        estado: "abierto"
      },
      {
        id: 80005,
        nombre: "Roberto Silva",
        legajo: "LP005",
        fecha: "2024-01-14",
        sector: "gral_planta",
        subEquipo: "Caldera",
        taller: "mecanico",
        tipoTarea: "seguridad",
        parte: "Sistema de seguridad",
        problema: "Revisión de válvulas de seguridad y calibración de presostatos.",
        estado: "proceso"
      },
      {
        id: 80006,
        nombre: "Laura Fernández",
        legajo: "LP006",
        fecha: "2024-01-13",
        sector: "corrugadora",
        subEquipo: "Cabezal 2",
        taller: "electrico",
        tipoTarea: "reparacion",
        parte: "Control de temperatura",
        problema: "Falla en el sensor de temperatura del cabezal. Lecturas incorrectas.",
        estado: "cerrado"
      },
      {
        id: 80007,
        nombre: "Miguel Rodríguez",
        legajo: "LP007",
        fecha: "2024-01-13",
        sector: "ward_rdc",
        subEquipo: "Empacadora",
        taller: "mecanico",
        tipoTarea: "mantenimiento",
        parte: "Sistema neumático",
        problema: "Fuga de aire en las conexiones principales. Pérdida de presión.",
        estado: "abierto"
      }
    ];
  }

  /**
   * Exporta los pedidos a formato JSON (para respaldo)
   */
  exportPedidos(): string {
    return JSON.stringify(this.pedidos, null, 2);
  }

  /**
   * Importa pedidos desde formato JSON (para restauración)
   */
  importPedidos(jsonData: string): boolean {
    try {
      const importedPedidos = JSON.parse(jsonData);
      if (Array.isArray(importedPedidos)) {
        this.pedidos = importedPedidos;
        this.savePedidos();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al importar pedidos:', error);
      return false;
    }
  }

  /**
   * Limpia todos los pedidos (solo para desarrollo/testing)
   */
  clearAllPedidos(): void {
    this.pedidos = [];
    this.savePedidos();
  }

  /**
   * Restaura los datos de ejemplo
   */
  restoreSampleData(): void {
    this.pedidos = this.getSamplePedidos();
    this.savePedidos();
  }
}

export const basePedidosService = new BasePedidosService();
