# Instrucciones de Instalación

## Prerrequisitos

Antes de ejecutar el sistema de helpdesk, necesitas instalar:

### 1. Node.js
- Descargar desde: https://nodejs.org/
- Instalar la versión LTS (recomendada)
- Verificar instalación: `node --version` y `npm --version`

### 2. Alternativa: Usar Node Version Manager (nvm)
```bash
# Windows (nvm-windows)
# Descargar desde: https://github.com/coreybutler/nvm-windows/releases

# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

## Instalación del Proyecto

1. **Clonar o descargar el proyecto**
2. **Abrir terminal en la carpeta del proyecto**
3. **Instalar dependencias:**
```bash
npm install
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

5. **Abrir navegador en:** http://localhost:3000

## Comandos Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción

## Solución de Problemas

### Error: "npm no se reconoce"
- Reinstalar Node.js
- Reiniciar terminal
- Verificar variables de entorno PATH

### Error: "Puerto 3000 en uso"
- Cambiar puerto en `vite.config.ts`
- O matar proceso que use el puerto

### Error: "Módulos no encontrados"
- Eliminar `node_modules` y `package-lock.json`
- Ejecutar `npm install` nuevamente

## Estructura de Archivos

```
helpdesk/
├── src/                 # Código fuente
├── package.json         # Dependencias
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
├── index.html           # Página principal
└── README.md            # Documentación
```

## Tecnologías

- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción
- **CSS** - Estilos personalizados
- **localStorage** - Persistencia de datos
