const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const { mappingData } = require("./Controller/dbmanage");

const port = 3005;
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.post("/api/liff/register", mappingData);

app.listen(port, async () => {
  console.log(`Server is running on port ${port} `);
});
