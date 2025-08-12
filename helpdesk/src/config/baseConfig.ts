export const BASE_CONFIG = {
  // Mapeo de talleres a equipos asignados
  TALLER_MAPPING: {
    'mecanico': 'Equipo Mecánico',
    'electrico': 'Equipo Eléctrico',
    'herreria': 'Equipo de Herrería',
    'otros': 'Equipo General'
  },
  
  // Mapeo de estados a prioridades
  ESTADO_PRIORITY_MAPPING: {
    'abierto': 'high',
    'proceso': 'medium',
    'cerrado': 'low'
  },
  
  // Sectores disponibles
  SECTORS: [
    'corrugadora',
    'ward_rdc',
    'ward_ffg',
    'c3000_rdc',
    'c2000',
    'cosedoras',
    'gral_planta',
    'automotores',
    'expedicion',
    'jumbo'
  ],
  
  // Tipos de tarea
  TASK_TYPES: [
    'mantenimiento',
    'seguridad',
    'mejora'
  ],
  
  // Talleres disponibles
  WORKSHOPS: [
    'mecanico',
    'electrico',
    'herreria',
    'otros'
  ]
};

// Función para obtener la configuración del localStorage o usar la predeterminada
export const getConfig = () => {
  const savedConfig = localStorage.getItem('baseConfig');
  if (savedConfig) {
    try {
      return { ...BASE_CONFIG, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Error al cargar configuración guardada:', error);
    }
  }
  return BASE_CONFIG;
};

// Función para guardar la configuración
export const saveConfig = (config: Partial<typeof BASE_CONFIG>) => {
  try {
    const currentConfig = getConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('baseConfig', JSON.stringify(newConfig));
    return true;
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return false;
  }
};

// Función para resetear la configuración
export const resetConfig = () => {
  try {
    localStorage.removeItem('baseConfig');
    return true;
  } catch (error) {
    console.error('Error al resetear configuración:', error);
    return false;
  }
};
