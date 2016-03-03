del csvjson.js
del csvjson.min.js
copy src\csvjson.js csvjson.js
uglifyjs csvjson.js --compress -o csvjson.min.js