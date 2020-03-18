const mysql = require('mysql');
const data = require('./generateData');

const connectionOptions = {
  user: 'root',
  password: ''
}

var dbConnection = mysql.createConnection(connectionOptions);

// db connection - probably won't need this later, but here for testing
dbConnection.connect((err) => {
  if (err) {
    console.error('db connection error:', err);
    return;
  }
  console.log('connected to mysql');
});
dbConnection.query('USE etsy_products');

// // Plan - do data gen for each table, loop through returned array, and insert each line

const fillLocationsTable = function () {    /// !!! ADD CALLBACK!
  let query = "INSERT INTO locations (country, state, city) VALUES ?";
  let locations = data.generateAllLocations();
  dbConnection.query(
    query,
    [locations],
    function (err, result) {
      console.log(err);
      console.log(result);
    }
  );
};

const fillShippingTable = function () {
  let query = 'INSERT INTO shipping (type, free, timeframe) VALUES ?';
  let shippinginfo = data.generateAllShipping();
  dbConnection.query(
    query,
    [shippinginfo],
    function (err, result) {
      console.log(err);
      console.log(result);
    }
  );
};

const fillItemsTable = function () {
  let query =
    `INSERT INTO items (
      title,
      price,
      shipping_id,
      materials,
      description,
      location_id,
      policies,
      return_synopsis,
      dimensions,
      max_order_qty,
      returns_condition,
      inventory_count,
      in_other_carts,
      gift_wrap,
      faqs,
      bestseller,
      personalizable,
      handmade,
      vintage
    ) VALUES ?`;
  let itemsInfo = data.generateAllItems();
  dbConnection.query(
    query,
    [itemsInfo],
    function (err, result) {
      console.log(err);
      console.log(result);
    }
  );
};

const fillOptionsTable = function () {
  let query = 'INSERT INTO options (item_id, title, list) VALUES ?';
  let options = data.generateAllOptions();
  dbConnection.query(
    query,
    [options],
    function (err, result) {
      console.log(err);
      console.log(result);
    }
  );
};

const fillMarkdownsTable = function () {
  let query = 'INSERT INTO markdowns (item_id, discount, end_date) VALUES ?';
  let markdowns = data.generateAllMarkdowns();
  dbConnection.query(
    query,
    [markdowns],
    function (err, result) {
      console.log(err);
      console.log(result);
    }
  );
}

dbConnection.end();

exports.fillLocationsTable = fillLocationsTable;
exports.fillShippingTable = fillShippingTable;
exports.fillItemsTable = fillItemsTable;

// INSERT INTO locations (country, state, city) VALUES ?