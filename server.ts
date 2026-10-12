import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // API status check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Forever Together - Indian Luxury Wedding Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Verify Admin Passkey
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { passkey } = req.body;
    const validKeys = ['Udaipur2026!', 'forever2026', 'royaladmin'];
    if (validKeys.includes(String(passkey || '').trim())) {
      return res.json({
        success: true,
        token: 'forever_authenticated_royal_admin',
        message: 'Admin authenticated successfully',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid royal admin passkey.',
    });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Forever Together Wedding Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
