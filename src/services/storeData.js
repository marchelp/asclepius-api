const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set({
    id: data.id,
    result: data.result,
    suggestion: data.suggestion,
    createdAt: data.createdAt
  });
}
 
module.exports = storeData;