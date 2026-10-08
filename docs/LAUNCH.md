# Lanzamiento e infraestructura

## Estado

Actualización del 7 de octubre de 2026: la landing está desplegada con GitHub Pages mediante `.github/workflows/ci.yml`. Cada push a `main` ejecuta formato, pruebas, build y auditoría antes de publicar `dist`. La ejecución inicial fue correcta: https://github.com/israelandreslagosrocha-jpg/LANDING-HARMONIGRID/actions/runs/37706758705.

`harmonigrid.com` está asociado al repositorio y GitHub confirmó DNS válido. Hostinger conserva los nameservers: cuatro registros A apuntan a 185.199.108.153, 185.199.109.153, 185.199.110.153 y 185.199.111.153; `www` apunta por CNAME a israelandreslagosrocha-jpg.github.io. La landing responde por HTTPS con certificado válido, y Enforce HTTPS está activado en Settings → Pages. Privacidad y JavaScript responden HTTP 200. El certificado de www y las redirecciones aún estaban propagándose en la última comprobación. La aplicación .app se montará después por decisión del propietario.

GitHub Pages no aplica las cabeceras configuradas en `vercel.json` ni `public/_headers`; esas configuraciones pertenecen a otros proveedores. Las verificaciones locales de cabeceras no describen las cabeceras de Pages.

El estado siguiente corresponde a la revisión previa al despliegue.

Implementación y build verificados; actualización aprobada para registrarse en `main` y `codex/landing-launch-update`. No se ha realizado despliegue ni cambio de DNS.

**Pendiente externo confirmado el 7 de octubre de 2026:** tanto harmonigrid.com como harmonigrid.app muestran estacionamiento de dominio en Hostinger. La landing no puede llevar a un editor activo en .app hasta conectar ese dominio. La aprobación del commit no sustituye esta conexión.

## Arquitectura

- `harmonigrid.com`: web pública estática, indexable, comercial.
- `harmonigrid.app`: producto independiente; alojamiento y ciclo de desarrollo propios.
- Instagram oficial: comunidad y contacto reales.
- No backend ni base de datos para la landing actual.

Se puede alojar la landing en una CDN sin coste de proceso permanente y sin API keys. HTML, CSS, fuentes y SVG se sirven localmente. No publicar el servidor Vite.

## Publicación por proveedor

### Vercel

Importar el repositorio oficial LANDING-HARMONIGRID, configurar Node 24 y asociar `harmonigrid.com`. `vercel.json` define build, directorio `dist` y cabeceras. El build genera el hash de CSP a partir del JSON-LD actual. Elegir dominio principal y configurar la redirección de www en el panel.

### Netlify

Importar el repositorio; `netlify.toml` define `npm run build`, `dist` y Node 24. `_headers` se genera dentro de `public` y se copia a `dist`. Asociar dominio y seguir los registros DNS que el panel indique. Netlify permite usar DNS externos: no es necesario transferir el dominio.

### Otro hosting o archivos de Hostinger

Ejecutar `npm ci && npm run check` y subir **el contenido de dist**, conservando los subdirectorios. Configurar HTTPS, página raíz y cabeceras equivalentes a `vercel.json`/`_headers`. Estos archivos no son interpretados automáticamente por cualquier servidor Apache/Nginx. No cambiar nameservers ni registros MX sin revisar el uso actual del dominio.

No se asume un proveedor contratado ni se publican valores DNS inventados. Cada proveedor entrega sus propios valores de verificación y conexión.

## Secuencia de publicación

1. Revisar la preview y aprobar el commit oficial.
2. Publicar el commit/push autorizado y conectar el repositorio al hosting elegido.
3. Confirmar que la aplicación está desplegada en su proveedor; conectar harmonigrid.app a ese producto.
4. Asociar harmonigrid.com al despliegue de la landing y aplicar los registros específicos del hosting.
5. Esperar verificación DNS/TLS; confirmar redirecciones HTTP→HTTPS y www→dominio principal.
6. Ejecutar `npm run check:domains`: debe detectar HarmoniGrid y no estacionamiento.
7. Entrar desde teléfono, probar “Ir a la app”, crear un proyecto real y volver a la landing. Comprobar rutas de privacidad, robots y sitemap.
8. Confirmar cabeceras HTTP en producción, incluyendo CSP. Validar social.png con un depurador de vista previa y registrar el sitemap en Search Console si la cuenta está disponible.
9. Lanzar los enlaces de Instagram cuando la app esté lista. No enviar una campaña a dominios estacionados.

## Seguridad

CSP de origen propio y hash del JSON-LD, sin código ejecutable inline. Se bloquean frames externos, objetos, formularios y conexiones. Cámara, micrófono, geolocalización y pagos deshabilitados por Permissions-Policy. HSTS inicial de un día, sin preload ni includeSubDomains; ampliar solo después de verificar el despliegue HTTPS.

Si se agrega una API o analítica, actualizar la CSP de forma explícita y probar; no abrir comodines ni introducir unsafe-inline. Si se cambia el JSON-LD, ejecutar build antes del commit para actualizar cabeceras.

## Backend: cuándo tendría sentido

| Necesidad                                    | Infraestructura adicional                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Presentar el producto y enlazar a la app     | Ninguna: la versión actual es estática                                                         |
| Newsletter o waitlist                        | Proveedor de email/formulario o función serverless con validación, rate limit, entrega y bajas |
| Contacto educativo                           | Formulario real o CRM; evitar almacenar datos de estudiantes si no es necesario                |
| Blog frecuente gestionado por otras personas | CMS o generación estática; no requiere necesariamente servidor propio                          |
| Analítica de conversiones                    | Herramienta de medición y ajustes de privacidad; no implica una base de datos propia           |
| Login, proyectos y pagos                     | Mantener dentro de la app, con su backend y políticas                                          |

No añadir Supabase a la landing solo por estar previsto en la app. Añadir backend cuando haya una función concreta y operación real para atenderla.

## Recuperación

Guardar el despliegue anterior en el proveedor. Ante una regresión, revertir la versión desplegada o crear un revert del commit autorizado. No borrar historial ni ramas para publicar esta landing. `dist` se regenera; no se versiona.
