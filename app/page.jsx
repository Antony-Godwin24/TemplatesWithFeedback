import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001";

async function getTemplates() {
  const res = await fetch(`${API_BASE}/api/templates?limit=100`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.docs || [];
}

export default async function Page() {
  const templates = await getTemplates();

  return (
    <div>
      <div className="grid">
        {templates.map((t) => (
          <Link
            key={t.id || t._id}
            href={`/templates/${t.id || t._id}`}
            className="card"
          >
            <img
              src={
                t.imageURL ||
                "https://via.placeholder.com/400x200?text=Template"
              }
              alt=""
            />
            <div>
              <h3>{t.title}</h3>
              <p style={{ color: "var(--muted)" }}>{t.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
