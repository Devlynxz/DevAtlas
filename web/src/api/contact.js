import client from "./client";

export const submitContactMessage = (payload) => client.post("/contact/", payload);
