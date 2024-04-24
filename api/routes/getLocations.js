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
 * @api {get} /api/getFormattedLocations Get formatted locations
 * @apiName GetFormattedLocations
 * @apiGroup Locations
 *
 * @apiSuccess {Array} formattedLocations List of formatted locations.
 *
 * @apiError (500) InternalServerError Internal server error.
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
 * @api {get} /api/getLocations Get locations
 * @apiName GetLocations
 * @apiGroup Locations
 *
 * @apiSuccess {Array} locations List of locations.
 *
 * @apiError (500) InternalServerError Internal server error.
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
