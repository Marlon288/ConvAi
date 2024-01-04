var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require('fs');

router.get('/getLocations', (req, res) => {
    const filePath = path.join(__dirname, '../data/Locations.json');
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(JSON.parse(data));
    });
});
module.exports = router;
