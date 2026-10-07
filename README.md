# HarmoniGrid · sitio de presentación

Landing comercial independiente de la aplicación. Presenta el concepto, permite explorar una progresión y conduce a `https://harmonigrid.app/`. La comunidad oficial es [@harmonigrid](https://www.instagram.com/harmonigrid/).

## Desarrollo

Node.js 24 (ver `.nvmrc`), npm y ningún servicio externo obligatorio.

```sh
npm ci
npm run dev
```

Servidor local: `http://127.0.0.1:3000`. Solo escucha en loopback.

```sh
npm run check
npm run preview
npm audit
npm run check:domains
```

`check` ejecuta pruebas y compila. `preview` muestra `dist` en `http://127.0.0.1:4173` con las cabeceras de seguridad configuradas para producción. `check:domains` verifica estado HTTP, marca y ausencia de páginas de estacionamiento; requiere red y devuelve error mientras los dominios estén estacionados.

## Organización

- `index.html`: contenido comercial, navegación, demo y metadatos SEO.
- `css/site.css`: diseño, componentes, breakpoints y preferencias de movimiento.
- `js/app.js`: menú, controles, demo y ciclo de vida de la página.
- `js/audio.js`: síntesis Web Audio con voces de duración finita.
- `js/harmony.js`: contenido musical y transposición de la demo.
- `public/`: recursos propios, privacidad, robots y sitemap.
- `scripts/prepare-site.mjs`: genera CSP y cabeceras de hosting, copia la hoja de estilos de privacidad. Se ejecuta antes de tests/build.
- `tests/`: integridad de navegación, seguridad estática, recursos y coherencia musical.
- `docs/`: auditoría, decisiones de marca, estrategia y procedimiento de lanzamiento.

La landing no usa backend, formularios, cookies propias, almacenamiento local ni trackers. No contiene secretos ni claves API. La demo es conceptual y no reemplaza el editor de la app.

## Publicación

Se publica **el contenido de `dist/` en la raíz de harmonigrid.com**. Hay configuración para Vercel y Netlify. No se publica `node_modules`, el código de desarrollo ni un servidor Vite.

Leer [procedimiento de lanzamiento](docs/LAUNCH.md). **El 7 de octubre de 2026 ambos dominios mostraban la página de estacionamiento de Hostinger.** Conectar la landing y la aplicación a sus dominios es un requisito de lanzamiento adicional a aprobar el commit.

La actualización se registra en `main` y en `codex/landing-launch-update`. La publicación y conexión de dominios se realizan por separado. La versión anterior está disponible en el historial de Git.

## Documentación

- [Auditoría y decisiones](docs/AUDIT.md)
- [Sistema visual](docs/DESIGN.md)
- [Estrategia comercial y comunidad](docs/MARKETING.md)
- [Lanzamiento e infraestructura](docs/LAUNCH.md)
- [Comprobaciones y límites](docs/QA.md)

## Tipografía

Syne 700 se sirve localmente. Licencia SIL Open Font License en `public/brand/Syne-OFL.txt`. El símbolo SVG es una interpretación vectorial ligera de la H con seis esferas del material de referencia; el arte raster original no se modifica.
