# csvjson
A JavaScript library to parse csv files and trasform the content in JSON Format. The library infers the column separator and uses it to parse the CSV content.

In addition, the library embeds a set of heuristics to check whether the csv input is well-formed. This feature is particularly useful for applications that need to import well-formed csv files. The last version of the library checks and give a feedback for:

* Empty first row (empty header)
