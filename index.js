//new dev branch for development purpose
const { port} = require("./Config/config");
const { connect } = require("./Config/database");

const app = require("./app")

connect();

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
