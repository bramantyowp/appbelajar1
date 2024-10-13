require('dotenv').config()
const express = require("express");
const http = require("http");
const routes = require('./src/routes');
const PORT = 3000;
const path = require('path');
const app = express();
const server = http.createServer(app);
const errorHandler = require("./src/middlewares/errorHandler");
const NotFoundError = require('./src/helpers/errors/notFound');
const cors = require('cors')
const swaggerDocument=require('./openapi.json')

const swaggerUi = require('swagger-ui-express')
app.use(cors())
app.use(express.json());
require("./src/routes")(app);
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
//dibawah ini lho space kosong



// jangan dibawah yang ini su
app.use((req, res, next) => {
  next(new NotFoundError(null, "Sorry, page not found!"));
})
//application level middleware untuk error handling
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
