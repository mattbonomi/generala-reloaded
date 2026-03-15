# ✅ Generala Reloaded - Configuración Final para Manus

## Tu Repositorio en GitHub

**URL**: https://github.com/mattbonomi/generala-reloaded

El repositorio contiene:
- ✅ Código fuente compilado
- ✅ Dockerfile optimizado
- ✅ Configuración de Manus
- ✅ Documentación completa
- ✅ Suite de pruebas de voz

## Paso 1: Conectar GitHub a Manus

### Opción A: Despliegue Automático (Recomendado)

1. **Ve a Manus Dashboard**: https://manus.im/dashboard
2. **Haz clic en "Nueva Aplicación"**
3. **Selecciona "GitHub"**
4. **Autoriza Manus para acceder a tu GitHub**
5. **Selecciona el repositorio**: `mattbonomi/generala-reloaded`
6. **Configura**:
   - Nombre: `generala-reloaded`
   - Rama: `main`
   - Comando de construcción: `pnpm install && pnpm build`
   - Comando de inicio: `NODE_ENV=production node dist/index.js`
   - Puerto: `3000`
7. **Haz clic en "Desplegar"**

### Opción B: Despliegue Manual con CLI

```bash
# 1. Instalar Manus CLI
npm install -g manus-cli

# 2. Autenticarse
manus login

# 3. Desplegar desde GitHub
manus deploy --github mattbonomi/generala-reloaded --name generala-reloaded --port 3000
```

## Paso 2: Verificar Despliegue

Una vez desplegado, tu aplicación estará en:

```
https://generala-reloaded.manus.app
```

Verifica:
- ✅ La página carga correctamente
- ✅ El reconocimiento de voz funciona
- ✅ Los botones responden

## Paso 3: Configurar Dominio Personalizado (Opcional)

Si tienes tu propio dominio:

```bash
# Agregar dominio
manus domain add generala-reloaded --domain tudominio.com

# Verificar DNS
manus domain verify generala-reloaded --domain tudominio.com
```

## Paso 4: Monitoreo y Mantenimiento

```bash
# Ver estado
manus status generala-reloaded

# Ver logs en tiempo real
manus logs generala-reloaded --follow

# Ver métricas
manus metrics generala-reloaded

# Reiniciar si es necesario
manus restart generala-reloaded
```

## Actualizar la Aplicación

Para actualizar la aplicación:

```bash
# 1. Hacer cambios locales
cd /path/to/generala-app
# ... hacer cambios ...

# 2. Commit y push
git add .
git commit -m "Descripción de cambios"
git push origin main

# 3. Manus detectará los cambios y desplegará automáticamente
```

## Características Incluidas

✅ **Reconocimiento de Voz en Español**
- Interpreta "cuatro al seis" → 4 × 6 = 24 puntos
- 20+ patrones soportados
- Sistema de confianza

✅ **Interfaz Moderna**
- Diseño responsive
- Animaciones fluidas
- Tema oscuro profesional

✅ **Funcionalidad Completa**
- Anotador de Generala
- Múltiples jugadores
- Página de pruebas de voz

✅ **Infraestructura Manus**
- SSL/HTTPS automático
- CDN global
- Auto-scaling
- Backups automáticos
- Monitoreo 24/7

## Comandos Rápidos

```bash
# Desplegar
manus deploy --github mattbonomi/generala-reloaded --name generala-reloaded --port 3000

# Ver estado
manus status generala-reloaded

# Ver logs
manus logs generala-reloaded --follow

# Escalar
manus scale generala-reloaded --instances 3

# Agregar dominio
manus domain add generala-reloaded --domain tudominio.com
```

## Soporte

- **Documentación Manus**: https://docs.manus.im
- **Comunidad**: https://community.manus.im
- **Soporte**: support@manus.im

## ¡Listo!

Tu aplicación Generala Reloaded está lista para ser un **sitio web permanente en Manus**.

### Próximos Pasos:
1. Ve a https://manus.im/dashboard
2. Conecta tu repositorio GitHub
3. Haz clic en "Desplegar"
4. ¡Tu aplicación estará disponible en `https://generala-reloaded.manus.app`!

---

**Versión**: 2.0.0  
**Repositorio**: https://github.com/mattbonomi/generala-reloaded  
**Estado**: ✅ Listo para despliegue permanente
