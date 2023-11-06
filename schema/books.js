const schema = {
  title: {
    validation: (value, doc = {}) => {
      if (!("title" in doc)) {
        throw new Error("Key 'title' must be provided");
      }
      if (!value) {
        throw new Error("Title is Required");
      }
      if (typeof value !== "string") {
        throw new Error("Title Data Type String is Required!");
      }

      return value;
    },
    sanitize: (value) => value?.trim?.(),
  },
  author: {
    validation: (value, doc = {}) => {
      if (!("author" in doc)) {
        throw new Error("Key 'author' must be provided");
      }
      if (!value) {
        throw new Error("Author is Required");
      }
      if (typeof value !== "string") {
        throw new Error("Author Data Type String is Required!");
      }

      return value;
    },
    sanitize: (value) => value?.trim?.(),
  },
  summary: {
    validation: (value) => {
      return "";
    },
    sanitize: (value) => value?.trim?.(),
  },
};

export default schema;
