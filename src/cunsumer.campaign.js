'use strict';

const CampaignModel = require('./model.campaign');
const getCampaign = require('./get.campaign');

const updatePushOpen = (id, body) => {
  return CampaignModel.update(id, { $ADD: { totalPushOpen: body.totalPushOpen }, lastUpdate: body.totalPushOpen })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.error(err);
      return null;
    });
};

const _getDictionaryWithoutDuplicates = (records) => {
  const recordsWithoutDuplicates = [];
  records.forEach((item) => {
    const recordAded = recordsWithoutDuplicates[item.kinesis.partitionKey];
    if (recordAded) {
      recordAded.totalPushOpen += 1;
      recordsWithoutDuplicates[item.kinesis.partitionKey] = recordAded;
    } else {
      item.totalPushOpen = 1;
      recordsWithoutDuplicates[item.kinesis.partitionKey] = item;
    }
  });

  return recordsWithoutDuplicates;
};

module.exports = (event) => {
  const records = event.Records || [];
  console.log('records.length', records.length);
  const recordsDictionaryWithoutDuplicates = _getDictionaryWithoutDuplicates(records);

  const updatePushOpenPromises = [];
  Object.keys(recordsDictionaryWithoutDuplicates).forEach(key => {
    const id = recordsDictionaryWithoutDuplicates[key].kinesis.partitionKey;

    const totalPushOpen = recordsDictionaryWithoutDuplicates[key].totalPushOpen;

    const bufferRecord = Buffer.from(recordsDictionaryWithoutDuplicates[key].kinesis.data, 'base64').toString();
    const bodyCampaign = JSON.parse(bufferRecord);
    const lastUpdate = bodyCampaign.lastUpdate;

    updatePushOpenPromises.push(updatePushOpen(id, { totalPushOpen, lastUpdate }));
  });

  return Promise.all(updatePushOpenPromises)
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};