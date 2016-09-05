# God View

This webapp allows you to look at the New York Uber data collected by the City Taxi and Limousine Commission (TLC) with several tools using Google Maps.

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

Your google maps api key needs to be in the environment variable `GOOGLE_MAPS_API_KEY`

### credentials.js

The file `credentials.js` needs to be set up in your main directory. It should export the following keys:
* `DATABASE_URL` This is the url of the postgres db you are connecting to. See details in the setup section above.
* `PORT` This is the port the app will run on.

The keys can be hard coded into the credentials file, or loaded in the file using `process.env.KEY` to access the system variables.

## Approach

I approached this project with the goal of making a maximally extensible application for viewing this type of data. Each of the React elements in the Controls and Filters section can be taken out without affecting the app past the degree you would expect. There are hooks for both Controls and Filters through which you can add new items that are fully able to take advantage of the functionality of the entire app.

PostgreSQL was chosen as the database because of it's known speed with geolocation data using the postgis extension. I decided to filter only based on polygon in the backend to make the application as easy to extend and as reactive as possible.

I chose React because of it's component-based approach, which would allow new filters and controls to be added easily in the future.

### Controls

Any React element in the Controls should be able to affect someting fundamental about the app, such as adding a heatmap or determining how many rows will be downloaded from the server. These elements benefit from getting `addMapReady` in their props, as any function submitted to that method will be run once the global `google` variable is ready and the `map` instance is created. Additionally, when modifying the polygon, it helps to get `setPoly` as a prop, as that lets you pass in a list of `google.LatLng` objects as the coordinates of the polygon.

### Filters

Any react elements which filter down the returned dataset from the server should be in the filters section. You should give these elements the `setFilter` method, as any function you give to this method will be used for `Array.filter` on the returned results. Additionally, you **must** include the prop `filterKey`, which is the key that that component's filter function is stored under. Thus, it is safe to call `setFilter` more than once for a filter Component, for example, when you are changing which times should be displayed.

## Design

I attempted to visually replicate the feel of Uber's website for this application.

## What-Ifs

The Heroku instance of this app will only have 10,000 trip records, as that is all that is allowed a free account. If I had the resources, I would upload the entire dataset for the application to query.

If I had more time, I would add additional filters and controls to the application, as well as some sort of clickable UI for defining a polygon.
