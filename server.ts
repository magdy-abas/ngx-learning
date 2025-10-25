import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import cookieParser from 'cookie-parser';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(cookieParser());

  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  server.get('*', async (req, res, next) => {
    try {
      const { protocol, originalUrl, baseUrl, headers } = req;

      const lang =
        req.cookies?.lang ||
        req.headers['accept-language']?.split(',')[0]?.split('-')[0] ||
        'ar';

      const token = req.cookies?.token || null;

      res.cookie('lang', lang, { path: '/', sameSite: 'none', secure: true });

      const html = await commonEngine.render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: 'SSR_LANG', useValue: lang },
          { provide: 'SSR_TOKEN', useValue: token },
        ],
      });

      res.send(html);
    } catch (err) {
      console.error('❌ SSR Render Error:', err);
      next(err);
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`✅ Node SSR server running on http://localhost:${port}`);
  });
}

run();
