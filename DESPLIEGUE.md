# Guía de despliegue — PWA, Vercel y Play Store

**Cumple Estelar** es una app **Expo (SDK 54 / Expo Router)**. Para web se exporta como sitio
estático (`expo export --platform web` → `dist/`) y se le añadieron manifest + service worker
para que sea una **PWA instalable**. Desde la PWA se genera el paquete Android (TWA) para
Google Play con **PWABuilder**. Esta guía cubre los pasos manuales (hosting y publicación).

> A diferencia de la app nativa, esta web NO necesita ningún backend ni variables de entorno:
> es 100% estática.

---

## 0. Qué se añadió para la PWA

- `app.json` — nombre "Cumple Estelar", slug, `scheme`, `web.themeColor`/`backgroundColor`.
- `public/manifest.json` — Web App Manifest (iconos, `standalone`, colores).
- `public/sw.js` — service worker (offline app-shell + cache de assets).
- `public/pwa-*.png`, `apple-touch-icon.png`, `favicon-32x32.png` — iconos PWA.
- `app/+html.tsx` — inyecta `<link rel="manifest">`, `theme-color`, iconos y registra el SW.
- `app/_layout.tsx` — componente `<Analytics />` de `@vercel/analytics/react` (solo web).
- `vercel.json` — build estático + rewrite SPA que respeta `/.well-known/` y los assets.

El service worker y el manifest solo afectan a la web. El build nativo (iOS/Android con Expo)
sigue funcionando igual.

## 1. Build local (opcional, para verificar)

```bash
npx expo export --platform web      # genera dist/
npx serve dist                      # sirve en http://localhost:3000
```

En Chrome de escritorio → DevTools:
- **Application → Manifest**: debe verse "Cumple Estelar" con sus iconos, sin errores.
- **Application → Service Workers**: debe aparecer activado ("activated").
- **Lighthouse → PWA**: "installable".

## 2. Desplegar en Vercel (gratis, HTTPS)

Opción rápida sin Git:

```bash
npm i -g vercel
vercel login          # en esta terminal puedes usar:  ! vercel login
vercel                # primer deploy de prueba (preview)
vercel --prod         # producción → te da la URL https://<proyecto>.vercel.app
```

Vercel usa la config de `vercel.json` (build `expo export --platform web`, salida `dist/`).
No hace falta configurar variables de entorno.

> Recomendado a futuro: conectar el repo de GitHub en vercel.com ("Import Project") para
> deploys automáticos en cada push.

## 3. Activar la analítica (Vercel Web Analytics)

1. Abre el proyecto en **vercel.com → pestaña Analytics**.
2. Pulsa **Enable** en *Web Analytics* (plan Hobby/free).
3. El código ya está integrado (`inject()` en `app/_layout.tsx`, solo web).

## 4. Generar la app Android para Play Store (PWABuilder / TWA)

1. Entra a **https://www.pwabuilder.com** y pega tu URL `https://<proyecto>.vercel.app`.
2. Revisa que el reporte marque OK el **Manifest** y el **Service Worker**.
3. Pulsa **Package For Stores → Android → Google Play**.
4. Descarga el `.zip`. Contiene:
   - `app-release-bundle.aab` → **esto es lo que subes a Play**.
   - `signing.keystore` (+ contraseñas) → **GUÁRDALO con cuidado**: lo necesitarás para TODA
     futura actualización. Si lo pierdes, no podrás actualizar la app.
   - `assetlinks.json` → para el paso 5.

## 5. Verificar el dominio (Digital Asset Links)

Para que la app abra **sin la barra del navegador**:

1. Copia el `assetlinks.json` de PWABuilder a:
   `public/.well-known/assetlinks.json`
2. Redeploy: `vercel --prod`
3. Comprueba que quede accesible:
   ```bash
   curl https://<proyecto>.vercel.app/.well-known/assetlinks.json
   ```
   Debe devolver el JSON. (El `vercel.json` ya está configurado para no reescribir
   `/.well-known/`.)

## 6. Publicar en Google Play Console

Con tu cuenta de desarrollador:

1. **Crear app** → nombre "Cumple Estelar", idioma español.
2. **Ficha de Play**: descripción, icono 512×512 (usa `public/pwa-512x512.png`), capturas
   (2-3 del teléfono), categoría.
3. **Política de privacidad** (obligatoria, más aún por usar analítica): publica una URL con
   una política simple.
4. Subir el **`.aab`** en *Testing interno* primero para probarlo en tu teléfono.
5. Cuando funcione → promover a **Producción** y enviar a revisión.
