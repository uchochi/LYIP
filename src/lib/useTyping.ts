import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

/**
 * Real, topic-scoped "who is typing" indicator backed by Supabase Realtime
 * Broadcast (no DB writes, no fake simulation).
 *
 * - Each topic gets its own channel `typing:{topicId}`, so a typing event is
 *   only ever shown on the topic it belongs to.
 * - The current user's own broadcasts are dropped via `broadcast.self = false`,
 *   so you never see "yourself typing".
 * - Stale typers (no keystroke in ~3.5s) are pruned automatically.
 */

interface Typer {
  userId: string;
  name: string;
  ts: number;
}

type Channel = ReturnType<typeof supabase.channel>;

const TYPING_TTL_MS = 3500;
const SEND_THROTTLE_MS = 1500;
const PRUNE_INTERVAL_MS = 1000;

export function useTyping(
  topicId: string | undefined,
  me: { id: string; name: string } | null,
): { typingNames: string[]; notifyTyping: () => void; notifyStopped: () => void } {
  const [typingNames, setTypingNames] = useState<string[]>([]);
  const channelRef = useRef<Channel | null>(null);
  const lastSentRef = useRef(0);
  const mapRef = useRef<Map<string, Typer>>(new Map());

  // Flush the in-memory map to React state, excluding the current user (the
  // self:false channel option already does this, but we double-guard).
  const flush = () => {
    const meId = me?.id;
    const list = Array.from(mapRef.current.values())
      .filter((t) => t.userId !== meId)
      .sort((a, b) => a.ts - b.ts)
      .slice(0, 4)
      .map((t) => t.name);
    setTypingNames(list);
  };

  useEffect(() => {
    if (!topicId) return;

    const channel = supabase.channel(`typing:${topicId}`, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'typing' }, (msg: { payload: Typer }) => {
        const p = msg.payload;
        if (!p?.userId) return;
        mapRef.current.set(p.userId, { userId: p.userId, name: p.name || 'Someone', ts: p.ts || Date.now() });
        flush();
      })
      .on('broadcast', { event: 'stopped' }, (msg: { payload: { userId: string } }) => {
        const uid = msg.payload?.userId;
        if (uid && mapRef.current.delete(uid)) flush();
      })
      .subscribe();

    const prune = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, t] of mapRef.current) {
        if (now - t.ts > TYPING_TTL_MS) {
          mapRef.current.delete(id);
          changed = true;
        }
      }
      if (changed) flush();
    }, PRUNE_INTERVAL_MS);

    return () => {
      clearInterval(prune);
      supabase.removeChannel(channel);
      mapRef.current.clear();
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const notifyTyping = () => {
    if (!me || !channelRef.current) return;
    const now = Date.now();
    if (now - lastSentRef.current < SEND_THROTTLE_MS) return; // throttle broadcasts
    lastSentRef.current = now;
    void channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: me.id, name: me.name, ts: now },
    });
  };

  const notifyStopped = () => {
    if (!me || !channelRef.current) return;
    lastSentRef.current = 0;
    void channelRef.current.send({
      type: 'broadcast',
      event: 'stopped',
      payload: { userId: me.id },
    });
  };

  return { typingNames, notifyTyping, notifyStopped };
}
