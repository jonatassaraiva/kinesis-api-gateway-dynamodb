'use strict';

const CampaignModel = require('./model.campaign');

module.exports = (id) => {
  return CampaignModel.get(id)
    .then(result => {
      if (result) {
        return result;
      }

      const error = new Error(`Not found resource id: ${id}`);
      error.statusCode = 404;
      return Promise.reject(error);
    });;
};