const Transactions = require("../models/Transactions")
const asyncHandler = require('express-async-handler');
/* const createTransactions = asyncHandler(async (req, res) => {
  try {
    const transactionsArray = req.body;

    // Vérifier si req.body est un tableau
    if (!Array.isArray(transactionsArray)) {
      return res.status(400).json({ message: 'Données invalides, un tableau est attendu.' });
    }

    // Vérifier que chaque transaction contient les champs requis
    for (let transaction of transactionsArray) {
      const { id_client, amount, transfertType, transfertState } = transaction;
      if (!id_client || !amount || !transfertType || !transfertState) {
        return res.status(400).json({ message: 'Tous les champs sont requis pour chaque transaction.' });
      }
      transaction.date_transaction = new Date();
    }

    // Insérer toutes les transactions en une seule fois
    const newTransactions = await Transactions.insertMany(transactionsArray);
    res.status(201).json(newTransactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}); */
const createTransactions = asyncHandler(async (req, res) => {
  try {
    const { id_client, nom, prenom, amount, transfertType, transfertState } = req.body;

    // Vérifier que tous les champs requis sont présents
  /*   if (!id_client || !nom || !prenom || !amount || !transfertType) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    } */

    // Validation du montant (doit être un nombre positif)
    if (amount <= 0) {
      return res.status(400).json({ message: 'Le montant doit être positif' });
    }
    const newTransaction = new Transactions({
      id_client,
      nom,
      prenom,
      amount,
      transfertType,
      transfertState: transfertState || "pending",
      date_transaction: Date.now()
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  const getAllTransactions =  asyncHandler(async (req, res) => {
    try {
        const getTransactions = await Transactions.find().sort({ date_transaction: -1 });
        res.json(getTransactions);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteTransactions = asyncHandler(async (req, res) => {
    const { id } = req.params;
   // validateMongoDbId(id);   
    try {
        const deleteUnites = await Transactions.findByIdAndDelete(id);
        res.json({deleteUnites});
     } catch (error) {
         throw new Error(error)
     }
});
const updateTransactions = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Rechercher la transaction par son ID
        const transaction = await Transactions.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction non trouvée' });
        }

        // Modifier le statut de "pending" à "accepted" si applicable
        const newStatus = transaction.transfertState === "pending" ? "accepted" : transaction.transfertState;

        // Mettre à jour la transaction avec le nouveau statut
        const updatedTransaction = await Transactions.findByIdAndUpdate(
            id,
            { transfertState: "accepted" },
            { new: true } // Retourner la transaction mise à jour
        );

        res.json(updatedTransaction);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la transaction:', error);
        res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de la transaction" });
    }
});



module.exports = { createTransactions , getAllTransactions, deleteTransactions,updateTransactions }
