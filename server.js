const express = require("express"); // importing a CommonJS module
const helmet = require("helmet"); // <<<<<< install the package step 1

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// middleware

// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon', let it continue
// if not, send back status code 401 and a message. Use it for the /area51 endpoint
function gatekeeper(req, res, next) {
  if (req.url === "/mellon") {
    next();
  } else {
    res.status(401).send("No dice! Try again.");
  }
}

server.use(helmet()); // <<<<<<<<<<< use it step 2
server.use(express.json()); // built-in middleware
server.use(logger);

//end points

server.use("/api/hubs", helmet(), hubsRouter); // the router is also local middleware, because it only applies to /api/hubs

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

// shift + alt + up or down to copy the selected lines
// HERE, we are using helmet locally, rather than how we did above where it was used globally
server.get("/area51", gatekeeper, (req, res) => {
  res.send(req.headers);
});

module.exports = server;
