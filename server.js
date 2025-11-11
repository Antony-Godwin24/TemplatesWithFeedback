// Load environment variables from .env when present (optional)
try {
  require("dotenv").config();
} catch (e) {
  /* dotenv not installed */
}
const express = require("express");
const payload = require("payload");
const cors = require("cors");

const app = express();
// Only parse JSON bodies for API routes to avoid parsing non-JSON requests
// (for example the admin stub which serves HTML). This prevents body-parser
// from attempting to parse HTML/text as JSON and logging SyntaxError.
app.use("/api", express.json({ limit: "1mb" }));
app.use(cors());

// Lightweight middleware to ensure `req.files` exists for API create requests.
// Payload's upload/generateFileData expects `collection.config.upload` to exist
// and will throw when `req.files` is missing. For this minimal demo we provide
// a harmless placeholder file so create operations don't crash. Files are not
// written to disk because collections set `disableLocalStorage: true`.
app.use((req, res, next) => {
  try {
    const isApiMethod = ["POST", "PUT", "PATCH"].includes(req.method);
    if (isApiMethod && req.path && req.path.startsWith("/api")) {
      if (!req.files) {
        req.files = {
          file: {
            name: "placeholder.txt",
            data: Buffer.from("seed"),
            mimetype: "text/plain",
            size: 4,
          },
        };
      }
    }
  } catch (e) {
    // don't block requests on middleware errors
  }
  return next();
});

const PORT = process.env.PAYLOAD_PORT || 3001;
// Support either MONGO_URL or DATABASE_URI for compatibility with different projects
const MONGO_URL =
  process.env.MONGO_URL ||
  process.env.DATABASE_URI ||
  "mongodb://localhost:27017/payload-minimal";
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || "super-secret-dev";

// Ensure payload uses the desired PORT when it creates its own server
process.env.PORT = process.env.PAYLOAD_PORT || process.env.PORT || "3001";

(async () => {
  try {
    await payload.init({
      secret: PAYLOAD_SECRET,
      mongoURL: MONGO_URL,
      express: app,
      // Collections are loaded from payload.config.js in project root.
      onInit: async (payloadInstance) => {
        // Ensure every collection has a minimal `labels` object so code paths
        // that read `collection.labels.singular` / `.plural` won't throw.
        try {
          const titleCase = (s) =>
            String(s || "")
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
          Object.values(payloadInstance.collections || {}).forEach((col) => {
            try {
              const cfg = col.config || col;
              if (!cfg.labels) cfg.labels = {};
              if (!cfg.labels.singular) {
                // derive a reasonable singular from the slug
                const slug = cfg.slug || cfg.collection || "Item";
                const base = slug.replace(/s$/i, "");
                cfg.labels.singular = titleCase(base);
              }
              if (!cfg.labels.plural) {
                const slug = cfg.slug || cfg.collection || "Items";
                cfg.labels.plural = titleCase(slug);
              }
            } catch (e) {
              // no-op; this is a best-effort guard
            }
          });
        } catch (e) {
          // silently ignore
        }
        // seed templates if none exist for easy first run
        const existing = await payloadInstance.find({
          collection: "templates",
          limit: 1,
        });
        if (!existing.docs || existing.docs.length === 0) {
          console.log("Seeding sample templates...");
          // Provide a minimal fake `req` object for server-side seeding so
          // Payload's upload/file generation doesn't throw when no files are present.
          const seedReq = {
            payload: payloadInstance,
            // A tiny placeholder file object; generateFileData will process it
            // but because collections use `disableLocalStorage` uploads won't be written.
            files: {
              file: {
                name: "seed-placeholder.txt",
                data: Buffer.from("seed"),
                mimetype: "text/plain",
                size: 4,
              },
            },
            // Minimal translation function used by Payload internals
            t: (s) => s,
          };

          try {
            await payloadInstance.create({
              collection: "templates",
              data: {
                title: "Simple Landing",
                description: "A clean landing page template",
                imageURL: "https://via.placeholder.com/400x200?text=Landing",
              },
              req: seedReq,
            });
          } catch (e) {
            console.warn(
              "Seed (Simple Landing) failed, continuing startup:",
              e.message || e
            );
          }
          try {
            await payloadInstance.create({
              collection: "templates",
              data: {
                title: "Portfolio",
                description: "A minimal portfolio template",
                imageURL: "https://via.placeholder.com/400x200?text=Portfolio",
              },
              req: seedReq,
            });
          } catch (e) {
            console.warn(
              "Seed (Portfolio) failed, continuing startup:",
              e.message || e
            );
          }
        }

        // Log admin/API availability accurately based on the active config
        try {
          const adminDisabled = !!payloadInstance?.config?.admin?.disable;
          const adminRoute = payloadInstance?.config?.routes?.admin || "/admin";
          const apiRoute = payloadInstance?.config?.routes?.api || "/api";
          if (adminDisabled) {
            console.log(
              `Payload running. Admin UI is disabled (set admin.disable = false in payload.config.js to enable).`
            );
            console.log(
              `API available at http://localhost:${process.env.PORT}${apiRoute}`
            );
          } else {
            console.log(
              `Payload running. Admin panel available at http://localhost:${process.env.PORT}${adminRoute}`
            );
            console.log(
              `API available at http://localhost:${process.env.PORT}${apiRoute}`
            );
          }
        } catch (e) {
          console.log(
            "Payload running. (Could not read admin/API routes from config)"
          );
        }
      },
    });
    // Start the Express server so the admin UI and API are reachable.
    // When passing an express app into payload.init, Payload mounts its routes
    // onto the app but does not call app.listen for you — we must start it.
    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting Payload:", err);
    process.exit(1);
  }
})();
