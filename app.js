const express = require("express");

const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

const { MONGOURI } = require("./config/keys");
const Pusher = require("pusher");
require("./models/user");
const User = mongoose.model('User');


mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo YEAH RONAK");

  mongoose.connection.db.listCollections().toArray(function (err, names) {
    if (err) {
      console.log(err);
    } else {
      console.log(names);
      module.export = names;

      for (var i = 0; i < names.length; i++) {
        const db = mongoose.connection;
        const msgCollection = db.collection(names[i]?.name);

        const changeStream = msgCollection.watch();

        const channelName = names[i]?.name;

        changeStream.on("change", (change) => {
          console.log("Names are ", channelName);
          if (change.operationType === "insert" && channelName !== "users") {
            const messageDetails = change.fullDocument;
            pusher.trigger(channelName, "inserted", {
              name: messageDetails.name,
              message: messageDetails.message,
            });
            console.log("Trigerred Pusher");
          } else if (
            change.operationType === "update" &&
            channelName === "users"
          ) {
            const id = change.documentKey;
            console.log("Document Updated", id);

            User.findById(id).then(user => {
              console.log("User is " , user);
             const newChat = user?.chats[user?.chats?.length-1]
             pusher.trigger(user?.email, "updated", {
                newChat : newChat
            });
            })

            console.log("Trigerred Pusher");
          } else {
            console.log("Error triggering Pusher");
          }
        });
      }
    }
  });
});

mongoose.connection.on("error", (err) => {
  console.log("ERR Connecting", err);
});

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/chat"));

const pusher = new Pusher({
  appId: "1356377",
  key: "8dc14cf4580bd19ab156",
  secret: "4591ec5148adf3114227",
  cluster: "ap2",
  useTLS: true,
});

app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
