const DATABASE_URL = process.env.DATABASE_URL||
"postgres:postgres:postgres@localhost:5432/godber";
const PORT = process.env.PORT || 3000;


exports.DATABASE_URL = DATABASE_URL;
exports.PORT = PORT;
