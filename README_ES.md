# Generala Reloaded - Anotador con Reconocimiento de Voz

Una aplicación web moderna para anotar puntuaciones en el juego de dados **Generala** (también conocido como Yahtzee) con **reconocimiento de voz mejorado en español**.

## 🎯 Características Principales

### Reconocimiento de Voz Inteligente
- **Interpretación correcta de frases en español**: Entiende comandos como "cuatro al seis" (4 dados × 6 = 24 puntos)
- **Patrones soportados**:
  - `"cuatro al seis"` → Categoría 6, Puntuación: 24
  - `"tres cincos"` → Categoría 5, Puntuación: 15
  - `"dos al cuatro"` → Categoría 4, Puntuación: 8
  - `"escalera servida"` → Escalera, Puntuación: 25
  - `"full"` → Full, Puntuación: 30
  - `"poker"` → Poker, Puntuación: 40
  - `"generala"` → Generala, Puntuación: 50
  - `"doble generala"` → Doble Generala, Puntuación: 100
  - `"tachar seis"` → Marcar como 0 en la categoría 6

### Gestión de Partidas
- Agregar múltiples jugadores
- Tabla de puntuaciones en tiempo real
- Indicador de turno actual
- Seguimiento del líder
- Reinicio de partida con confirmación

### Interfaz Moderna
- Diseño oscuro profesional (tema Zinc/Emerald)
- Animaciones fluidas con Framer Motion
- Interfaz responsive para móvil y desktop
- Componentes UI accesibles con Radix UI

### Pruebas de Voz
- Página dedicada para probar el reconocimiento de voz
- Suite de pruebas con 20+ casos de prueba predefinidos
- Información de depuración detallada
- Pruebas manuales con entrada de texto
- Indicador de confianza para cada comando

## 🚀 Cómo Usar

### Iniciar una Partida
1. Abre la aplicación en tu navegador
2. Ingresa los nombres de los jugadores
3. Haz clic en "Comenzar Partida"

### Anotar Puntuaciones con Voz
1. Haz clic en el botón micrófono (verde) en la esquina inferior derecha
2. Di un comando en español, por ejemplo:
   - "cuatro al seis" (para anotar 4 dados en la categoría 6)
   - "escalera servida" (para anotar una escalera con bonificación)
   - "tachar tres" (para marcar 0 en la categoría 3)
3. La aplicación interpretará automáticamente tu comando y anotará la puntuación

### Anotar Puntuaciones Manualmente
1. Haz clic en una celda vacía en la tabla
2. Selecciona la cantidad de dados o la puntuación directa
3. La puntuación se anotará automáticamente

### Probar el Reconocimiento de Voz
1. En la pantalla inicial, haz clic en "Pruebas de Voz"
2. Prueba comandos manuales escribiendo en el campo de texto
3. O usa el botón "Usar Micrófono" para probar con voz
4. Ejecuta todas las pruebas para ver la precisión del reconocimiento

## 📋 Categorías y Puntuaciones

| Categoría | Descripción | Puntuación Mínima | Puntuación Máxima |
|-----------|-------------|-------------------|-------------------|
| 1-6 | Suma de dados del número | 0 | 30 |
| Escalera | 5 dados consecutivos | 20 | 25 (servida) |
| Full | 3 de un número + 2 de otro | 30 | 35 (servida) |
| Póker | 4 dados iguales | 40 | 45 (servida) |
| Generala | 5 dados iguales | 50 | 55 (servida) |
| Doble Gen. | 2 Generalas | 100 | 105 (servida) |

## 🎤 Ejemplos de Comandos de Voz

### Categorías Numéricas (1-6)
- "uno al seis" → 1 × 6 = 6 puntos en categoría 6
- "dos al cuatro" → 2 × 4 = 8 puntos en categoría 4
- "tres cincos" → 3 × 5 = 15 puntos en categoría 5
- "cuatro al seis" → 4 × 6 = 24 puntos en categoría 6
- "cinco doses" → 5 × 2 = 10 puntos en categoría 2

### Categorías Especiales
- "escalera" → 20 puntos
- "escalera servida" → 25 puntos
- "full" → 30 puntos
- "full servido" → 35 puntos
- "poker" → 40 puntos
- "poker servido" → 45 puntos
- "generala" → 50 puntos
- "generala servida" → 55 puntos
- "doble generala" → 100 puntos

### Tachar (Marcar como 0)
- "tachar uno" → 0 puntos en categoría 1
- "raya cinco" → 0 puntos en categoría 5

## 🔧 Requisitos Técnicos

- Navegador moderno con soporte para Web Speech API
- Micrófono conectado (para usar reconocimiento de voz)
- Conexión a internet
- Idioma del navegador: Español (Argentina recomendado)

### Navegadores Soportados
- Chrome/Chromium 25+
- Edge 79+
- Safari 14.1+ (iOS 14.5+)
- Opera 27+

## 📱 Instalación Local

```bash
# Clonar o descargar el proyecto
cd generala-app

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Ejecutar en producción
NODE_ENV=production node dist/index.js
```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Suite de Pruebas de Voz

La aplicación incluye una suite completa de pruebas para validar la precisión del reconocimiento de voz:

- **20+ casos de prueba** predefinidos
- **Pruebas manuales** con entrada de texto
- **Pruebas con micrófono** para validar en tiempo real
- **Información de depuración** detallada
- **Indicador de confianza** para cada comando

### Ejecutar Pruebas
1. Navega a la página "Pruebas de Voz" desde la pantalla inicial
2. Haz clic en "Ejecutar Todas" para correr todos los casos de prueba
3. Revisa los resultados y el porcentaje de éxito

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS 4 + Radix UI
- **Animaciones**: Framer Motion
- **Routing**: Wouter
- **Build Tool**: Vite
- **Backend**: Express.js
- **Speech Recognition**: Web Speech API

## 📝 Notas Importantes

1. **Idioma**: El reconocimiento de voz está configurado para español argentino (`es-AR`). Puedes cambiar el idioma en el código si lo necesitas.

2. **Permisos**: La aplicación requiere permiso para acceder al micrófono. Asegúrate de permitirlo cuando el navegador lo solicite.

3. **Precisión**: La precisión del reconocimiento de voz depende de:
   - Calidad del micrófono
   - Claridad de la pronunciación
   - Ruido de fondo
   - Acento regional

4. **Casos Especiales**: La aplicación maneja automáticamente variaciones comunes:
   - "vida" → "servida" (mishearing común)
   - "general" → "generala" (mishearing común)
   - Plurales: "seises", "cincos", "cuatros", etc.

## 🐛 Solución de Problemas

### El micrófono no funciona
- Verifica que el navegador tenga permiso para acceder al micrófono
- Recarga la página
- Intenta en otro navegador

### El reconocimiento de voz no entiende mis comandos
- Habla más claramente
- Reduce el ruido de fondo
- Usa los comandos exactos de los ejemplos
- Prueba la página "Pruebas de Voz" para validar

### La aplicación no carga
- Verifica tu conexión a internet
- Borra el caché del navegador
- Abre la consola del navegador (F12) para ver errores

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado con ❤️ para mejorar la experiencia de juego de Generala

---

¿Preguntas o sugerencias? ¡Abre un issue en el repositorio!
