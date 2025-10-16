/*import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  //const distFolder = join(process.cwd(), 'dist/Intranet/browser');       //LOCAL
  const distFolder = join(process.cwd(), 'Intranet/browser');              //DEV - PRD

  //const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const indexHtml = 'index.html';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  //const port = process.env.PORT || 4000;              //? PUERTO ECOMMERCE        - 10.45 - 4000
  //const port = process.env.PORT || 4003;              //? PUERTO ECOMMERCE QA     - 10.30 - 4003
  const port = process.env.PORT || 4005;                //? PUERTO INTRANET PRD     - 10.45 - 4005
  //const port = process.env.PORT || 4005;              //? PUERTO INTRANET QA      - 10.30 - 4005
  //const port = process.env.PORT || 4003;              //? PUERTO AUTOSERVICIO PRD - 10.45 - 4003
  //const port = process.env.PORT || 4000;              //? PUERTO AUTOSERVICIO QA  - 10.30 - 4000
  //const port = process.env.PORT || 4007;              //? PUERTO TRAVELSCREENS QA  - 10.30 - 4007

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';*/

import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as compression from 'compression';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';

// 🧠 Caché en memoria simple para render SSR
const ssrCache = new Map<string, string>();

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'Intranet/browser');
  const indexHtml = 'index.html';

  // ✅ Compresión GZIP
  server.use(compression());

  // ✅ Motor de render SSR
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // ✅ Archivos estáticos con caché agresiva
  server.use(express.static(distFolder, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    }
  }));

  // ✅ SSR con caché de páginas ya renderizadas
  server.get('*', (req, res) => {
    const url = req.originalUrl;

    // Omitir APIs u otros endpoints
    if (url.startsWith('/api')) {
      return res.status(404).send('API route not handled here.');
    }

    // 🔹 Cache SSR
    if (ssrCache.has(url)) {
      return res.send(ssrCache.get(url));
    }

    const t0 = Date.now();

    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] }, (err, html) => {
      if (err) {
        console.error(`❌ SSR error for ${url}:`, err);
        return res.status(500).send('Server error');
      }

      const time = Date.now() - t0;
      console.log(`✅ SSR rendered ${url} in ${time}ms`);

      // Cachear solo páginas pequeñas (<1MB)
      if (html && html.length < 1_000_000) {
        ssrCache.set(url, html);
      }

      res.send(html);
    });
  });

  return server;
}

function run(): void {
  //const port = process.env.PORT || 4000;              //? PUERTO ECOMMERCE        - 10.45 - 4000
  //const port = process.env.PORT || 4003;              //? PUERTO ECOMMERCE QA     - 10.30 - 4003
  const port = process.env.PORT || 4005;                //? PUERTO INTRANET PRD     - 10.45 - 4005
  //const port = process.env.PORT || 4005;              //? PUERTO INTRANET QA      - 10.30 - 4005
  //const port = process.env.PORT || 4003;              //? PUERTO AUTOSERVICIO PRD - 10.45 - 4003
  //const port = process.env.PORT || 4000;              //? PUERTO AUTOSERVICIO QA  - 10.30 - 4000
  //const port = process.env.PORT || 4007;              //? PUERTO TRAVELSCREENS QA  - 10.30 - 4007

  const server = app();
  server.listen(port, () => {
    console.log(`🚀 Node Express SSR server running on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';