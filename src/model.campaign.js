'use strict';

const dynamoose = require('dynamoose');
const uuidv4 = require('uuid/v4');

const CampaignSchema = new dynamoose.Schema({
  campaignId: {
    type: String,
    hashKey: true
  },
  totalPushOpen: Number,
  lastUpdate: Number
});

module.exports = dynamoose.model('campaign-v1', CampaignSchema, { waitForActive: false});