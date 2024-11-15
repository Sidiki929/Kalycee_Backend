const express = require('express');
const { createTransactions, updateTransactions,getAllTransactions,deleteTransactions } = require("../controllers/TransactionsController")
const router = express.Router()


router.post("/create",createTransactions)
router.put("/update/:id",updateTransactions)
router.delete("/delete/:id",deleteTransactions)
router.get("/getall",getAllTransactions)


module.exports = router