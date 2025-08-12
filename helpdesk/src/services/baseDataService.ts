import { TicketFormData } from '../types';

export interface BaseDataConfig {
  autoLoad: boolean;
  syncInterval: number; // en milisegundos
}

class BaseDataService {
  private config: BaseDataConfig;
  private syncIntervalId: number | null = null;

  constructor() {
    this.config = {
      autoLoad: false,
      syncInterval: 30000 // 30 segundos por defecto
    };
  }

  configure(config: Partial<BaseDataConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Carga datos de ejemplo para el sistema
   */
  loadSampleData(): TicketFormData[] {
    return [
      {
        title: "Fuga de aceite - Sistema de presión",
        description: "Se detectó una fuga de aceite en el sistema de presión del cabezal principal de la corrugadora. Requiere atención inmediata para evitar daños mayores.",
        requester: "Juan Pérez",
        assignedTo: "Equipo Mecánico",
        status: "open",
        priority: "high",
        tags: ["corrugadora", "cabezal", "mecanico", "mantenimiento", "sistema-presion"]
      },
      {
        title: "Corto circuito - Panel de control",
        description: "Se reportó un corto circuito en el panel de control del compresor del sector ward_rdc. El equipo eléctrico está trabajando en la solución.",
        requester: "María González",
        assignedTo: "Equipo Eléctrico",
        status: "claimed",
        priority: "high",
        tags: ["ward_rdc", "compresor", "electrico", "seguridad", "panel-control"]
      },
      {
        title: "Refuerzo de base - Cosedora Industrial",
        description: "Se requiere reforzar la base de la cosedora industrial para mejorar la estabilidad durante el funcionamiento. Trabajo de herrería.",
        requester: "Carlos Rodríguez",
        assignedTo: "Equipo de Herrería",
        status: "open",
        priority: "medium",
        tags: ["cosedoras", "herreria", "mejora", "estructura", "base"]
      }
    ];
  }

  /**
   * Inicia la sincronización automática
   */
  startAutoSync(): void {
    if (this.syncIntervalId) {
      this.stopAutoSync();
    }

    if (this.config.autoLoad) {
      this.syncIntervalId = window.setInterval(() => {
        console.log('Sincronización automática ejecutada');
        // Aquí se puede implementar la lógica de sincronización
      }, this.config.syncInterval);
    }
  }

  /**
   * Detiene la sincronización automática
   */
  stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): BaseDataConfig {
    return { ...this.config };
  }

  /**
   * Verifica la configuración del servicio
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Simular verificación de conexión
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true, message: 'Servicio de datos base funcionando correctamente' };
    } catch (error) {
      return { success: false, message: 'Error en el servicio de datos base' };
    }
  }
}

export const baseDataService = new BaseDataService();
