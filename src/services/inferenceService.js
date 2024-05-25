const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classess = ['Cancer', 'Non-cancer'];

    const classResult = confidenceScore < 50 ? 1 : 0;
    const label = classess[classResult];

    let suggestion;

    if (label === 'Cancer') {
      suggestion = "Segera periksa ke dokter!"
    }

    if (label === 'Non-cancer') {
      suggestion = "Anda tidak mengalami kanker"
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi')
  }
}

module.exports = predictClassification;
