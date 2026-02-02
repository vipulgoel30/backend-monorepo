import app from "./app.js";

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
