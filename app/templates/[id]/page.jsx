import FeedbackForm from "../../components/FeedbackForm";
import FeedbackList from "../../components/FeedbackList";

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001";

async function getTemplate(id) {
  const res = await fetch(`${API_BASE}/api/templates/${id}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function TemplatePage({ params }) {
  const id = params.id;
  const template = await getTemplate(id);
  if (!template) return <p>Not found</p>;

  return (
    <div>
      <div className="card" style={{ alignItems: "flex-start" }}>
        <img
          src={
            template.imageURL ||
            "https://via.placeholder.com/400x200?text=Template"
          }
        />
        <div>
          <h2>{template.title}</h2>
          <p style={{ color: "var(--muted)" }}>{template.description}</p>
        </div>
      </div>

      <h3>Leave feedback</h3>
      {/* FeedbackForm handles POST */}
      <FeedbackForm templateId={template.id || template._id} />

      <h3>Feedback</h3>
      <FeedbackList templateId={template.id || template._id} />
    </div>
  );
}
