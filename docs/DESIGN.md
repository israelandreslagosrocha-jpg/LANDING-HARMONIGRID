# Sistema visual de HarmoniGrid

## Dirección

Music tech con tipografía editorial, color cítrico, nodos glossy y compases como sistema compositivo. El producto musical y el problema de perder una idea son el centro. Se evita la fotografía genérica y la saturación de tarjetas indistinguibles.

## Identidad

| Elemento                    | Uso                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------- |
| Verde #B8F21C               | Acciones sobre fondo oscuro, bloques de marca y acentos                                 |
| Negro #151711               | Texto, botones y secciones de exploración/cierre                                        |
| Blanco cálido #F7F8F2       | Fondo principal y espacio de lectura                                                    |
| Syne 700                    | Titulares expresivos, servida localmente                                                |
| Helvetica/Arial del sistema | Cuerpo e interfaz, sin descarga adicional                                               |
| Monospace del sistema       | Coordenadas, índices y pequeñas etiquetas musicales                                     |
| mark.svg                    | Interpretación vectorial del símbolo de seis esferas con conexiones, reflejos y volumen |
| favicon.svg                 | Versión simplificada para navegación y tamaños pequeños                                 |
| social.png                  | Vista previa al compartir, 1200 × 630; no se descarga en la lectura normal              |

El símbolo del hero ocupa un panel cítrico con órbitas y acordes flotantes. El degradado da volumen sin cargar una escena WebGL, vídeo o librería 3D. El SVG es un recurso de marca, no una captura de la app.

## Movimiento

- Entrada única de la H y flotación lenta de H/acordes mediante CSS.
- Scroll reveal progresivo con contenido visible como base; no se oculta la página esperando a JavaScript.
- Barras animadas únicamente en el acorde activo de la demo.
- Pausa global accesible en el header.
- Respeto de `prefers-reduced-motion`.
- Movimiento decorativo pausado al sacar el hero de pantalla o al ocultar la página.
- Sin bucle requestAnimationFrame, partículas, vídeos automáticos, efectos de cursor ni audio autoplay.

Se priorizan transformaciones y opacidad. El objetivo es mostrar identidad y reacción, sin añadir un coste continuo elevado al teléfono.

## Responsive y accesibilidad

Contenedores fluidos, tamaños tipográficos escalables y ajustes a 1100/850/600/360 px. Navegación móvil con estado accesible; demo en cuatro columnas grandes y dos en teléfono; selecciones con labels; botones nativos; FAQ con details/summary; foco visible; salto al contenido; feedback sonoro también expresado en texto.

Los textos pequeños son información secundaria de marca. Las acciones y el contenido que explican el producto conservan tamaños de lectura superiores. Las pruebas realizadas se registran en QA.md.

## Skills y herramientas

Se aplicó IA MarkeTIA para dirección comercial. Se investigaron recursos de diseño frontend, incluido [frontend-app-builder de OpenAI](https://github.com/openai/plugins/blob/main/plugins/build-web-apps/skills/frontend-app-builder/SKILL.md). No hace falta instalar un skill adicional ni conectar Figma para mantener esta implementación: el resultado se construye y comprueba con recursos propios, CSS/SVG y el navegador disponible.

ImageGen no fue necesario para la H: un recurso vectorial nativo permite escalar con poco peso, controlar reflejos y conservar coherencia entre favicon, hero, comunidad y social. No se modificaron las imágenes originales de referencia.
