import app from "./app.js";

import { mongoFieldDefinitions, StringZodSchema } from "@mono/utils";

const schema = new StringZodSchema(mongoFieldDefinitions.username).build();

(async () => {
  try {
    const port = process.env.PORT;

    app.listen(port, () => {
      console.log(`App listening in port : ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
