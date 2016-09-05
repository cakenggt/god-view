const DATABASE_URL = process.env.DATABASE_URL||
"postgres:postgres:postgres@localhost:5432/godber";
const PORT = process.env.PORT || 3000;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ||
"GOOGLE API KEY HERE";


exports.DATABASE_URL = DATABASE_URL;
exports.PORT = PORT;
exports.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY;
