const schema = {
  username: {
    validation: (value, doc = {}) => {
      if (!("username" in doc)) {
        throw new Error("Key 'username' must be provided");
      }
      if (!value) {
        throw new Error("Username is Required");
      }
      if (typeof value !== "string") {
        throw new Error("Username Data Type String is Required!");
      }

      return value;
    },
    sanitize: (value) => value?.trim?.(),
  },
  password: {
    validation: (value, doc = {}) => {
      if (!("password" in doc)) {
        throw new Error("Key 'password' must be provided");
      }
      if (!value) {
        throw new Error("Password is Required");
      }
      if (value.length < 7) {
        throw new Error("Password of Required of minimum 8 Chars");
      }
      return value;
    },
  },
};

export default schema;
