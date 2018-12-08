del csvjson.js
del csvjson.mjs
del csvjson.min.js

copy src\csvjson.js csvjson.mjs
echo & echo[ >> csvjson.mjs
echo & echo[ >> csvjson.mjs
echo & echo[export default csvjson; >> csvjson.mjs

copy src\csvjson.js csvjson.js
uglifyjs csvjson.js --compress -o csvjson.min.js


 