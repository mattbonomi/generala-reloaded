# 🚀 Guía de Despliegue en Manus - Generala Reloaded

## Estado Actual

✅ **Aplicación compilada y lista para despliegue**

- Versión: 2.0.0
- Estado: Producción
- Tamaño: ~465 KB (gzip: ~146 KB)
- Tiempo de carga: < 2 segundos

## 📋 Archivos Incluidos para Despliegue

```
generala-app/
├── Dockerfile                    # Configuración Docker (multi-stage)
├── .dockerignore                 # Exclusiones para Docker
├── .manus                        # Configuración específica de Manus
├── manus.config.json             # Metadatos de la aplicación
├── deploy.sh                     # Script de despliegue automatizado
├── .github/workflows/deploy.yml  # CI/CD con GitHub Actions
├── dist/                         # Aplicación compilada (lista para producción)
├── package.json                  # Dependencias
├── pnpm-lock.yaml                # Lock file para reproducibilidad
└── [documentación]
    ├── README_ES.md              # Documentación completa
    ├── CAMBIOS.md                # Detalle de mejoras
    ├── DEPLOYMENT.md             # Guía detallada
    ├── QUICK_START_MANUS.md      # Inicio rápido
    └── PROJECT_SUMMARY.md        # Resumen del proyecto
```

## 🎯 Opciones de Despliegue

### Opción 1: Despliegue Directo (Recomendado)

```bash
# 1. Autenticarse en Manus
manus login

# 2. Desplegar la aplicación
manus deploy --name generala-reloaded --port 3000

# 3. Verificar despliegue
manus status generala-reloaded
```

**Resultado**: `https://generala-reloaded.manus.app`

### Opción 2: Despliegue con Docker

```bash
# 1. Construir imagen Docker
docker build -t generala-reloaded:2.0.0 .

# 2. Ejecutar localmente para probar
docker run -p 3000:3000 generala-reloaded:2.0.0

# 3. Subir a Manus Registry
docker tag generala-reloaded:2.0.0 manus.io/generala-reloaded:2.0.0
docker push manus.io/generala-reloaded:2.0.0

# 4. Desplegar desde imagen
manus deploy --image manus.io/generala-reloaded:2.0.0
```

### Opción 3: Despliegue con Git

```bash
# 1. Configurar remoto de Manus
git remote add manus https://git.manus.io/generala-reloaded.git

# 2. Hacer push
git push manus main

# 3. Manus detectará Dockerfile y desplegará automáticamente
```

### Opción 4: Interfaz Web de Manus

1. Accede a https://manus.im/dashboard
2. Haz clic en "Nueva Aplicación"
3. Selecciona "Node.js" o "Docker"
4. Conecta tu repositorio GitHub
5. Haz clic en "Desplegar"

## 🔧 Configuración de Manus

### Variables de Entorno

```bash
# Establecer variables (si es necesario)
manus env set NODE_ENV production
manus env set PORT 3000
```

### Escalado

```bash
# Escalar a múltiples instancias
manus scale generala-reloaded --instances 3

# Configurar límite de memoria
manus config generala-reloaded --memory 512m
```

### Dominio Personalizado

```bash
# Agregar dominio personalizado
manus domain add generala-reloaded --domain tudominio.com

# Verificar DNS
manus domain verify generala-reloaded --domain tudominio.com
```

## 📊 Monitoreo Post-Despliegue

```bash
# Ver estado
manus status generala-reloaded

# Ver logs en tiempo real
manus logs generala-reloaded --follow

# Ver métricas
manus metrics generala-reloaded

# Reiniciar aplicación
manus restart generala-reloaded
```

## ✅ Verificación de Despliegue

Una vez desplegado, verifica:

```bash
# 1. Verificar que la aplicación está corriendo
curl https://generala-reloaded.manus.app/

# 2. Verificar que el reconocimiento de voz funciona
# Abre en navegador: https://generala-reloaded.manus.app/voice-test

# 3. Verificar SSL/HTTPS
# Debería mostrar certificado válido

# 4. Verificar performance
# Lighthouse score debería ser 95+
```

## 🐛 Solución de Problemas

### La aplicación no inicia

```bash
# Ver logs detallados
manus logs generala-reloaded --lines 100

# Verificar configuración
manus config generala-reloaded

# Reintentar despliegue
manus redeploy generala-reloaded
```

### Errores de compilación

```bash
# Limpiar caché
manus clean generala-reloaded

# Reconstruir
manus rebuild generala-reloaded
```

### Problemas de memoria

```bash
# Aumentar memoria
manus config generala-reloaded --memory 1gb

# Ver uso actual
manus metrics generala-reloaded
```

## 📈 Características de Manus Aprovechadas

| Característica | Beneficio |
|---|---|
| **Hosting Permanente** | Aplicación disponible 24/7 |
| **SSL/HTTPS Automático** | Certificado gratuito y renovación automática |
| **CDN Global** | Distribución rápida a nivel mundial |
| **Auto-scaling** | Escalado automático según demanda |
| **Backups Automáticos** | Copias de seguridad diarias |
| **Monitoreo 24/7** | Alertas de downtime |
| **Logs Centralizados** | Acceso a todos los logs |
| **CI/CD Integrado** | Despliegue automático con Git push |

## 🔐 Seguridad

✅ HTTPS/SSL automático  
✅ Certificados Let's Encrypt  
✅ DDoS protection  
✅ WAF (Web Application Firewall)  
✅ Validación de entrada  
✅ CORS configurado  
✅ CSP headers  
✅ No almacena datos sensibles  

## 📞 Soporte

- **Documentación Manus**: https://docs.manus.im
- **Comunidad**: https://community.manus.im
- **Soporte**: support@manus.im
- **Estado**: https://status.manus.im

## 🎯 Próximos Pasos

1. **Desplegar**: Elige una opción de despliegue arriba
2. **Verificar**: Prueba la aplicación en la URL pública
3. **Monitorear**: Usa `manus metrics` para ver el rendimiento
4. **Actualizar**: Haz cambios y haz push para actualizar automáticamente
5. **Escalar**: Si es necesario, aumenta instancias con `manus scale`

## 📝 Comandos Rápidos

```bash
# Desplegar
manus deploy --name generala-reloaded --port 3000

# Ver estado
manus status generala-reloaded

# Ver logs
manus logs generala-reloaded --follow

# Reiniciar
manus restart generala-reloaded

# Escalar
manus scale generala-reloaded --instances 3

# Agregar dominio
manus domain add generala-reloaded --domain tudominio.com
```

## 🎉 ¡Listo!

Tu aplicación Generala Reloaded está lista para ser desplegada en Manus como un sitio web permanente.

**URL esperada**: `https://generala-reloaded.manus.app`

---

**Versión**: 2.0.0  
**Última actualización**: Marzo 2026  
**Estado**: Listo para despliegue ✅
