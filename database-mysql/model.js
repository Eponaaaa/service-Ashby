const mysql = require('mysql');

// ***********  db connection  ***********
const connectionOptions = {
  user: 'root',
  password: '',
};

const dbConnection = mysql.createConnection(connectionOptions);
dbConnection.connect((err) => {
  if (err) {
    console.error('db connection error:', err);
    return;
  }
  console.log('connected to mysql');
});

dbConnection.query('use etsy_products');

const getData = (query, callback) => {
  dbConnection.query(query, (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};

const getItemDetails = function (itemId, callback) {
  const query = `
    select items.*,
      locations.country,
      locations.state,
      locations.city,
      shipping.type,
      shipping.free,
      shipping.timeframe
    from locations
      inner join shipping
      inner join items
    on locations.id = items.location_id
      and shipping.id = items.shipping_id
    where items.id =${itemId}
  `;
  getData(query, callback);
};

const getItemOptions = function (itemId, callback) {
  const query = `
    select
      options.title,
      options.list
    from options
      left join items
    on options.item_id = items.id
    where items.id =${itemId}
  `;
  getData(query, callback);
};

const getItemMarkdowns = function (itemId, callback) {
  const query = `
    select
      markdowns.discount,
      markdowns.end_date
    from markdowns
      left join items
    on markdowns.item_id = items.id
    where items.id =${itemId}
  `;
  getData(query, callback);
};

const selectAllItems = function (callback) {
  const query = 'select * from items';
  getData(query, callback);
};

const selectOneItem = function (itemId, callback) {
  getItemDetails(itemId, (detailsError, itemDetails) => {
    if (detailsError) {
      callback(detailsError);
    } else {
      getItemOptions(itemId, (optionsError, itemOptions) => {
        if (optionsError) {
          callback(optionsError);
        } else {
          getItemMarkdowns(itemId, (markdownsError, markdowns) => {
            if (markdownsError) {
              callback(markdownsError);
            } else {
              const item = { itemDetails, itemOptions, markdowns };
              callback(null, item);
            }
          });
        }
      });
    }
  });
};

exports.dbConnection = dbConnection;
exports.selectAllItems = selectAllItems;
exports.selectOneItem = selectOneItem;


/*
THIS GETS ITEM WITH LOCATION AND SHIPPING
select items.*, locations.country, locations.state, locations.city, shipping.type, shipping.free,
shipping.timeframe from locations inner join shipping inner join items on
locations.id = items.location_id and shipping.id = items.shipping_id where items.id = 1;

THIS GETS OPTIONS
select options.title, options.list from options left join items on options.item_id = items.id where
items.id = 55;

THIS GETS MARKDOWN
select markdowns.discount, markdowns.end_date from markdowns left join items on
markdowns.item_id = items.id where items.id = 9;
*/
