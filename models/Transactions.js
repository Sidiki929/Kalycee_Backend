const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
  id_client: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  transfertType: {
    type: String,
    enum: ["envoi", "retrait"],
    required: true
  },
  transfertState: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending"
  },
  date_transaction: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transactions', TransactionsSchema);
