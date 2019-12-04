const express = require("express"); // importing a CommonJS module
const helmet = require("helmet"); // <<<<<< install the package step 1

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// middleware
const checkRole = role => {
  return function(req, res, next) {
    if (role && role === req.headers.role) {
      next();
    } else {
      res.status(403).json({ message: "can't touch this!" });
    }
  };
};

// custom middleware uses the "Three Amigas"
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon', let it continue
// if not, send back status code 401 and a message. Use it for the /area51 endpoint
function gatekeeper(req, res, next) {
  const password = req.headers.password;
  // read the password from the headers
  // is it mellon
  // is it not
  // below, he wants to use the password.toLowerCase function, but first must see if there is a password exists
  if (password && password.toLowerCase() === "mellon") {
    next();
  } else {
    res.status(401).json({ you: "shall not pass!!" });
  }
}

server.use(helmet()); // <<<<<<<<<<< use it step 2
server.use(express.json()); // built-in middleware
server.use(logger);

//end points

server.use("/api/hubs", checkRole("admin"), hubsRouter); // the router is also local middleware, because it only applies to /api/hubs

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
server.get("/area51", gatekeeper, checkRole("agent"), (req, res) => {
  res.send(req.headers);
});

module.exports = server;

// checkRole('admin'), checkRole('agents')

// !!! we write it *not* as an arrow function, as arrow functions do not hoist
// function checkRole(role) {
//   return function(req, res, next) {};
// }

/*
Why do you pass in the function code (no subsequent parenthesis) as opposed to the running function (with parenthesis)?
server.use (middle ware) vs server.use(middleware())
*/

// Cannot read property 'headers' of undefined.
