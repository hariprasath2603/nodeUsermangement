const express = require("express");
var mongoose = require("mongoose");

var app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const db =
  "mongodb+srv://black:white@cluster0-ieokg.mongodb.net/test?retryWrites=true&w=majority";
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log("connected sucessfully ....");
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nmae is neede"]
  },
  pass: {
    type: String,
    required: [true, "Nmae is neede"]
  },
  email: {
    type: String,
    required: [true, "Nmae is neede"],
    unique: true
  },
  image: {
    type: Boolean,
    default: 0
  }
});

const userModel = mongoose.model("user", userSchema);

var getUser = async (req, res) => {
  await userModel.find({}, { name: 1 }).then(data => {
    console.log(data);
    res.status(200).json({
      data
    });
  });
};

var loginUser = async (req, res, username, password) => {
  console.log(username);
  await userModel.find({ name: username }).then(data => {
    console.log(data[0]["pass"], password);
    if (data[0]["pass"] == password)
      res.status(200).json({
        id: data[0]["id"]
      });
    else {
      res.status(401).json({
        id: "Not found"
      });
    }
  });
};

var userDetails = async (req, res, id) => {
  console.log(id);
  await userModel.findById(id).then(data => {
    if (true)
      res.status(200).json({
        data
      });
    else {
      res.status(401).json({
        id: "Not found"
      });
    }
  });
};

// let user = ["hari", "sambu", "pambu"];
// let pass = ["1234", "5678", "91011"];

app.get("/users", (req, res) => {
  getUser(req, res);
});

app.get("/usersDetails/:id", (req, res) => {
  console.log(req.params.id);

  userDetails(req, res, req.params.id);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  var username = req.body.username;
  var pass = req.body.pass;
  loginUser(req, res, username, pass);
  // if (true) {
  //   res.status(200).json({
  //     staus: "ok",
  //     id: i
  //   });
  // } else {
  //   res.status(401).send("acces denaied");
  // }
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var emailuser = req.body.email;

  console.log(username, password, emailuser);
  const testUser = new userModel({
    name: username,
    pass: password,
    email: emailuser
  });

  testUser
    .save()
    .then(doc => {
      console.log(doc);
    })
    .catch(err => {
      console.log(err);
    });

  res.status(200).send("Done");
});

app.listen(3000, () => {
  console.log("On port 3000.....");
});
