/**
 * launch.ts — Gremake Global Launch State
 *
 * GET  /api/launch-status
 *   Public. Returns { launched: boolean, launchedAt?: string }
 *   Checks the PostgreSQL launch_state table. Safe to call from any browser.
 *
 * POST /api/launch
 *   Private. Authorization: Bearer <LAUNCH_SECRET>
 *   Persists launched=true to PostgreSQL. Idempotent.
 *   Secret is NEVER in a URL. Sent only via HTTPS Authorization header.
 *
 * Database table (auto-created on startup):
 *   launch_state (id SERIAL PK, launched BOOLEAN, launched_at TIMESTAMPTZ)
 *
 * The single row (id=1) is the global launch state.
 * Survives backend restarts, redeploys, instance replacement.
 *
 * Security:
 *   - LAUNCH_SECRET is server-side env only, never exposed to frontend.
 *   - Secret never logged.
 *   - GET endpoint exposes only a boolean — no sensitive data.
 *   - POST returns 401 for wrong secret, 503 if unconfigured.
 */

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

const router = Router();

// ── Database pool ─────────────────────────────────────────────────────────────

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured.');
    }
    pool = new Pool({
      connectionString,
      // Render provides SSL-enabled Postgres; require SSL in production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

// ── Initialize table on startup ───────────────────────────────────────────────
// Creates the table and seeds a single "not launched" row if it doesn't exist.
// Called from index.ts.

export async function initLaunchState(): Promise<void> {
  try {
    const db = getPool();
    await db.query(`
      CREATE TABLE IF NOT EXISTS launch_state (
        id         SERIAL PRIMARY KEY,
        launched   BOOLEAN NOT NULL DEFAULT FALSE,
        launched_at TIMESTAMPTZ
      )
    `);
    // Seed the one global row if it doesn't exist
    await db.query(`
      INSERT INTO launch_state (id, launched, launched_at)
      VALUES (1, FALSE, NULL)
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('[launch] launch_state table ready.');
  } catch (err) {
    // Non-fatal on startup — if DB is unavailable the endpoints will return errors
    console.error('[launch] Failed to initialize launch_state table:', (err as Error).message);
  }
}

// ── GET /api/launch-status ────────────────────────────────────────────────────

router.get('/launch-status', async (_req: Request, res: Response) => {
  try {
    const db = getPool();
    const result = await db.query<{ launched: boolean; launched_at: string | null }>(
      'SELECT launched, launched_at FROM launch_state WHERE id = 1'
    );
    if (result.rows.length === 0) {
      res.json({ launched: false });
      return;
    }
    const row = result.rows[0];
    res.json({ launched: row.launched, launchedAt: row.launched_at ?? undefined });
  } catch {
    // If DB is unavailable, conservatively return not launched
    res.json({ launched: false });
  }
});

// ── POST /api/launch ──────────────────────────────────────────────────────────

router.post('/launch', async (req: Request, res: Response) => {
  const secret = process.env.LAUNCH_SECRET;

  if (!secret || secret.length < 16) {
    console.error('[launch] LAUNCH_SECRET is not configured or too short.');
    res.status(503).json({ success: false, message: 'Launch endpoint not configured.' });
    return;
  }

  const authHeader = req.headers['authorization'] ?? '';
  const provided = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!provided || provided !== secret) {
    res.status(401).json({ success: false, message: 'Unauthorized.' });
    return;
  }

  try {
    const db = getPool();
    await db.query(`
      UPDATE launch_state
      SET launched = TRUE, launched_at = COALESCE(launched_at, NOW())
      WHERE id = 1
    `);

    // Read back the confirmed state
    const result = await db.query<{ launched: boolean; launched_at: string }>(
      'SELECT launched, launched_at FROM launch_state WHERE id = 1'
    );
    const row = result.rows[0];
    console.log('[launch] 🚀 Gremake globally launched at', row.launched_at);
    res.json({ success: true, launched: row.launched, launchedAt: row.launched_at });
  } catch (err) {
    console.error('[launch] Database error during launch:', (err as Error).message);
    res.status(500).json({ success: false, message: 'Failed to persist launch state. Please retry.' });
  }
});

export { router as launchRouter };
