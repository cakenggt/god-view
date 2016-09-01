## Setup

Install a PostgreSQL db and point your `DATABASE_URL` variable in `credentals.js` to it. The url for the db should be in the following format:

`postgres:username:password@localhost:5432/godber`

Install PostGIS onto the database.

`create extension postgis;`

Clone the uber tic foil response repo as a subfolder in your main directory.

`git clone https://github.com/fivethirtyeight/uber-tlc-foil-response/tree/master/uber-trip-data.git`

Run the upload script with an optional `records` argument for how many records to put in the db. The records are put in in date order. The default number of records to put in is 10000. This command will delete all previous data in the db.

`npm run upload -- --records 10000`

On the Heroku implementation of this, only 10000 records can be uploaded.
