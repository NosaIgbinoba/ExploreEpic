const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const async = require("hbs/lib/async");
const connectToDatabase = require("./mongodb");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const axios = require('axios');

// Register a Handlebars helper named "eq" to compare two values for equality
hbs.registerHelper("eq", function (arg1, arg2, options) {
  return arg1 == arg2;
});

// Configure Express middleware and settings
const templatePath = path.join(__dirname, "templates");
const publicPath = path.join(__dirname, "public");
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


// Configure session management middleware using express-session
app.use(session({
  secret: "gI53K93Qp5gKkzFn6ZoLW0BSli9l46u01yTz",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://exploreepicdatabase:80l4sRze5uQpbqlRCGdT7d5htDwiOadyVok0djJknNt4TFIu0occtM9dTbSzgMiQFQFDw8HnwZyWACDbj7bIXQ==@exploreepicdatabase.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@exploreepicdatabase@',
    ttl: 14 * 24 * 60 * 60 
  })
}));

let COUNTRIES = [];

app.get("/", (req, res) => {
  // Check if a user is logged in by examining the session data.
  const loggedIn = req.session.user != null;
    // Render the "home" view and pass the loggedIn flag to the template.
  res.render("home", { loggedIn: loggedIn });
});


// Define a route for handling GET requests to the "/signup" endpoint
app.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
    return;
  }

  res.render("signup");
});


// Define a route for handling GET requests to the "/login" endpoint
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  } 

  res.render("login");
});


app.post("/signup", async (req, res) => {
  try {
    // Check if the username already exists in the database.
    const existingUser = await collection.findOne({ name: req.body.name });

    // If the username exists, send a 400 status with an error message.
    if(existingUser){
      res.status(400).send("Username Already Taken");
      return;
    }

    // Hash the password using bcrypt.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

     // Prepare the data for insertion into the database.
    const data = {
      name: req.body.name,
      password: hashedPassword
    };

    // Insert the user data into the database.
    await collection.insertMany([data]);
    // Redirect to the "/login" page upon successful account creation.
    res.redirect("/login");
  } catch (error) {
    // Log and send an error message if an exception occurs during the process.
    console.error($`Error /signup - ${error}`);
    res.send("Error Creating account");
  }
});

app.post("/login", async (req, res) => {
  try {
    // Retrieve the user from the database based on the provided username.
    const user = await collection.findOne({ name: req.body.name });
    // Compare the provided password with the hashed password stored in the database.
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    
    // If the credentials are valid, set the user session and redirect to the home page.
    if (user && isPasswordValid) {
      req.session.user = user;
      res.redirect("/");

      return;
    }

    // If the credentials are invalid, send a response indicating invalid credentials.
    res.send("Invalid credentials");
  } catch (error) {
    // Log and send an error message if an exception occurs during the process.
    console.error(`Error /login - ${error}`)
    res.send("Server error occured");
  }
});

app.get("/logout", (req, res) => {
  // Destroy the user session when logout is pressed.
  req.session.destroy((err) => {
    // Log and handle errors if they occur during the session destruction.
    if (err) {
      console.error(`Error /logout - ${err}`)
    }

    // Redirect to the home page ("/") after session destruction.
    res.redirect("/");
  });
});

app.get("/profile", (req,res) => {
  // Check if a user is logged in by examining the session data.
  if (req.session.user) {
    // If the user is logged in, render the "profile" view with user data.
    res.render("profile", { loggedIn: true, name: req.session.user.name });
    return;
  }

  res.redirect("login");
})

app.get("/about", (req, res) => {
  const loggedIn = req.session.user != null;
  res.render("about", { loggedIn: loggedIn });
});


app.get("/blog", async (req,res) => {
  // Retrieve blog posts from the database using aggregation.
  const blogs = await collection.aggregate([
    { $unwind: "$posts" },
    { $replaceRoot: { newRoot: "$posts" } }
  ]);

  // If the list of countries is not populated, fetch and store country data.
  if (COUNTRIES.length == 0) {
    let countriesRepsonse = await fetch('https://countriesnow.space/api/v0.1/countries/flag/unicode');
    let countriesJson = await countriesRepsonse.json();

    COUNTRIES = countriesJson.data;
  }

  // Check if a user is logged in by examining the session data.
  const loggedIn = req.session.user != null;

  // Render the "blog" view with data including user login status, username, country list, and blog posts.
  res.render("blog", { loggedIn: loggedIn, name: req.session?.user?.name, countries: COUNTRIES, blogs: blogs });
})

// Handle POST requests to "/update" endpoint:
// - Check if user is logged in.
// - Validate password.
// - Update user's name and save changes.
// - Handle errors, including duplicate name.
// - Redirect to "/profile" upon successful update.
app.post("/update", async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: "Request body missing" });
  }

  if (!req.session.user) {
    return res.status(403).send({ error: "Access Denied" });
  }

  const user = await collection.findOne({ name: req.session.user.name });

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (!isPasswordValid) {
    return res.status(400).send({ error: "Invalid username or password" });
  }
  
  user.name = req.body.name;

  if (user.posts != null) {
    user.posts = user.posts.map(post => {
      post.username = req.body.name;
      return post;
    });

    user.markModified("posts");
  }

  try {
    await user.save();
    req.session.user = user;
    return res.status(200).send({ message: "User updated" });
  } catch (err) {
      console.error(`Error /update - ${err}`)
      if (err.code == 11000) {
        return res.status(400).send({ error: "Username already taken" });
      }

      return res.status(500).send({ error: "Server error occured" });
  }
});


// Handle POST requests to "/delete" endpoint:
// - Check if user is logged in.
// - Find and delete user from the collection.
// - Destroy user session.
// - Handle errors.
// - Redirect to "/" upon successful deletion.
app.post("/delete", async (req, res) => {
  if (!req.session.user) {
    res.send("Access Denied");
    return;
  }

  const user = await collection.findOne({ id: req.session._id, name: req.session.user.name });

  if (!user) {
    res.send("User does not exist");
    return;
  }

  await collection.deleteOne({ _id: user._id, name: user.name });

  req.session.destroy((err) => {
    if (err) {
      console.error(`Error /delete - ${err}`)
    }

    res.redirect("/");
  });
});


// Handle POST requests to "/submit" endpoint:
// - Check if user is logged in.
// - Validate required fields.
// - Add a new post to the user's profile.
// - Save changes and update user session.
// - Handle errors.
// - Redirect to "/blog" upon successful submission.
app.post("/submit", async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: "Request body missing" });
  }

  if (!req.session.user) {
    return res.status(403).send({ error: "Access Denied" });
  }

  const user = await collection.findOne({ name: req.session.user.name });

  if (!user) {
    return res.status(400).send({ error: "User does not exist" });
  }

  if (req.body.country == "") {
    return res.status(400).send({ error: "Country required" });
  }

  if (req.body.city == "") {
    return res.status(400).send({ error: "City required" });
  }

  if (req.body.review === "") {
    return res.status(400).send({ error: "Review required" });
  }

  user.posts.push({
    id: user.posts.length,
    username: req.session.user.name,
    country: req.body.country,
    city: req.body.city,
    review: req.body.review
  });

  try {
    await user.save();
    req.session.user = user;

    return res.status(200).send({ message: "Post submitted" });
  }
  catch (err) {
    console.error(`Error /update - ${err}`)
    return res.status(500).send({ error: "Server error" });
  }
});

// Handle POST requests to "/delete-post" endpoint:
// - Check if user is logged in.
// - Find and delete the specified post.
// - Save changes and update user session.
// - Handle errors.
// - Redirect to "/blog" upon successful post deletion.
app.post('/delete-post', async (req, res) => {
  if (!req.session.user) {
    res.send("Access Denied");
    return;
  }

  const user = await collection.findOne({ name: req.session.user.name });

  if (!user) {
    res.send("User does not exist");
    return;
  }

  const post = user.posts.find(post => post.id == req.body.id);

  if (!post) {
    res.send("Post does not exist");
    return;
  }

  user.posts = user.posts.filter(post => post.id != req.body.id);
  req.session.user = user;

  try {
    await user.save();
    res.redirect("/blog");
  }
  catch (err) {
    console.error(`Error /update - ${err}`)
    res.send("Server error occured");
  }
});

connectToDatabase()
  .then((collection) => {
    // Use the collection/model here if needed in your routes or other parts of the app
    // For instance, you can pass 'collection' as an argument to your routes
    app.set("collection", collection);

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start the server:", error);
  });
