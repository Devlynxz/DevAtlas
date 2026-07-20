import client from "./client";

export const listCategories = () => client.get("/categories/");

export const getCategoryBySlug = (slug) => client.get(`/categories/${slug}`);

export const createCategory = (payload) => client.post("/categories/", payload);
