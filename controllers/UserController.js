const User = require("../models/Users");
const asyncHandler = require('express-async-handler');
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config()

//const accoundSid = process.env.ACCOUNT_SID
//const accountToken = process.env.ACCOUNTtOKEN

//const client = require("twilio")(accoundSid,accountToken)

/* const senSMS = async (body)=>{
let msgOptions ={

  from : process.env,
  to :process.env.TO_NUMBER,
  body

}
try {
 const message =  await client.messages.create(msgOptions)
} catch (error) {
  console.log(error)
}

}
 */

const createUser = asyncHandler(async (req, res) => {
  try {
    const users = req.body;  // Le tableau d'utilisateurs envoyé dans le corps de la requête
    const todayDate1 = new Date();

    // Vérifier si le tableau d'utilisateurs est fourni
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Veuillez fournir un tableau d'utilisateurs." });
    }

    // Itérer sur chaque utilisateur et créer un utilisateur
    for (let user of users) {
      const { nom, prenom, telephone, password, userType } = user;

      // Vérifier si l'utilisateur avec le même téléphone existe déjà
      const existingUser = await User.findOne({ telephone });
      if (existingUser) {
        return res.status(400).json({ error: `Utilisateur existant avec ce téléphone : ${telephone}` });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      await User.create({
        nom,
        prenom,
        telephone,
        password: hashedPassword,
        userType,
        date_ajout: todayDate1,
      });
    }

    res.status(200).json({ message: "Utilisateurs ajoutés avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création des utilisateurs :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});






    const updatePassword = asyncHandler(async (req, res) => {
      const { id_user, oldPassword, newPassword } = req.body;
    const id  = req.params.id
   /*    if (!id_user || id_user.length !== 24) {
        return res.status(400).json({ error: "ID utilisateur non valide" });
      } */

      try {
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const isSamePassword = await bcrypt.compare(oldPassword, userToUpdate.password);
        if (!isSamePassword) {
          return res.status(400).json({ error: "L'ancien mot de passe est incorrect" });
        }

        const isOldPasswordSameAsNew = await bcrypt.compare(oldPassword, userToUpdate.password);
        if (isOldPasswordSameAsNew) {
          return res.status(400).json({ error: "Le nouveau mot de passe ne peut pas être le même que l'ancien mot de passe" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userToUpdate.password = hashedPassword;
        await userToUpdate.save();

        res.status(200).json({ status: "SUCCESS" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      }
    });



const updateUserInfo = asyncHandler(async (req, res) => {
  const id2 = req.params.id;
  const { username, nom, prenom, userType, password } = req.body;

  try {
    // Récupérer l'utilisateur courant
    const currentUser = await User.findById(req.user.id);

    // Vérifier si l'utilisateur courant est un administrateur
    if (currentUser.userType !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé : vous n\'êtes pas un administrateur' });
    }

    // Récupérer l'utilisateur à mettre à jour
    const updateUser = await User.findById(id2);

    if (!updateUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Mettre à jour le mot de passe
  //  updateUser.password = password;

    // Mettre à jour les autres informations de l'utilisateur

    updateUser.nom = nom;
    updateUser.prenom = prenom;
    if(userType !== "admin"){
    updateUser.userType = userType;
  }
    // Enregistrer les modifications
    await updateUser.save();

    res.status(200).json({ status: "SUCCESS" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});



    const updateUser = asyncHandler(async (req, res) => {
        const id2 = req.params.id;
        const { telephone, nom, prenom, userType } = req.body;

        try {
          const updateUser = await User.findById(id2)

          if (!updateUser) {
            return res.status(404).json({ error: "User not found" });
          }

          await User.findByIdAndUpdate(id2, {
            telephone: telephone,
            nom: nom,
            prenom: prenom,
            userType: userType
          }, {
            new: true
          });

          res.status(200).json({ status: "SUCCESS" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

//  UPDATE A USER

/*
router.put('/changePassword/:id', async (req, res) => {
    const id2 = req.params.id;
    const { OldPassword, NewPassword } = req.body;
    try {
      const list_user = await d_user.findOne({ where: { Id_users: id2 } });
      if (!list_user) {
        return res.status(404).json({ status: "User not found" });
      }

      const match = await bcrypt.compare(OldPassword, list_user.Password);

      if (!match) {
        return res.status(400).json({ status: "WrongPassword" });
      }

      const hash = await bcrypt.hash(NewPassword, 10);
      await d_user.update({ Password: hash }, { where: { Id_users: id2 } });

      res.json({ status: "SUCCESS" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      res.status(500).json({ status: "Erreur serveur" });
    }
  });

 */

  const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({deleteaUser});
     } catch (error) {
         throw new Error(error)
     }
});






const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  // Vérification si l'utilisateur existe
  const findUser = await User.findOne({ username });

  if (findUser && (await bcrypt.compare(password.toString(), findUser.password))) {
      const refreshToken = await generateRefreshToken(findUser._id);
      const updatedUser = await User.findByIdAndUpdate(
          findUser._id,
          { refreshToken },
          { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000 // 3 jours
      });

      // Réponse réussie avec les données de l'utilisateur
      return res.status(200).json({
          _id: updatedUser._id,
          username: updatedUser.username,
          prenom: updatedUser.prenom,
          nom: updatedUser.nom,
          userType: updatedUser.userType,
          date_ajout: updatedUser.date_ajout,
          token: generateToken(updatedUser._id)
      });
  } else {
      return res.status(401).json({ message: "Identifiants invalides" });
  }
});


const getAllUser = asyncHandler(async (req, res) => {
    try {
       const getUser = await User.find().sort({ date_ajout: -1 })

       res.json(getUser);
    } catch (error) {
        throw new Error(error)
    }
});


module.exports = {
    createUser , loginUser, getAllUser,updateUser,deleteaUser,updateUserInfo,updatePassword
}





