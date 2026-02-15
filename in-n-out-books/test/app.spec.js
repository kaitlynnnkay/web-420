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

  it("should return a 400 status code when adding a new book with missing name", async () => {
    const res = await request(app).post("/api/books").send({
      id: 6,
      author: "C.S. Lewis",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 201 status code when adding a new book", async () => {
    const res = await request(app).post("/api/books").send({
      id: 7,
      title: "The Lion, The Witch, and the Wardrobe",
      author: "C.S. Lewis",
    });

    expect(res.statusCode).toEqual(201);
  });

  it("should return a 204 status code when deleting a book", async () => {
    const res = await request(app).delete("/api/books/99");

    expect(res.statusCode).toEqual(204);
  });
});