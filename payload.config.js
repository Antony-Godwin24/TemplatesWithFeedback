module.exports = {
  // Minimal Payload config so payload can locate collections when starting.
  // Collections are required from the local collections folder.
  collections: [
    require("./collections/Templates"),
    require("./collections/Feedback"),
  ],
  // Provide an empty globals array to satisfy Payload's config validation.
  globals: [],
  // Ensure graphQL key exists to avoid runtime validation errors in older Payload versions
  graphQL: {
    disable: true,
  },
  // Admin UI: enable for interactive management. We provide a lightweight
  // dev/serve bundler stub so the Admin route doesn't crash in this minimal demo.
  // Replace with Payload's real admin bundler for full admin UI.
  admin: {
    disable: false,
    bundler: {
      // Return an express-compatible router that responds to all admin requests.
      dev: async (ctx) => {
        const express = require("express");
        const router = express.Router();
        router.get("*", (_req, res) => {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.send(
            `<html><head><title>Payload Admin (stub)</title></head><body><h1>Payload Admin (dev stub)</h1><p>This is a minimal stub for the admin UI in the demo. To use the real Admin UI, configure the admin bundler per Payload docs.</p></body></html>`
          );
        });
        return router;
      },
      // Production serve can be the same static stub for this demo.
      serve: async (ctx) => {
        const express = require("express");
        const router = express.Router();
        router.get("*", (_req, res) => {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.send(
            `<html><head><title>Payload Admin (stub)</title></head><body><h1>Payload Admin (serve stub)</h1><p>This demo does not include the built admin bundle. Build or configure the admin bundler for the real UI.</p></body></html>`
          );
        });
        return router;
      },
    },
  },
  // Minimal server and route settings so Payload can compute URLs
  serverURL: process.env.SERVER_URL || "http://localhost:3001",
  // Global endpoints array (mountEndpoints will iterate over this)
  endpoints: [],
  routes: {
    admin: "/admin",
    api: "/api",
  },
  // Minimal rateLimit settings expected by the express middleware
  rateLimit: {
    window: 15 * 60 * 1000,
    max: 100,
  },
  // Minimal express-related config used by the middleware
  express: {
    preMiddleware: [],
    middleware: [],
    postMiddleware: [],
    // compression should be an options object for compression middleware
    compression: {},
    json: { limit: "1mb" },
  },
  // Minimal i18n and localization configs
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  // Provide a minimal localization shape expected by Payload middleware
  localization: {
    // locales must be iterable
    locales: ["en"],
    defaultLocale: "en",
  },
  // Provide top-level hooks object with safe no-op handlers expected by the middleware
  hooks: {
    // afterError may be invoked by the error handler; provide a no-op function
    afterError: async () => {},
  },
  // Minimal upload config used by express-fileupload
  upload: {},
};
