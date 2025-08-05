const app = require("./app.js");

const port = 5000;

app.get("/", (req, res) => {
  res.send("You are currently at root route");
});

const server = app.listen(port, () => console.log(`Server running at 5000`));
