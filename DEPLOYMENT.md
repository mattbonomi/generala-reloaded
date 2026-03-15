# Despliegue en Manus - Generala Reloaded

## Información del Sitio

- **Nombre**: Generala Reloaded
- **Descripción**: Anotador de Generala con reconocimiento de voz inteligente en español
- **Versión**: 2.0.0
- **Tipo**: Aplicación Web Node.js + React
- **Puerto**: 3000

## Requisitos Previos

- Cuenta en Manus
- Acceso a la consola de despliegue de Manus
- Git (para versionado)

## Pasos de Despliegue

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los cambios estén commiteados
git add .
git commit -m "Generala Reloaded v2.0.0 - Voice Recognition Ready"
```

### 2. Desplegar en Manus

Hay dos formas de desplegar:

#### Opción A: Usando Manus CLI

```bash
# Instalar Manus CLI (si no lo tienes)
npm install -g manus-cli

# Autenticarse
manus login

# Desplegar la aplicación
manus deploy --name generala-reloaded --port 3000
```

#### Opción B: Usando la Consola Web de Manus

1. Accede a https://manus.im/dashboard
2. Haz clic en "Crear Nueva Aplicación"
3. Selecciona "Node.js"
4. Configura los siguientes parámetros:
   - **Nombre**: generala-reloaded
   - **Puerto**: 3000
   - **Comando de construcción**: `pnpm install && pnpm build`
   - **Comando de inicio**: `NODE_ENV=production node dist/index.js`
5. Conecta tu repositorio Git
6. Haz clic en "Desplegar"

### 3. Configuración Post-Despliegue

Una vez desplegado, Manus te proporcionará:
- **URL Pública**: `https://generala-reloaded.manus.app` (o similar)
- **Dominio Personalizado**: Puedes configurar tu propio dominio

### 4. Verificar el Despliegue

```bash
# Verificar que la aplicación está corriendo
curl https://generala-reloaded.manus.app/

# Debería devolver el HTML de la aplicación
```

## Variables de Entorno

La aplicación está configurada para funcionar sin variables de entorno adicionales. Sin embargo, si necesitas agregar alguna:

```bash
# En la consola de Manus
manus env set NODE_ENV production
```

## Monitoreo y Mantenimiento

### Logs

```bash
# Ver logs en tiempo real
manus logs generala-reloaded --follow

# Ver últimos 100 logs
manus logs generala-reloaded --lines 100
```

### Reiniciar la Aplicación

```bash
manus restart generala-reloaded
```

### Actualizar la Aplicación

```bash
# Hacer cambios locales
git add .
git commit -m "Descripción de cambios"

# Desplegar cambios
manus deploy --name generala-reloaded
```

## Estructura de Archivos para Despliegue

```
generala-app/
├── client/
│   └── src/
│       ├── lib/
│       │   └── voiceProcessor.ts      # Motor de voz
│       ├── pages/
│       │   ├── Home.tsx               # Página principal
│       │   └── VoiceTest.tsx          # Página de pruebas
│       └── ...
├── server/
│   └── index.ts                       # Servidor Express
├── dist/                              # Compilado (generado)
│   ├── public/                        # Archivos estáticos
│   └── index.js                       # Servidor compilado
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
└── manus.config.json                  # Configuración de Manus
```

## Troubleshooting

### La aplicación no inicia

```bash
# Verificar logs
manus logs generala-reloaded --lines 50

# Verificar que el puerto 3000 está disponible
manus ps generala-reloaded
```

### Errores de compilación

```bash
# Limpiar caché y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Problemas de memoria

```bash
# Aumentar límite de memoria en Manus
manus config generala-reloaded --memory 512m
```

## Características de Manus Aprovechadas

1. **Hosting Permanente**: Tu aplicación estará disponible 24/7
2. **SSL/HTTPS**: Certificado SSL automático
3. **CDN Global**: Distribución automática a nivel mundial
4. **Auto-scaling**: Escalado automático según demanda
5. **Backups**: Copias de seguridad automáticas
6. **Monitoreo**: Monitoreo de uptime y performance

## Dominio Personalizado

Si tienes tu propio dominio:

```bash
# Configurar dominio personalizado
manus domain add generala-reloaded --domain tudominio.com

# Verificar DNS
manus domain verify generala-reloaded --domain tudominio.com
```

## Actualizaciones Futuras

Para desplegar nuevas versiones:

1. Realiza cambios locales
2. Incrementa la versión en `package.json`
3. Commit y push a tu repositorio
4. Ejecuta `manus deploy` nuevamente

## Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs: `manus logs generala-reloaded`
2. Verifica la configuración: `manus config generala-reloaded`
3. Contacta al soporte de Manus: support@manus.im

## Información de Contacto

- **Documentación**: https://docs.manus.im
- **Comunidad**: https://community.manus.im
- **Soporte**: support@manus.im

---

**Última actualización**: Marzo 2026
**Versión**: 2.0.0
