#!/bin/bash

# Script de despliegue para Generala Reloaded en Manus
# Uso: ./deploy.sh [app-name]

set -e

APP_NAME=${1:-"generala-reloaded"}
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')

echo "========================================="
echo "Despliegue de Generala Reloaded v$VERSION"
echo "========================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    echo "Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que tenemos las herramientas necesarias
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm no está instalado"
    echo "Instálalo con: npm install -g pnpm"
    exit 1
fi

echo "✓ Verificaciones previas completadas"
echo ""

# Paso 1: Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install
echo "✓ Dependencias instaladas"
echo ""

# Paso 2: Compilar la aplicación
echo "🔨 Compilando la aplicación..."
pnpm build
echo "✓ Compilación completada"
echo ""

# Paso 3: Verificar que la compilación fue exitosa
if [ ! -d "dist" ]; then
    echo "❌ Error: La compilación no generó el directorio dist"
    exit 1
fi

echo "✓ Archivos compilados verificados"
echo ""

# Paso 4: Información de despliegue
echo "========================================="
echo "Información de Despliegue"
echo "========================================="
echo "Nombre de la aplicación: $APP_NAME"
echo "Versión: $VERSION"
echo "Puerto: 3000"
echo "Entorno: production"
echo ""

# Paso 5: Instrucciones para desplegar en Manus
echo "========================================="
echo "Próximos Pasos"
echo "========================================="
echo ""
echo "1. Asegúrate de tener una cuenta en Manus: https://manus.im"
echo ""
echo "2. Opción A - Desplegar con Manus CLI:"
echo "   $ manus deploy --name $APP_NAME --port 3000"
echo ""
echo "3. Opción B - Desplegar con Git:"
echo "   $ git add ."
echo "   $ git commit -m 'Generala Reloaded v$VERSION'"
echo "   $ git push manus main"
echo ""
echo "4. Opción C - Desplegar con Docker:"
echo "   $ docker build -t $APP_NAME:$VERSION ."
echo "   $ docker push manus.io/$APP_NAME:$VERSION"
echo ""
echo "========================================="
echo "✅ Aplicación lista para desplegar"
echo "========================================="
