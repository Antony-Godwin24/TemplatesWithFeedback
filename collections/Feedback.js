module.exports = {
  slug: "feedback",
  endpoints: [],
  versions: false,
  labels: {
    singular: "Feedback",
    plural: "Feedbacks",
  },
  hooks: {
    beforeOperation: [],
    beforeValidate: [],
    beforeChange: [],
    beforeRead: [],
    afterRead: [],
    afterChange: [],
    afterOperation: [],
  },
  // Minimal upload config: keep uploads disabled for local storage so Payload
  // doesn't attempt to write files during this demo, but provide the upload
  // object so internal code that expects it doesn't crash.
  upload: {
    disableLocalStorage: true,
    // directory (relative to project config dir) - required by generateFileData
    staticDir: "uploads",
    // sentinel that does NOT begin with '/' so static mounting is skipped
    staticURL: "no-static",
    imageSizes: [],
    mimeTypes: [],
  },
  admin: {
    useAsTitle: "comment",
  },
  access: {
    read: () => true,
    create: () => true, // allow anyone to submit feedback (unmoderated)
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "comment",
      type: "textarea",
    },
    {
      name: "template",
      type: "relationship",
      relationTo: "templates",
      required: true,
    },
  ],
};
