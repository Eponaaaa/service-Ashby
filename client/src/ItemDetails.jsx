import React from 'react';
import axios from 'axios';
import CostContainer from './CostComponents/CostContainer';
import OptionsContainer from './OptionComponents/OptionsContainer';
import DetailsContainer from './DetailsComponents/DetailsContainer';
import ShippingContainer from './ShippingComponents/ShippingContainer';
import PoliciesContainer from './PoliciesComponents/PoliciesContainer';

function getItem(callback) {
  return axios.get('/item/5')
    .then((response) => {
      console.log('data fetched');
      callback(null, response);
    })
    .catch((error) => {
      callback(error);
    });
}

function getCostData(data) {
  // console.log('get cost data from', data);
  const itemDetails = data.itemDetails[0];
  // console.log('item details', itemDetails);
  const markdowns = data.markdowns[0];
  let discount;
  let endDate;
  if (!markdowns) {
    discount = 0;
    endDate = '';
  } else {
    discount = markdowns.discount;
    endDate = markdowns.end_date;
  }
  // console.log('item details', itemDetails);
  // console.log('markdowns', markdowns);
  const { id } = itemDetails;
  const { bestseller } = itemDetails;
  const { price } = itemDetails;
  const result = {
    id, bestseller, price, discount, endDate,
  };

  return result;
}

function getDetailsData({ itemDetails }) {
  const { id } = itemDetails;
  const { handmade } = itemDetails;
  const { vintage } = itemDetails;
  const { materials } = itemDetails;
  const { dimensions } = itemDetails;
  const { description } = itemDetails;
  const result = {
    id, handmade, vintage, materials, dimensions, description,
  };
  /*
id
handmade
vintage
materials
dimensions
description
*/
  return result;
}

function getOptionData({ itemDetails, itemOptions }) {
  const { id } = itemDetails;
  const options = itemOptions;
  const { personalizable } = itemDetails;
  const maxOrderQty = itemDetails.max_order_qty;
  const inventoryCount = itemDetails.inventory_count;
  const inOtherCarts = itemDetails.in_other_carts;
  const { type } = itemDetails;
  const { free } = itemDetails;
  const result = {
    id, options, personalizable, maxOrderQty, inventoryCount, inOtherCarts, type, free,
  };
  /*
id
options - array of 0 to 3, each with title and string list
personalizable
max_order_qty
inventory_count,
in_other_carts,

& shipping info:
type --> shipping
free --> shipping
*/
  return result;
}

function getPoliciesData({ itemDetails }) {
  const { id } = itemDetails;
  const { policies } = itemDetails;
  const returnsCondition = itemDetails.returns_condition;
  const giftWrap = itemDetails.gift_wrap;
  const { faqs } = itemDetails;
  const result = {
    id, policies, returnsCondition, giftWrap, faqs,
  };
  /*
id
policies
returns_condition
gift_wrap
faqs
*/
  return result;
}

function getShippingData({ itemDetails }) {
  const { id } = itemDetails;
  const shipType = itemDetails.type;
  const freeShip = itemDetails.free;
  const { timeframe } = itemDetails;
  const { country } = itemDetails;
  const { state } = itemDetails;
  const { city } = itemDetails;
  const result = {
    id, shipType, freeShip, timeframe, country, state, city,
  };
  /*
id
type,   --last three refer to shipping
free,
timeframe
country
state
city
*/
  return result;
}

class ItemDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      cost: {},
      options: {},
      details: {},
      policies: {},
      shipping: {},
    };
  }

  componentDidMount() {
    getItem((err, { data }) => {
      if (err) {
        console.log(err);
      } else {
        this.updateItem(data);
      }
    });
  }

  updateItem(data) {
    console.log('data fetched:', data);
    const costData = getCostData(data);
    console.log('cost data put together:', costData);
    const optionData = getOptionData(data);
    const detailsData = getDetailsData(data);
    const shippingData = getShippingData(data);
    const policiesData = getPoliciesData(data);
    this.setState({
      cost: costData,
      options: optionData,
      details: detailsData,
      shipping: shippingData,
      policies: policiesData,
    });
  }

  // function ItemDetails() {
  render() {
    const {
      cost, options, details, shipping, policies,
    } = this.state;
    console.log('just before render, cost data is', cost);
    return (
      <div className="item-details">
        <h1 className="item-name">item name goes here</h1>
        <CostContainer costData={cost} />
        <OptionsContainer optionsData={options} />
        <DetailsContainer detailsData={details} />
        <ShippingContainer shippingData={shipping} />
        <PoliciesContainer policiesData={policies} />
      </div>
    );
  }
}

export default ItemDetails;

/*
response: {
  data: {
    itemDetails: [{
      id,
      title,
      price,
      shipping_id,
      materials,
      description,
      locations_id,
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
      vintage,
      country,
      state,
      city,
      type,   --last three refer to shipping
      free,
      timeframe

    }],
    itemOptions: [   --> this can have 0 to three entries, each an object with following shape
      {
        title,
        list
      }
    ],
    markdowns: [{
      discount,
      end_date
    }]
  }
}

*/
