/**
 * LaunchGate — Global launch state router
 *
 * Fetches GET /api/launch-status once on mount.
 * Routes the entire application based on the result:
 *
 *   launched = true  → render normal Gremake website (children)
 *   launched = false, launchMode=false → render PreLaunchScreen (public gate)
 *   launched = false, launchMode=true  → render GoLiveOverlay (internal launch)
 *
 * The normal website (children) is NOT rendered at all while launched=false
 * for normal public visitors. No routes, no Nav, no Footer — nothing.
 *
 * After GoLiveOverlay completes the launch, onLaunched() is called
 * which transitions state to render the normal website.
 *
 * localStorage: used as a read cache only, never as source of truth.
 */

import { useEffect, useRef, useState } from "react";
import { site } from "../lib/siteConfig";
import PreLaunchScreen from "./PreLaunchScreen";
import GoLiveOverlay from "./GoLiveOverlay";

// ─── Cache helpers (optimization only) ───────────────────────────────────────

const LS_LAUNCHED = "gremake_go_live_seen";

function getCachedLaunched(): boolean {
  try { return localStorage.getItem(LS_LAUNCHED) === "true"; } catch { return false; }
}
function setCachedLaunched(): void {
  try { localStorage.setItem(LS_LAUNCHED, "true"); } catch { /* ignore */ }
}

// ─── URL helper ───────────────────────────────────────────────────────────────

function isLaunchMode(): boolean {
  try {
    return new URL(window.location.href).searchParams.get("launchMode") === "true";
  } catch { return false; }
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchLaunchStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${site.apiBaseUrl}/api/launch-status`);
    if (!res.ok) return false;
    const data = await res.json() as { launched?: boolean };
    return data.launched === true;
  } catch { return false; }
}

// ─── Gate state ───────────────────────────────────────────────────────────────

type GateState =
  | "loading"       // Fetching server state
  | "pre-launch"    // Server says not launched — show PreLaunchScreen
  | "launch-mode"   // Not launched + ?launchMode=true — show GoLiveOverlay
  | "live";         // Server says launched — render normal website

// ─── LaunchGate ───────────────────────────────────────────────────────────────

interface LaunchGateProps {
  children: React.ReactNode;
}

export default function LaunchGate({ children }: LaunchGateProps) {
  const [state, setState] = useState<GateState>("loading");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const launchMode = isLaunchMode();

    // Fast path: if we have a localStorage cache, skip the GET for normal visitors
    // BUT for launchMode we always check server to see if already launched
    if (!launchMode && getCachedLaunched()) {
      // Cache says launched — verify with server quickly
      fetchLaunchStatus().then((serverLaunched) => {
        if (serverLaunched) {
          setState("live");
        } else {
          // Cache was wrong (perhaps DB reset) — clear and show pre-launch
          try { localStorage.removeItem(LS_LAUNCHED); } catch { /* ignore */ }
          setState("pre-launch");
        }
      });
      return;
    }

    // Always fetch from server
    fetchLaunchStatus().then((serverLaunched) => {
      if (serverLaunched) {
        setCachedLaunched();
        setState("live");
      } else if (launchMode) {
        setState("launch-mode");
      } else {
        setState("pre-launch");
      }
    });
  }, []);

  // Loading: render nothing (or a minimal invisible placeholder)
  if (state === "loading") {
    return (
      <div
        style={{ position: "fixed", inset: 0, background: "#000" }}
        aria-hidden="true"
      />
    );
  }

  // Pre-launch public gate: NO website content rendered
  if (state === "pre-launch") {
    return <PreLaunchScreen />;
  }

  // Internal launch mode: show GoLiveOverlay only
  // When the operator completes the launch, onLaunched is called
  if (state === "launch-mode") {
    return (
      <GoLiveOverlay
        onLaunched={() => {
          setCachedLaunched();
          setState("live");
        }}
      />
    );
  }

  // launched = true: render the full normal website
  return <>{children}</>;
}
