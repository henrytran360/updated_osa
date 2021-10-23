var createError = require("http-errors");
var express = require("express");
const { ApolloServer } = require("apollo-server-express");
// import http from 'http';
import https from "https";
import fs from "fs";

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const jwt = require("jsonwebtoken");
var exjwt = require("express-jwt");
var cors = require("cors");

import { PORT } from "./config";

// Apollo Imports
import Schema from "./schema";

// Firebase Imports
import "./firebase";
import { verifyToken } from "./utils/authenticationUtils";

var coursesRouter = require("./routes/courses");
var deployRouter = require("./routes/deploy");
var syncRouter = require("./routes/sync");

// Setup Apollo
const server = new ApolloServer({
    schema: Schema,
    context: async ({ req }) => {
        // Get the JWT from the headers
        const jwt = req.headers.authorization || null;

        let decodedJWT = null;

        if (jwt) {
            const [_, token] = jwt.split(" ");
            decodedJWT = await verifyToken(token);
        }
        // Gets the decoded jwt object which our exjwt (below) creates for us as req.user
        // Inspiration from: https://www.apollographql.com/blog/setting-up-authentication-and-authorization-with-apollo-federation
        // const decodedJWT = req.user || null;
        // const user = await getUserFromToken(token);
        return { decodedJWT };
    },
});

var app = express();

// Apply cors for dev purposes
// app.use(cors({
//   origin: "*",
//   preflightContinue: true
// }))

// Add JWT so that it is AVAILABLE; does NOT protect all routes (nor do we want it to)
// Inspiration from: https://www.apollographql.com/blog/setting-up-authentication-and-authorization-with-apollo-federation
// app.use(exjwt({
//   secret: 'testsec',
//   credentialsRequired: false
// }));

// Connect apollo with express
server.applyMiddleware({ app });

// Create WebSockets server for subscriptions: https://stackoverflow.com/questions/59254814/apollo-server-express-subscriptions-error
// const httpsServer = https.createServer({
//   key: fs.readFileSync(path.resolve(__dirname, "./ssl/key.pem")),
//   cert: fs.readFileSync(path.resolve(__dirname, "./ssl/cert.pem"))
// }, app);
// server.installSubscriptionHandlers(httpsServer);

// view engine setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/courses", coursesRouter);
app.use("/api/deploy", deployRouter);
app.use("/api/sync", syncRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        // Send the error rather than to show it on the console
        res.status(401).send(err);
        return;
    }

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("error");
});

// Need to call httpsServer.listen instead of app.listen so that the WebSockets (subscriptions) server runs
app.listen({ port: PORT }, () => {
    // console.log(httpsServer.address());
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    // console.log(`🚀 Subscriptions ready at wss://localhost:${PORT}${server.subscriptionsPath}`);
});

// module.exports = app;
