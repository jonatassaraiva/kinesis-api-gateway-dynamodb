'use strict';

const getCampaign = require('./get.campaign');
const cunsumerCampaign = require('./cunsumer.campaign');

module.exports.getCampaign = (event, context, callback) => {
  const id = event.pathParameters.campaignId;
  getCampaign(id)
    .then(result => {
      callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(result)
      });
    })
    .catch(err => {
      callback(null, {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(err)
      });
    });
};

module.exports.cunsumerCampaign = (event, context, callback) => {
  cunsumerCampaign(event)
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      callback(err);
    });
};