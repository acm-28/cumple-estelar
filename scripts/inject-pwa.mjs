// Inyecta los metadatos de la PWA en el HTML exportado por Expo.
//
// El export web de Expo usa output "single" (SPA), por lo que NO aplica `app/+html.tsx`
// ni permite añadir <link>/<meta> arbitrarios desde app.json. Este script parchea el
// dist/index.html generado para añadir el manifest, los iconos y el registro del service
// worker. Se ejecuta tras `expo export --platform web` (ver buildCommand en vercel.json).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const indexPath = resolve("dist", "index.html");
const MARKER = "<!-- pwa:injected -->";

if (!existsSync(indexPath)) {
  console.error(`[inject-pwa] No existe ${indexPath}. ¿Corriste 'expo export --platform web'?`);
  process.exit(1);
}

let html = readFileSync(indexPath, "utf8");

if (html.includes(MARKER)) {
  console.log("[inject-pwa] Ya estaba inyectado, nada que hacer.");
  process.exit(0);
}

const headTags = `${MARKER}
    <link rel="manifest" href="/manifest.json" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Cumple Estelar" />
    <meta name="application-name" content="Cumple Estelar" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/pwa-192x192.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function (err) {
            console.error('SW registration failed:', err);
          });
        });
      }
    </script>
  </head>`;

// idioma + tags en el <head>
html = html.replace('<html lang="en">', '<html lang="es">');
html = html.replace("</head>", headTags);

writeFileSync(indexPath, html, "utf8");
console.log("[inject-pwa] Metadatos PWA inyectados en dist/index.html");
