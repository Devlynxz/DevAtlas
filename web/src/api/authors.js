import client from "./client";

export const listPopularAuthors = (limit = 6) =>
  client.get("/authors/", { params: { limit } });

export const getAuthorByUsername = (username) => client.get(`/authors/${username}`);
