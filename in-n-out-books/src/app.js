/*
Name: Kaitlyn Kelly
Date: 2/1/26
File: app.js
Description: Assignment 3.2 - Building Your Own Web Sever
*/

const express = require('express');
const books = require("../database/books");
const users = require("../database/users");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Ajv = require("ajv");
const ajv = new Ajv();

const app = express(); // step 3: create an express application
app.use(express.json());

// ajv json schema
const securityQuestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      answer: { type: "string" }
    },
    required: ["answer"],
    additionalProperties: false
  }
};

// step 4: add a get route to the root url with a fully designed landing page
app.get("/", async (req, res, next) => {

  // html content for the landing page
  const html = `
  <html>
    <head>
      <title>In-n-Out Books</title>
      <style>
        body, h1 {margin: 0; padding: 0; border: 0;}
        body {
          background: #eee0cb;
          margin: 0 auto;
        }
        h1 {
          color: #373f47;
          font-family: 'Garamond', serif;
          font-size: 3.2em;
          text-align: center;
          padding: 15px;
          font-style: italic;
        }
        h2 {
          color: #03192D;
          font-family: 'Garamond', serif;
          font-size: 1.75em;
          text-align: center;
          padding: 10px;
          font-style: italic;
          background: #AD622D;
          border: double;
        }
        #intro, #bestsellers, #hours, #contact {
          margin-top: 30px;
          margin-right: 30px;
          margin-left: 30px;
          color: #373f47;
          font-family: 'Garamond', serif;
          font-size: 1.1em;
        }
        p, ol, li {
          color: #373f47;
          font-family: 'Garamond', serif;
          font-size: 1.1em;
        }
        nav {
          background: #AD622D;
          padding: 15px;
          margin-top: 20px;
          margin-bottom: 20px;
          text-align: center;
        }
        nav, nav a {
          color: #eee0cb;
          font-family: 'Garamond', serif;
          font-size: 1.25em;
          font-weight: bold;
          font-style: italic;
          text-decoration: none;
        }
        nav a:hover {
          color: #03192D;
        }
        nav a:visited {
          color: #B2A590;
        }
      </style>
    </head>
    <body>
      <div>
        <header>
        <h1>In-n-Out Books</h1>
        </header>
      </div>
      <nav>
        <a href="/">Home</a> |
        <a href="/books">Books</a> |
        <a href="/contact">Contact</a> |
        <a href="/profile">My Profile</a>
      </nav>
      <main>
        <div id="intro">
          <p>Inspired by the love of books, In-N-Out Books is a platform for readers to organize, share, and explore the books in your collection.</p>
        </div>
        <h2>Best Sellers</h2>
        <div id="bestsellers">
          <ol>
            <li>Book 1</li>
            <li>Book 2</li>
            <li>Book 3</li>
          </ol>
        </div>
        <h2>Hours of Operation</h2>
        <div id="hours">
         <p>Always Open!</p>
        </div>
        <h2>Contact Us</h2>
        <div id="contact">
          <p>Coming Soon...</p>
      </main>
    </body>
  </html>
  `; // end html content for landing page



  res.send(html); // sends html content to the client
});

// get all books from book.js
app.get("/api/books", async (req, res, next) => {
  try {
    const allBooks = await books.find();
    console.log("All Books: ", allBooks);
    res.send(allBooks);
  } catch (err) { // catch and record error, if an error
    console.error("Error: ", err.message);
    next(err);
  }
});

app.post("/api/books", async (req, res, next) => {
  try {
    const newBook = req.body;

    const expectedKeys = ["id", "title", "author"];
    const receivedKeys = Object.keys(newBook);

    if(!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length){
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await books.insertOne(newBook);
    console.log("Result: ", result);
    res.status(201).send(newBook);
  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

// post route to login a user with a 200-status code & message
// return an error if email or password are missing
app.post("/api/login", async (req, res, next) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return next(createError(400, "Bad Request"));
    }

    // look up user in database
    const user = await users.findOne(1);

    // if user doesn't exist, throw an error to prevent program from crashing
    if (!user) {
      return next(createError(401, "Unauthorized"));
    }

    // compare entered password to user's password
    const validPassword = bcrypt.compareSync(password, user.password);

    // if passwords don't match, throw an error
    if (!validPassword) {
      return next(createError(401, "Unauthorized"));
    }

    // success if no errors
    res.status(200).json({ message: "Authentication successful" });
  } catch (err) {
    next(err);
  }
})


// post route to verify a user's security questions
// returns a 200 status with "security questions successfully answered"
// if answers do not match, throw a 401 error with "unauthorized"
app.post("/api/users/:email/verify-security-question", async (req, res, next) => {
  try {
    const {email} = req.params;
    const {securityQuestions} = req.body;

    // check if securityQuestions is valid compared to schema
    // if not valid, throw an error
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(securityQuestions);

    if (!valid) {
      console.error("Bad Request");
      return next(createError(400, "Bad Request"));
    }

    const user = await users.findOne({email: email});

    // if user does not exist, throw an error to prevent crashing
    if (!user) {
      return next(createError(401, "Unauthorized"));
    }

    // checks if security question answers entered match the security questions of the user
    // throw an error if not
    if (securityQuestions[0].answer !== user.securityQuestions[0].answer || securityQuestions[1].answer !== user.securityQuestions[1].answer || securityQuestions[2].answer !== user.securityQuestions[2].answer) {
      console.error("Unauthorized");
      return next(createError(401, "Unauthorized"));
    }

    // success if no errors
    res.status(200).json({ message: "Security questions successfully answered" });
  } catch (err) {
    next(err);
  }
});


// get a specific book from books.js
// error handling for if id in NaN
app.get("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    const book = await books.findOne({ id: id });

    if (!book) {
      return next(createError(404, "Book not found"));
    }

    res.send(book);
  } catch (err) {
    next(err);
  }
});

// delete a book with a 204 return, even if no entry deleted
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await books.deleteOne({ id: parseInt(id) });

    res.status(204).send();
  } catch (err) {
    if (err.message === "No matching item found") {
      return res.status(204).send();
  }
  next(err);
  }
});

// put endpoint
app.put("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let book = req.body;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    if (!book.title) {
      return next(createError(400, "Bad Request"));
    }

    const result = await books.updateOne(id, book);
    console.log("Result: ", result);

    res.status(204).send();
  } catch (err) {
    if (err.message === "No matching item found") {
      console.log("Book not found", err.message)
      return next(createError(404, "Book not found"));
    }
    console.error("Error: ", err.message);
    next(err);
  }
});

// step 5: add middleware function to handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

// step 5 & 6: add middleware function to handle 500 errors, and return a JSON response with details
 app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development'?err.stack:undefined
  });
 });


module.exports = app; // step 7: export the express application