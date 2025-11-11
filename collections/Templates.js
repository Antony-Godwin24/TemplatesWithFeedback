module.exports = {
  slug: "templates",
  endpoints: [],
  versions: false,
  labels: {
    singular: "Template",
    plural: "Templates",
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
  upload: {
    disableLocalStorage: true,
    staticDir: "uploads",
    staticURL: "no-static",
    imageSizes: [],
    mimeTypes: [],
  },
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "imageURL",
      type: "text",
      label: "Image URL",
    },
  ],
};
