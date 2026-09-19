import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let b; try { b = await req.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
  const stars = Number(b.stars);
  if (!(stars >= 1 && stars <= 5)) return Response.json({ error: "stars 1-5 required" }, { status: 400 });
  const rec = {
    at: new Date().toISOString(), stars,
    name: String(b.name || "").trim().slice(0, 120),
    useful: String(b.useful || "").slice(0, 60),
    text: String(b.text || "").slice(0, 600),
    credId: String(b.credId || "").slice(0, 20),
    ua: req.headers.get("user-agent") || null
  };
  const key = rec.at.replace(/[:.]/g, "-") + "-" + Math.random().toString(36).slice(2, 7);
  await getStore("ratings").setJSON(key, rec);
  return Response.json({ ok: true });
};

export const config = { path: "/api/rate" };
