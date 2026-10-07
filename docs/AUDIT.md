# Auditoría de la landing

Fecha: 7 de octubre de 2026. Alcance: repositorio LANDING-HARMONIGRID, recursos públicos, conversaciones compartidas y destinos oficiales. No incluye auditoría del código, cuentas ni datos de la aplicación.

## Hallazgos y resolución

| Hallazgo anterior                                                        | Impacto                                                                                                                 | Resolución                                                                                                                 |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Formularios anunciaban éxito aunque solo guardaban datos en localStorage | Mensajes y suscripciones no llegaban al propietario; acumulación de datos personales en el navegador                    | Retirado el envío ficticio. Canal real: Instagram oficial. Sin recogida de datos en la landing                             |
| JSON.parse y escrituras de almacenamiento sin recuperación de errores    | La UI podía fallar con datos inválidos, cuota agotada o restricciones del navegador                                     | El funcionamiento actual no depende de almacenamiento local                                                                |
| “2.500 miembros”, logros, desafíos y porcentajes sin evidencia           | Deterioro de confianza y promesas comerciales no respaldadas                                                            | Retirados; no se publican métricas ficticias                                                                               |
| USD 8 y 14 días de prueba tratados como oferta vigente                   | Las conversaciones identificaban el precio como hipótesis y una prueba de 7 días; el estado actual no se pudo verificar | No se publica precio ni trial hasta que estén activos y confirmados en el producto                                         |
| Enlaces `#` para blog, recursos, redes, términos y roadmap               | Navegación sin resultado y falsa apariencia de secciones existentes                                                     | Todos los enlaces internos apuntan a secciones reales; privacidad publicada y redes enlazadas correctamente                |
| Roadmap con hitos Q2/Q3 2026 sin verificación                            | Fechas vencidas y funcionalidades futuras presentadas como actuales                                                     | Eliminada la promesa fechada. Novedades a través del canal oficial                                                         |
| Enlaces a app.harmonigrid.com                                            | Arquitectura antigua respecto a la solicitud actual                                                                     | CTA “Ir a la app” apunta a harmonigrid.app                                                                                 |
| Vite 5 y ausencia de comprobaciones                                      | Dependencias antiguas y mayor riesgo de regresiones                                                                     | Vite 8.3.3, Node 24, lockfile actualizado, CI, auditoría npm sin avisos conocidos al verificar                             |
| Ausencia de CSP y otras cabeceras                                        | Menor defensa frente a ejecución no autorizada, framing y detección de tipos                                            | CSP sin unsafe-inline/unsafe-eval, hash del JSON-LD, bloqueo de objetos, formularios y conexiones; cabeceras adicionales   |
| Audio sin final automático garantizado en cada voz                       | Sonido sostenido innecesario y gestión incompleta del ciclo de vida                                                     | Envolvente finita, stop/disconnect, mute, cancelación al ocultar o salir de la página                                      |
| Menú móvil sin estado accesible ni cierre con Escape                     | Dificultades de teclado y lectores de pantalla                                                                          | aria-expanded/controls, etiquetas de estado, Escape con recuperación de foco, cierre por enlace y clic exterior            |
| Recursos y fuentes remotos                                               | Dependencia de disponibilidad de terceros y peticiones externas                                                         | Fuente local, SVG propios y PNG social local                                                                               |
| Hreflang para seis idiomas sobre el mismo contenido dinámico             | Indexación y mensajes comerciales difíciles de mantener consistentes                                                    | Lanzamiento en español, canonical único. Retiradas traducciones anteriores que heredaban precios y promesas no confirmadas |

## Decisiones de alcance

Esta web presenta **captura y organización armónica**. La demo demuestra tríadas, séptimas, transposición y grados; no se disfraza de captura real del editor. La diferencia está indicada junto a la demo.

Las funciones avanzadas de la app —métricas irregulares, PDF, letras, autosave, MIDI, asistentes, colaboración y límites FREE/PRO— aparecían en conversaciones con distintos estados de madurez. Sin un inventario actualizado del producto ni acceso a una app activa en su dominio, no se afirma que todas estén disponibles. Antes de añadirlas al sitio, comprobar cada una en el editor y documentar en qué plan existe.

El diseño conserva el verde cítrico, negro, blanco y la H con seis nodos. Se simplificó el proyecto a HTML/CSS/JavaScript modular: cero dependencias en el navegador y sin necesidad de framework o backend para esta función.

## Riesgos que siguen abiertos

1. **Dominios estacionados:** harmonigrid.com y harmonigrid.app devolvían HTTP 200 con título “Parked Domain name on Hostinger DNS system”. HTTP 200 no significa que el producto esté publicado. Es necesario conectar cada dominio a su sitio.
2. **Alojamiento no confirmado:** Vercel/Netlify están preparados; no se modificó una cuenta de hosting. En otro proveedor hay que aplicar las cabeceras equivalentes. Subir a GitHub Pages por sí solo no aplica esas políticas HTTP.
3. **Producto y planes:** verificar manualmente el editor activo antes del lanzamiento y mantener la landing sincronizada con sus capacidades reales.
4. **Auditoría limitada al frontend:** npm audit identifica avisos publicados; no garantiza ausencia absoluta de vulnerabilidades. No se hicieron pruebas invasivas sobre terceros.
5. **Dispositivos reales:** se verificaron distintos viewports en navegador. Quedan pruebas físicas recomendadas en Safari iOS y Android; no se declara certificación WCAG ni métricas Core Web Vitals de producción.

La auditoría y las mejoras no incluyeron publicación, cambios DNS, cobros ni compras de créditos. La actualización fue aprobada para registrarse en `main` y `codex/landing-launch-update`.

## Fuentes técnicas

- [OWASP: Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [web.dev: Animations and performance](https://web.dev/articles/animations-and-performance/)
- [Vite: requisitos actuales de Node](https://vite.dev/guide/)
- [Vite: migración a la versión 8](https://vite.dev/guide/migration)
