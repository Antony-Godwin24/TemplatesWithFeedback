# Payload + Next (Minimal)

This is a minimal example integrating Payload CMS and Next.js (app dir). It demonstrates:

- A `templates` collection (title, description, imageURL)
- A `feedback` collection (name, rating 1-5, comment, relationship to a template)
- A homepage listing templates
- A template detail page with a feedback submission form and a list of feedback

Design goals: minimal files, no auth, unmoderated feedback, and easy-to-follow setup.

Prerequisites

- Node.js 18+ and npm
- Docker (recommended) or a local MongoDB server

Quick start (recommended using Docker for MongoDB)

1. From this folder, start a MongoDB server (local):

```cmd
docker run --name payload-mongo -p 27017:27017 -d mongo:6
```

2. Install dependencies

```cmd
cd "C:\Users\ri3ha\OneDrive\Documents\INTERNSHIP\amizhth\Tasks\PayLoad CMS\payload-next-minimal"
npm install
```

3. Start Payload server (separate terminal)

```cmd
npm run dev:payload
```

Payload will run on http://localhost:3001 and automatically seed two sample templates on first run. Admin UI: http://localhost:3001/admin

4. Start Next.js frontend (in another terminal)

```cmd
npm run dev:next
```

Next.js runs on http://localhost:3000. The frontend fetches from the Payload REST API at http://localhost:3001. If you run Payload on another host/port, set NEXT_PUBLIC_PAYLOAD_URL accordingly.

Notes

- Feedback is public and unmoderated (create access is open). This is by design for the demo. For production, add validation and moderation.
- Images are simple external URLs stored in `imageURL` to avoid upload complexity.
- To clear demo data, stop the mongo container and remove the database: `docker exec -it payload-mongo mongosh --eval "db.getSiblingDB('payload-minimal').dropDatabase()"` or delete the container.

Files added (important):

- `server.js` - starts Payload on port 3001 and seeds templates
- `collections/Templates.js` - templates collection
- `collections/Feedback.js` - feedback collection
- `app/` - Next.js app directory with pages and components
- `package.json` - dependencies and npm scripts

If you want, I can also add a single `npm run dev` that runs both servers concurrently, or provide a Docker Compose file to run everything together. Which would you prefer?
"# TemplatesWithFeedback" 
