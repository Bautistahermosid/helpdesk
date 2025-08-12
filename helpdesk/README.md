# Sistema de Helpdesk

Un sistema completo de gestión de tickets de soporte técnico desarrollado con React, TypeScript y Vite.

## 🚀 Características Principales

### Panel de Tickets
- **Vista de lista completa** con columnas: ID, Título, Solicitante, Asignado, Estado, Prioridad, Etiquetas, Fecha
- **Filtros avanzados** por estado, etiquetas, fechas y asignado
- **Búsqueda en tiempo real** en título, descripción, solicitante y asignado
- **Estadísticas en tiempo real** del total de tickets por estado

### Gestión de Estados
- **Botones rápidos** para cambiar estado: Abierto, Cerrado, Pendiente, Reclamado
- **Cambio de estado con comentarios** para mantener historial
- **Historial completo** de todos los cambios de estado con timestamps

### Funcionalidades Adicionales
- **Creación y edición** de tickets
- **Sistema de etiquetas** personalizable
- **Niveles de prioridad** (Baja, Media, Alta)
- **Responsive design** para dispositivos móviles
- **Persistencia de datos** con localStorage

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Herramienta de construcción rápida
- **Lucide React** - Iconos modernos y consistentes
- **Date-fns** - Manipulación de fechas
- **CSS personalizado** - Diseño moderno y responsive

## 📦 Instalación

1. **Clonar el repositorio:**
```bash
git clone <url-del-repositorio>
cd helpdesk
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🏗️ Construcción para Producción

```bash
npm run build
npm run preview
```

## 📱 Uso del Sistema

### Crear un Nuevo Ticket
1. Hacer clic en "Nuevo Ticket" en el header
2. Completar el formulario con:
   - Título y descripción
   - Solicitante y responsable asignado
   - Prioridad y etiquetas
3. Hacer clic en "Crear Ticket"

### Gestionar Estados
1. **Cambio rápido:** Hacer clic en el botón ↻ en la columna de estado
2. **Seleccionar nuevo estado** de los botones disponibles
3. **Agregar comentario** opcional
4. **Confirmar cambio**

### Ver Historial
1. Hacer clic en el botón de historial (📜) en la fila del ticket
2. Revisar todos los cambios de estado con timestamps
3. Ver comentarios asociados a cada cambio

### Filtrar y Buscar
1. **Búsqueda en tiempo real** en el campo de búsqueda
2. **Filtros por estado** usando los botones de colores
3. **Filtros por fecha** seleccionando rangos
4. **Filtros por etiquetas** haciendo clic en ellas
5. **Filtros por asignado** usando el dropdown

## 🎨 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Header principal
│   ├── TicketList.tsx  # Lista principal de tickets
│   ├── TicketRow.tsx   # Fila individual de ticket
│   ├── TicketForm.tsx  # Formulario de creación/edición
│   ├── StatusFilters.tsx # Filtros de estado
│   ├── QuickStatusChange.tsx # Cambio rápido de estado
│   └── TicketHistory.tsx # Historial de cambios
├── services/           # Lógica de negocio
│   └── ticketService.ts # Servicio de gestión de tickets
├── types/              # Definiciones TypeScript
│   └── index.ts        # Interfaces y tipos
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🔧 Personalización

### Agregar Nuevos Estados
1. Modificar el tipo `TicketStatus` en `src/types/index.ts`
2. Actualizar los componentes que usan estados
3. Agregar estilos CSS para los nuevos badges

### Modificar Campos de Ticket
1. Editar la interfaz `Ticket` en `src/types/index.ts`
2. Actualizar el formulario en `TicketForm.tsx`
3. Modificar la tabla en `TicketList.tsx`

### Cambiar Estilos
- Los estilos principales están en `src/index.css`
- Cada componente puede tener estilos inline para personalizaciones específicas
- El sistema usa CSS variables para colores principales

## 📊 Datos de Ejemplo

El sistema incluye tickets de ejemplo que se cargan automáticamente:
- Problema con sistema de login
- Solicitud de nueva funcionalidad
- Error en impresión de facturas

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Base de datos real (PostgreSQL, MongoDB)
- [ ] Notificaciones en tiempo real
- [ ] Sistema de archivos adjuntos
- [ ] Reportes y analytics
- [ ] API REST para integración
- [ ] Sistema de roles y permisos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema, crear un issue en el repositorio o contactar al equipo de desarrollo.
