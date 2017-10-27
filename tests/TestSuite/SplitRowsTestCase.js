/*
 ** This file is part of csvjson.
 **
 ** csvjson is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** csvjson is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with csvjson. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2016 csvjson - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **/

var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.


var rowSeparator = /\r\n|\r|\n/g;

////////////////////////////////////////////////////////////////
/// DATASET 02
///

httpGetAsync("../datasets/dataset02.csv", runTestDataset02);
function runTestDataset02(dataset) {
    QUnit.test("csvjson Split TestCase on Dataset 02", function(assert) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");

        var rows = dataset.split(rowSeparator);
        assert.equal(rows.length, 15, "Number of rows match.");
        assert.equal(rows[0].length, 297, "Check the length of the first row.");

        //Infer the SEPARATOR.
        try {
            var separator = csvjson.RecogniseCSVSeparator(rows);
            assert.equal(separator, ',', "CSV Separator ; recognized");
        } catch (err) {
            assert.notOk('Cannot recognize the CSV separator.');
        }
    });
}

////////////////////////////////////////////////////////////////
/// DATASET 03
///

httpGetAsync("../datasets/dataset03.csv", runTestDataset03);
function runTestDataset03(dataset) {
    QUnit.test("csvjson Split TestCase on Dataset 03", function(assert) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");
        var rows = dataset.split(rowSeparator);
        assert.equal(rows.length, 47, "Number of rows match.");
        assert.equal(rows[0].length, 38, "Check the length of the first row.");

        //Infer the SEPARATOR.
        try {
            var separator = csvjson.RecogniseCSVSeparator(rows);
            assert.equal(separator, ';', "CSV Separator ; recognized");
        } catch (err) {
            assert.notOk('Cannot recognize the CSV separator.');
        }
    });
}

////////////////////////////////////////////////////////////////
/// DATASET 04
///

httpGetAsync("../datasets/dataset04.csv", runTestDataset04);
function runTestDataset04(dataset) {
    QUnit.test("csvjson Split TestCase on Dataset 04", function(assert) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");
        var rows = dataset.split(rowSeparator);
        assert.equal(rows.length, 45, "Number of rows match.");
        assert.equal(rows[0].length, 271, "Check the length of the first row.");
    });
}

////////////////////////////////////////////////////////////////
/// DATASET 05
///

httpGetAsync("../datasets/dataset05.csv", runTestDataset05);
function runTestDataset05(dataset) {
    QUnit.test("csvjson Split TestCase on Dataset 05", function(assert) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");
        var rows = dataset.split(rowSeparator);
        assert.equal(rows.length, 157, "Number of rows match.");
        assert.equal(rows[1].length, 55, "Check the length of the first row.");

        //Infer the SEPARATOR.
        try {
            var separator = csvjson.RecogniseCSVSeparator(rows);
            assert.equal(separator, ';', "CSV Separator ; recognized");
        } catch (err) {
            debugger;
            assert.notOk('Cannot recognize the CSV separator.');
        }
    });
}

////////////////////////////////////////////////////////////////
/// DATASET 06 WRONG COLUMNS
///

httpGetAsync("../datasets/dataset06_wrongcols.csv", runTestDataset06);
function runTestDataset06(dataset) {
    QUnit.test("csvjson Split TestCase on Dataset 06", function(assert) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");
        var rows = dataset.split(rowSeparator);
        assert.equal(rows.length, 6, "Number of rows match.");
        assert.equal(rows[0].length, 38, "Check the length of the first row.");

        //Infer the SEPARATOR.
        try {
            var separator = csvjson.RecogniseCSVSeparator(rows);
            assert.notOk('CSV should have a problem.');
        } catch (err) {
            /*OK it has an error. */
        }
    });
}
