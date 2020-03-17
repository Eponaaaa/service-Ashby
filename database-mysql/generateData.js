const faker = require('faker');

const generateUSlocation = function () {
  let state = faker.address.stateAbbr();
  let city = faker.address.city();
  let country = 'United States of America';
  return {country, state, city};
};

const generateLocations = function () {
  let places = [];

  for (var i = 1; i <= 50; i++) {
    let country = faker.address.country();
    if (country === 'United States of America') {
      places.push(generateUSlocation());
    } else {
      places.push({country});
    }
  }
  for (; i <= 100; i++) {
    places.push(generateUSlocation());
  }

  return places;
};

const randomNumber = function(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateStartAndEnd = function (daysWeeksMonths) {
  let start;
  let end;

  if (daysWeeksMonths === 'days') {
    start = randomNumber(6, 1);
    end = randomNumber(start + 1, 13);
  } else if (daysWeeksMonths === 'weeks') {
    start = 1;
    end = randomNumber(3, 2);
  } else {
    start = 1;
    end = 2;
  }
  return {start, end};
};

const generateShipping = function () {
  let types = ['US', 'international', 'digital', 'US', 'international'];
  let timeframes = ['days', 'weeks', 'days', 'months', 'days'];
  let shippingOptions = [];

  for (let i = 0; i < 100; i++) {
    let type = types[randomNumber(4)];
    let free;
    if (type === 'digital') {
      free = 1; // 'true'
    } else {
      free = randomNumber(1);
    };
    let timeframe = timeframes[randomNumber(4)];
    let startAndEnd = generateStartAndEnd(timeframe);
    timeframe = `${startAndEnd.start} - ${startAndEnd.end} ${timeframe}`
    let shipping = {type, free, timeframe};
    shippingOptions.push(shipping);
  }

  return shippingOptions;
};


/*
+-------------------+--------------+------+-----+---------+----------------+
| Field             | Type         | Null | Key | Default | Extra          |
+-------------------+--------------+------+-----+---------+----------------+
| `id                | int(11)      | NO   | PRI | NULL    | auto_increment |
| `title             | char(180)    | NO   |     | NULL    |                |
| `price             | float(7,2)   | NO   |     | NULL    |                |
| `shipping_id       | int(11)      | NO   | MUL | NULL    |                |
| `materials         | char(180)    | NO   |     | NULL    |                |
| `description       | text         | NO   |     | NULL    |                |
| `location_id       | int(11)      | NO   | MUL | NULL    |                |
| `policies          | text         | NO   |     | NULL    |                |
| `return_synopsis   | char(100)    | NO   |     | NULL    |                |
| `dimensions        | varchar(100) | YES  |     | NULL    |                |
| max_order_qty     | int(11)      | YES  |     | NULL    |                |
| returns_condttion | text         | YES  |     | NULL    |                |
| inventory_count   | int(11)      | YES  |     | NULL    |                |
| in_other_carts    | int(11)      | YES  |     | NULL    |                |
| gift_wrap         | tinyint(1)   | YES  |     | NULL    |                |
| faqs              | tinyint(1)   | YES  |     | NULL    |                |
| bestseller        | tinyint(1)   | YES  |     | NULL    |                |
| personalizable    | tinyint(1)   | YES  |     | NULL    |                |
| handmade          | tinyint(1)   | YES  |     | NULL    |                |
| vintage           | tinyint(1)   | YES  |     | NULL    |                |
+-------------------+--------------+------+-----+---------+----------------+

*/

// the first several are all required fields - not null
const generateTitle = function () {
  let pieces = [];
  let additional = '';

  if (randomNumber(1)) {
    pieces.push(faker.commerce.color());
  }
  if (randomNumber(1)) {
    pieces.push(faker.commerce.productAdjective());
  }
  pieces.push(faker.commerce.productName());
  if (randomNumber(1)) {
    additional = ` with ${faker.commerce.productName()}`;
  }

  let title = [...pieces].join(' ');
  title = `${title}${additional}`

  return title;
};

const generatePrice = function () {
  let price = faker.commerce.price();
  return price;
};

const generateMaterials = function () {
  let numMaterials = randomNumber(4, 1);
  let materials = new Set;
  for (let i = 1; i <= numMaterials; i++) {
    let newMat = faker.commerce.productMaterial();
    materials.add(newMat);
  }

  return [...materials].join(', ');
};

const generateDescription = function () {
  return faker.lorem.paragraphs();
};

const generatePolicies = function () {
  return faker.lorem.paragraphs();
};

const generateReturnSynopsis = function () {
  return faker.lorem.lines();
}

// the rest of these fields CAN be null
const generateDimensions = function (itemSoFar) {
  let updatedItem = {...itemSoFar};
  let dimensions = '';
  if (!randomNumber(3)) {
    let scale = ['inches' ,'feet'];
    let length = randomNumber(6, 2);
    dimensions += `Length: ${length} ${scale[randomNumber(1)]}`;
    if (!randomNumber(3)) {
      let width = randomNumber(6, 2);
      dimensions += `, Width: ${width} ${scale[randomNumber(1)]}`
    }
  }
  if (dimensions.length > 0) {
    updatedItem.dimensions = dimensions;
  }
  return updatedItem;
}


// (use randomNumber)
// generateReturnsCondition
// generateFlags

const generateItemRequiredFields = function () {
  let title = generateTitle();
  let price = generatePrice();
  let shipping_id = randomNumber(100, 1);
  let materials = generateMaterials();
  let description = generateDescription();
  let location_id = randomNumber(100, 1);
  let policies = generatePolicies();
  let returnSynopsis = generateReturnSynopsis();
  return {title, price, shipping_id, materials, description, location_id, policies, returnSynopsis};
};

const addOptionals = function (basicItem) {
  let item = generateDimensions(basicItem);

  return item;
}

const generateItem = function () {
  let item = generateItemRequiredFields();
  item = addOptionals(item);

  return item;
}

// console.log(generateShipping());
// console.log(generateLocations());
console.log(generateItem());

// generateItems();


exports.populateDb;