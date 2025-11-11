"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001";

export default function FeedbackList({ templateId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    // Payload REST filtering: where[template][equals]=<id>
    const q = `${API_BASE}/api/feedback?where[template][equals]=${templateId}&limit=100&sort=-createdAt`;
    const res = await fetch(q, { cache: "no-store" });
    if (!res.ok) {
      setItems([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.docs || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const handler = (e) => {
      if (e.detail && e.detail.templateId === templateId) load();
    };
    window.addEventListener("feedback:submitted", handler);
    return () => window.removeEventListener("feedback:submitted", handler);
  }, [templateId]);

  if (loading) return <p>Loading feedback…</p>;
  if (items.length === 0) return <p>No feedback yet.</p>;

  return (
    <div>
      {items.map((f) => (
        <div className="feedback-item" key={f.id || f._id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{f.name}</strong>
            <span className="rating">
              {Array.from({ length: f.rating })
                .map((_, i) => "★")
                .join("")}
              {Array.from({ length: 5 - f.rating })
                .map((_, i) => "☆")
                .join("")}
            </span>
          </div>
          <div style={{ color: "var(--muted)" }}>{f.comment}</div>
        </div>
      ))}
    </div>
  );
}
