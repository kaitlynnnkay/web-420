/*
Name: Kaitlyn Kelly
Date: 2/8/26
File: app.spec.js
Description: Assignment 4.2
*/

const app = require("../src/app");
const request = require("supertest");

describe("Hands On 3.1: Tests", () => {
  it("it should return an array books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "The Fellowship of the Ring");
      expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
    });

  it("should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/books/foo");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
  });
});