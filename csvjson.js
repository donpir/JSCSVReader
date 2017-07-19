/*
 ** This file is part of csvjson.
 **
 ** csvtojson is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** csvtojson is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with csvtojson. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2016 csvtojson - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **
 ** LIST OF RELEASES:
 **     csvjson v0.1.3 - 21 July 2017
 **/

function csvjson() {
};//EndConstructor.

csvjson.EXP_ROW_SEPARATOR = /\r\n|\r|\n/g;

//KEYS.
csvjson.ERR_COUNTER = 'ERR_COUNTER';
csvjson.ERR_EMPTY_HEADER = 'ERR_EMPTY_HEADER';
csvjson.WARN_EMPTY_ROWS = 'WARN_EMPTY_ROWS';

csvjson.Split = function(line, COL_SEPARATOR) {
    //var COL_SEPARATOR = typeof colseparator == 'undefined' ? ',' : colseparator;
    var VAL_SEPARATOR = '"';
    if (COL_SEPARATOR == null || typeof COL_SEPARATOR == 'undefined')
        throw "CSV Column separator is null.";

    var STATE = {
        INIT :    { id: 0 },
        READVAL : { id: 1 }
    };

    var cells = [];
    var value = "";
    var status = STATE.READVAL;
    var counterValSeparators = 0;

    for (var i=0; i<line.length; i++) {
        var c = line[i];

        /*switch(c) {
            case "\"":
                if (status == STATE.INIT)           status = STATE.READVAL, value = "";
                else if (status == STATE.READVAL)   status = STATE.INIT, cells.push(value), value = null;
                break;
            case COL_SEPARATOR:
                if (status == STATE.INIT && value != null)  cells.push(value), value = "";
                else if (status == STATE.READVAL)           value += c;
                break;
            default:
                status: STATE.READVAL, value += c;
                break;
        }//EndSwitch.*/

        switch (c) {
            case VAL_SEPARATOR:
                counterValSeparators++;
                value += c;
                break;
            case COL_SEPARATOR:
                if (counterValSeparators % 2 != 0) //Value not terminated.
                    value += c;
                else {
                    cells.push(value);
                    counterValSeparators = 0;
                    value = "";
                }
                break;
            default:
                status = STATE.READVAL, value += c;
                break;
        }//EndSwitch.
    }//EndFor.

    if (value.trim().length > 0)
        cells.push(value);

    return cells;
};//EndFunction.

csvjson.RecogniseCSVSeparator = function(rows) {

    var tryToSplit = function (rows, colsep) {
        var numCols = -1;
        for (var i=1; i<rows.length && i<10; i++) {
            var _row = rows[i].trim();
            var cells = csvjson.Split(_row, colsep);
            var rowNumCols = cells.length;

            if (_row.trim().lastIndexOf(colsep) === _row.length-1)
                rowNumCols++;

            if (numCols == -1 && rowNumCols > 1) {
                numCols = rowNumCols;
                continue;
            }

            if (numCols != rowNumCols)
                return false;
        }//EndFor.

        return true;
    };

    //Try to use the ";" character as separator.
    var SEPARATOR = ';';
    var foundSparator = tryToSplit(rows, SEPARATOR);
    if (foundSparator) return SEPARATOR;

    SEPARATOR = ',';
    foundSparator = tryToSplit(rows, SEPARATOR);
    if (foundSparator) return SEPARATOR;

    throw "Cannot infer the CSV column separator.";
};//EndFunction.

csvjson.prototype = (function() {

    var _processHeader = function(header, colseparator) {
        if (colseparator == null || typeof colseparator == 'undefined')
            throw "Cannot process the CSV header because the column separator is null";

        var headerNames = header.split(colseparator);
        var fields = [];

        headerNames.forEach( function(item, index) {
            var name = item.replace(/\s/, "_");
            var field = { name: name, label: item, index: index };
            fields.push(field);
            fields[name] = field;
        });

        return fields;
    };//EndFunction.

    return {
        constructor: csvjson,

        /**
         * Read the CSV string and generate an object with two arrays:
         * "fields" that contains the column names and "records" that contains the data.
         * @param csvContent
         * @returns {{fields: *, records: Array}}
         */
        read: function(csvContent, rowSeparator) {
            var records = [];
            var fields = null;
            var startIndex = 0;

            //Initializations.
            var errors = {};
            errors[csvjson.ERR_COUNTER] = 0;
            errors[csvjson.ERR_EMPTY_HEADER] = 0;

            var warnings = { };
            warnings[csvjson.WARN_EMPTY_ROWS] = 0;

            if (typeof rowSeparator === 'undefined')
                rowSeparator = csvjson.EXP_ROW_SEPARATOR;

            var rows = csvContent.split(rowSeparator);
            var separator = csvjson.RecogniseCSVSeparator(rows);

            //First row is the header.
            while (rows[startIndex].trim().length == 0) {
                errors[csvjson.ERR_COUNTER]++;
                errors[csvjson.ERR_EMPTY_HEADER]++;
                startIndex++;
            }
            fields = _processHeader(rows[startIndex], separator);

            //Loop through the dataset's rows.
            for (var i=startIndex+1; i<rows.length; i++) {
                var row = rows[i];
                var values = csvjson.Split(row, separator);
                var jsonRow = {};

                for (var j=0; j<values.length; j++) {
                    var value = values[j];

                    if (typeof fields[j] == 'undefined')
                        debugger;

                    var key = fields[j].name;
                    jsonRow[key] = value;
                }

                records.push(jsonRow);
            }//EndFor.

            return { fields: fields, records: records, errors: errors, warnings: warnings };
        },//EndFunction.

        extractListOfErrors: function (jsonDataset) {
            var listOfMessages = [];
            if (jsonDataset.errors[csvjson.ERR_EMPTY_HEADER] > 0)
                listOfMessages.push({ type: 'error', code: csvjson.ERR_EMPTY_HEADER, description: "The csv has an empty header. Check the first row is empty." });
            return listOfMessages;
        }//EndFunction.
    };

})();