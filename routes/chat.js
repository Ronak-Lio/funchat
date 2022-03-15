const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const { v4: uuidv4 } = require("uuid");
const { JWT_SECRET } = require("../config/keys");
const { request } = require("express");
const names = require("../app");

router.get("/chatDetails/:chatId", requireLogin, (req, res) => {
  const { chatId } = req.params;

  User.findById(chatId)
    .select("name email pic")
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/allCollectionNames", requireLogin, (req, res) => {
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    if (err) {
      console.log(err);
    } else {
      console.log(names);
      res.send(names);
    }
  });
});

router.post("/sendMessage", requireLogin, (req, res) => {
  const { collectionName, messageInfo } = req.body;

  const { ObjectId } = mongoose.Schema.Types;

  const messageSchema = new mongoose.Schema(
    {
      senderId: {
        type: ObjectId,
        required: true,
        ref: "User",
      },
      message: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  const newId = uuidv4();

  mongoose.model(newId, messageSchema, collectionName);

  const Message = mongoose.model(newId);

  const message = new Message({
    senderId: req.user._id,
    message: messageInfo,
    name: req.user.name,
  });

  message
    .save()
    .then((message) => {
      res.json({ message: "Successfully saved" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getMessages/:collectionName", requireLogin, (req, res) => {
  const { collectionName } = req.params;

  const { ObjectId } = mongoose.Schema.Types;

  let message1Schema = new mongoose.Schema(
    {
      senderId: {
        type: ObjectId,
        required: true,
        ref: "User",
      },
      message: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  const newId1 = uuidv4();

  mongoose.model(newId1, message1Schema, collectionName);

  let Message1 = mongoose.model(newId1);

  Message1.find()
    .sort({ createdAt: "desc" })
    .populate("senderId", "name")
    .then((messages) => {
      res.json({ messages });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/allusers", requireLogin, (req, res) => {
  User.find()
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/addChat", requireLogin, (req, res) => {
  const chatId = req.body.userId;
  const newChat = {
    userId: req.body.userId,
    collectionName: req.body.collectionName,
    type: "SingleUser",
  };

  if (!newChat) {
    return res.status(422).json({ error: "Given user does not exist" });
  }

  User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { chats: newChat },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .exec((err, result1) => {
      if (err) {
        return res.status(422).json({ error: err });
      }

      User.findByIdAndUpdate(
        chatId,
        {
          $push: {
            chats: {
              userId: req.user._id,
              collectionName: req.body.collectionName,
              type: "SingleUser",
            },
          },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .exec((err, result) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json(result1);
        });
    });
});

router.put("/createGroup", requireLogin, (req, res) => {
  const { participants, groupName } = req.body;
  console.log("GroupName is ", groupName);
  const newChat = {
    userId: req.user._id,
    collectionName: groupName,
    type: "Group",
  };

  if (!newChat) {
    return res.status(422).json({ error: "Given user does not exist" });
  }

  for (let i = 0; i < participants.length; i++) {
    console.log("Participants[i] is ", participants[i]);
    User.findByIdAndUpdate(
      participants[i],
      {
        $push: {
          chats: {
            userId: req.user._id,
            collectionName: groupName,
            type: "group",
          },
        },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
    });
  }

  User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        chats: {
          userId: req.user._id,
          collectionName: groupName,
          type: "group",
        },
      },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      res.json(result);
    });
});

module.exports = router;
