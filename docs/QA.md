# Validación y límites

Revisión del 7 de octubre de 2026. Se verificó la compilación de producción en `http://127.0.0.1:4173/`, incluyendo las cabeceras de seguridad de `vercel.json`.

## Comprobaciones automáticas

- `npm run check`: formato, nueve pruebas y build correctos.
- Pruebas: enlaces internos y destinos; ausencia de formularios falsos y almacenamiento de datos; landmarks y controles accesibles; hash CSP del JSON-LD; recursos locales y presupuesto de imagen/fuente; privacidad; intervalos de séptima, transposición en cuatro tonalidades y aislamiento de datos musicales.
- `npm audit`: cero vulnerabilidades conocidas en el conjunto de dependencias instalado.
- `git diff --check`: sin errores de whitespace.
- El JSON-LD del archivo compilado coincide con el hash autorizado por la CSP.
- Respuesta HTTP de la preview: CSP, nosniff, DENY, Referrer-Policy, Permissions-Policy y HSTS presentes.

Estos checks no constituyen una certificación integral de seguridad ni una auditoría WCAG automatizada completa.

## Responsive en navegador

Se verificaron títulos, controles de la demo, grados y séptimas. En cada tamaño se comprobó que el documento no excediera su ancho disponible y que los textos de estos controles no desbordaran.

| Ancho del viewport | Resultado           |
| -----------------: | ------------------- |
|             320 px | Sin desbordamientos |
|             375 px | Sin desbordamientos |
|             390 px | Sin desbordamientos |
|             600 px | Sin desbordamientos |
|             768 px | Sin desbordamientos |
|             850 px | Sin desbordamientos |
|            1024 px | Sin desbordamientos |
|            1440 px | Sin desbordamientos |
|            1920 px | Sin desbordamientos |

La barra de scroll del navegador reduce el área útil aproximadamente 15 px; se tomó en cuenta ese ancho real. Las formas decorativas pueden extenderse dentro de sus contenedores recortados sin generar scroll horizontal.

## Interacción verificada

- Menú móvil abre, informa su estado y cierra con Escape recuperando el foco.
- El enlace “Explorar una idea” lleva a la demo.
- Cambio de tonalidad a Re/Fa y alternancia acordes/grados.
- Tríadas → séptimas: Cmaj7–Am7–Fmaj7–G7; en Fa: Fmaj7–Dm7–B♭maj7–C7.
- Un acorde actualiza el feedback en texto.
- Silencio mantiene la exploración visual y comunica su estado.
- Reproducción y detención de la secuencia, con voces finitas.
- Pausa global de animaciones e icono/etiqueta de estado.
- FAQ abre mediante un control nativo.
- Privacidad carga su hoja de estilos y permite volver a la landing.
- Sin errores de consola de la versión compilada durante estas pruebas. Los avisos de la antigua sesión Vite 5 tras actualizar sus paquetes pertenecían al servidor de desarrollo anterior; se detuvo ese proceso y no aparecen en la build.

## Peso

La compilación final informa aproximadamente:

| Recurso        | Tamaño sin comprimir |    gzip |
| -------------- | -------------------: | ------: |
| HTML principal |             29.11 KB | 6.76 KB |
| CSS principal  |             27.39 KB | 6.81 KB |
| JavaScript     |              6.57 KB | 2.70 KB |

El código principal suma **16.27 KB gzip**, más la fuente local (52.7 KB sin comprimir), el símbolo SVG y el favicon. El PNG de vista previa social pesa aproximadamente 80 KB y no se carga en la navegación normal. No hay vídeo, librería 3D ni dependencias de frontend descargadas por el visitante.

No se asigna una puntuación Lighthouse ni se afirman Core Web Vitals de producción. LCP/INP/CLS reales deberán medirse después de desplegar y con condiciones de red/dispositivo representativas.

## Evidencia visual

- [Desktop](screenshots/desktop.jpg)
- [Teléfono](screenshots/mobile.jpg)
- [Demo desktop](screenshots/demo.jpg)
- [Demo teléfono](screenshots/mobile-demo.jpg)

## Pendientes de lanzamiento

`npm run check:domains` falla de forma esperada: los dos dominios devuelven HTTP 200 con título de estacionamiento de Hostinger. Este control evita declarar accesible una app que todavía no está conectada.

No se probaron funcionalidades internas de la aplicación ni se modificó su infraestructura. Recomendadas pruebas físicas en Safari/iOS y Android y una verificación de end-to-end en la app activa antes de promover la campaña. El hosting público, DNS/TLS y las cabeceras definitivas deben comprobarse después de conectar los dominios.
