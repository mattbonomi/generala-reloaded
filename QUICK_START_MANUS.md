# Guía Rápida - Despliegue en Manus

## 🚀 Desplegar en 3 Pasos

### Paso 1: Preparar el Proyecto

```bash
# Clonar o descargar el proyecto
cd generala-app

# Ejecutar el script de despliegue
./deploy.sh generala-reloaded
```

### Paso 2: Crear Cuenta en Manus (si no tienes)

Visita: https://manus.im/signup

### Paso 3: Desplegar en Manus

Elige una de estas opciones:

#### **Opción A: Manus CLI (Recomendado)**

```bash
# Instalar Manus CLI
npm install -g manus-cli

# Autenticarse
manus login

# Desplegar
manus deploy --name generala-reloaded --port 3000
```

#### **Opción B: Git Push (Más Simple)

```bash
# Configurar remoto de Manus
git remote add manus https://git.manus.io/generala-reloaded.git

# Hacer push
git push manus main
```

#### **Opción C: Interfaz Web de Manus**

1. Ve a https://manus.im/dashboard
2. Haz clic en "Nueva Aplicación"
3. Selecciona "Node.js"
4. Conecta tu repositorio GitHub
5. Haz clic en "Desplegar"

## ✅ Verificar el Despliegue

Una vez desplegado, tu aplicación estará disponible en:

```
https://generala-reloaded.manus.app
```

O en tu dominio personalizado si lo configuraste.

## 📊 Características Incluidas

✅ Reconocimiento de voz en español  
✅ Anotador de Generala completo  
✅ Interfaz responsive  
✅ Suite de pruebas de voz  
✅ SSL/HTTPS automático  
✅ CDN global  
✅ Auto-scaling  
✅ Monitoreo 24/7  

## 🔧 Comandos Útiles

```bash
# Ver estado de la aplicación
manus status generala-reloaded

# Ver logs en tiempo real
manus logs generala-reloaded --follow

# Reiniciar la aplicación
manus restart generala-reloaded

# Ver métricas
manus metrics generala-reloaded

# Escalar la aplicación
manus scale generala-reloaded --instances 3
```

## 📝 Variables de Entorno

La aplicación funciona sin variables de entorno adicionales, pero puedes agregar algunas si lo necesitas:

```bash
# Establecer variable de entorno
manus env set NODE_ENV production

# Ver todas las variables
manus env list generala-reloaded
```

## 🌐 Dominio Personalizado

```bash
# Agregar tu dominio
manus domain add generala-reloaded --domain tudominio.com

# Verificar DNS
manus domain verify generala-reloaded --domain tudominio.com
```

## 🆘 Solución de Problemas

### La aplicación no inicia

```bash
# Ver logs detallados
manus logs generala-reloaded --lines 100

# Reiniciar
manus restart generala-reloaded
```

### Errores de compilación

```bash
# Limpiar y reconstruir
rm -rf node_modules dist
pnpm install
pnpm build
```

### Problemas de memoria

```bash
# Aumentar memoria
manus config generala-reloaded --memory 1gb
```

## 📚 Documentación Completa

- **Despliegue detallado**: Ver `DEPLOYMENT.md`
- **Cambios realizados**: Ver `CAMBIOS.md`
- **Documentación de uso**: Ver `README_ES.md`

## 🎯 URL de Acceso

Una vez desplegado, la aplicación estará disponible en:

| Servicio | URL |
|----------|-----|
| Aplicación Principal | https://generala-reloaded.manus.app |
| Panel de Control | https://manus.im/dashboard |
| Documentación | https://docs.manus.im |

## 💡 Tips

1. **Monitoreo**: Usa `manus metrics` para ver el rendimiento en tiempo real
2. **Actualizaciones**: Simplemente haz push a tu repositorio para actualizar
3. **Backups**: Manus realiza backups automáticos diarios
4. **Soporte**: Contacta a support@manus.im si tienes problemas

## ✨ ¡Listo!

Tu aplicación Generala Reloaded está lista para ser usada por millones de jugadores. 

¡Que disfrutes! 🎲

---

**Versión**: 2.0.0  
**Última actualización**: Marzo 2026
