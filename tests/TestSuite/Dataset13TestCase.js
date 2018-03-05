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

httpGetAsync("../datasets/dataset13.csv", runTests);

function runTests(textualContent) {
    var dataset = textualContent;

    QUnit.test( "dataset13", function( assert ) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");

        var line = '"topo_int,C,120","topo_rid,C,40","propr,C,10","lung_m,N,6,0","id_strada,N,14,0","longitude,N,9,6","latitude,N,9,6"';
        var values = csvjson.Split(line, ',');
        assert.equal(values.length, 7);


        debugger;

        //var jsonDataset = reader.read(dataset);
        /*assert.equal(jsonDataset._errors[csvjson.ERR_EMPTY_ROWS], 3);
        assert.ok(jsonDataset._errors[csvjson.ERR_EMPTY_HEADER_CELLS] == 2);
        assert.equal(jsonDataset._warnings[csvjson.WARN_DUPLICATED_COLUMN_NAME], 1);
        debugger;*/

        //assert.notEqual(jsonDataset, null, "Dataset correctly read.");
        //assert.equal(jsonDataset.fields.length, 7, "The dataset has the expected number of columns.");
        //assert.equal(jsonDataset.records.length, 155, "The dataset has the expected number of rows.");

    });

}//EndTestSuite.