import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import { environment } from './environments/environment';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

const apiUrl = process.env['API_INTERNAL_URL'] || environment.apiUrl;
const siteUrl = environment.siteUrl;

/**
 * robots.txt — points crawlers to the sitemap
 */
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
});

/**
 * sitemap.xml — home page + every published story, built from the API
 */
app.get('/sitemap.xml', async (_req, res) => {
  try {
    const response = await fetch(`${apiUrl}/writing?status=published`);
    if (!response.ok) throw new Error(`API responded ${response.status}`);
    const stories: { id: number; created_at: string; updated_at?: string | null }[] = await response.json();

    const urls = [
      `  <url><loc>${siteUrl}/</loc></url>`,
      ...stories.map(s =>
        `  <url><loc>${siteUrl}/stories/${s.id}</loc><lastmod>${(s.updated_at || s.created_at).slice(0, 10)}</lastmod></url>`),
    ];
    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    );
  } catch (err) {
    console.error('sitemap.xml:', err);
    res.status(503).send('Sitemap temporarily unavailable');
  }
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
