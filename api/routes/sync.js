const { fork, execFile } = require("child_process");

var express = require("express");
var router = express.Router();

var BIGJSON = require("../python_scripts/3-23-2022-1-45pm.json")

router.post("/", async (req, res, next) => {
    // Execute query on Python to fetch XML, transform into JSON

    // Iterate through each course in JSON, process it and sync
    // let currentTermJSON = BIGJSON[0];
    // jsonToSchema(currentTermJSON);
    // ('./utils.js', []);
    const forked_process = fork(`${__dirname}/utils.js`);

    forked_process.on('message', (msg, handle) => {
        console.log(msg);
    })

    forked_process.on('exit', (code, signal) => {
        console.log("Process completed.");
    })
    res.send("Process started.");
});

module.exports = router;