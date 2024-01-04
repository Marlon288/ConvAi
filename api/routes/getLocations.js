var express = require("express");
var router = express.Router();

router.get('/getLocations', (req, res) => {
    res.sendFile('/data/Locations.json', { root: __dirname }, (err) => {
        if (err) {
            console.log("Error :" + err);
            res.status(500).send("Error loading the file");
        }
    });
});
module.exports = router;
