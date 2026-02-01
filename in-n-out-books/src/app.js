/*
Name: Kaitlyn Kelly
Date: 2/1/26
File: app.js
Description: Assignment 3.2 - Building Your Own Web Sever
*/

const express = require('express');

const app = express(); // step 3: create an express application

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