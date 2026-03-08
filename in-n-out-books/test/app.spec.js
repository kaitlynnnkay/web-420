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

  it("should return a 400 status code when updating a book with a missing a title", async () => {
    const res = await request(app).put("/api/books/1").send({
      name: "Test Book"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should log a valid user in and return a 200 status code", async () => {
    const res = await request(app)
    .post("/api/login")
    .send({
      email: "harry@hogwarts.edu",
      password: "potter"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Authentication successful");
  });

  it("should return a 401 status code when logging in with incorrect credentials", async () => {
    const res = await request(app)
    .post("/api/login")
    .send({
      email: "harry@hogwarts.edu",
      password: "potters"
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  it("should return a 400 status code when missing email or password", async () => {
    const res1 = await request(app)
    .post("/api/login")
    .send({
      email: "harry@hogwarts.edu",
    });

    expect(res1.statusCode).toEqual(400);
    expect(res1.body.message).toEqual("Bad Request");

    const res2 = await request(app)
    .post("/api/login")
    .send({
      password: "potter"
    });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Bad Request");
  })

  it("should return a 200 status code if security questions are valid", async () => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/verify-security-question").send({
      securityQuestions: [
        {answer: "Hedwig"},
        {answer: "Quidditch Through the Ages"},
        {answer: "Evans"}
      ]});

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Security questions successfully answered");
  })

  it("should return a 400 status code when the request body fails ajv validation", async () => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/verify-security-question").send({
      securityQuestions: [
        { answer: "Hedwig", question: "What is your pet's name?" },
        { answer: "Quiddith Through the Years", myName: "Harry Potter"}
      ]});

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 401 status code when security questions are incorrect", async () => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/verify-security-question").send({
      securityQuestions: [
        { answer: "Fluffy" },
        {answer: "Quidditch Through the Ages"},
        {answer: "Evans"}
      ]});

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Unauthorized");
  });
});

