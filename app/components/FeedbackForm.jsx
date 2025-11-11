"use client";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001";

export default function FeedbackForm({ templateId }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        rating: Number(rating),
        comment,
        template: templateId,
      }),
    });
    if (res.ok) {
      setStatus("ok");
      setName("");
      setRating(5);
      setComment("");
      // simple approach: trigger a small page refresh of feedback area by dispatching custom event
      window.dispatchEvent(
        new CustomEvent("feedback:submitted", { detail: { templateId } })
      );
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 600 }}>
      <div className="form-row">
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label style={{ width: 80 }}>Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div className="form-row">
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <button type="submit">Send feedback</button>
        {status === "sending" && (
          <span style={{ marginLeft: 8 }}>Sending…</span>
        )}
        {status === "ok" && (
          <span style={{ marginLeft: 8, color: "green" }}>Sent</span>
        )}
        {status === "error" && (
          <span style={{ marginLeft: 8, color: "red" }}>Error</span>
        )}
      </div>
    </form>
  );
}
