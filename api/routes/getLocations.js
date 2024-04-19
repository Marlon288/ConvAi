/**
 * @file getLocations.js
 * @description Location router module, responsible for handling the available locations.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require('fs');

/**
 * Route for getting the list of locations.
 */
router.get('/getFormattedLocations', (req, res) => {
    const filePath = path.join(__dirname, '../data/Locations.json');
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const locations = JSON.parse(data);
        const formattedLocations = locations.map(location => `${location.location_country},${location.location_label}`).sort();
        res.json(formattedLocations);
    });
});

/**
 * Route for getting the list of locations.
 */
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
