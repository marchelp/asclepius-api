const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  }
  
  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}

async function getPredictHistoriesHandler(request, h) {
  try {
    const db = new Firestore();

    const predictCollection = db.collection('prediction');
    const snapshot = await predictCollection.get();

    const histories = [];
    snapshot.forEach(doc => {
      histories.push({
        id: doc.id,
        history: doc.data()
      });
    });

    return {
      status: 'success',
      data: histories
    };
  } catch (error) {
    console.error('Error retrieving prediction histories:', error.message);
    return {
      status: 'fail',
      message: 'Failed to retrieve prediction histories'
    };
  }
}
 
module.exports = { postPredictHandler, getPredictHistoriesHandler };