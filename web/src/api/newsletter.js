import client from "./client";

export const subscribeNewsletter = (email) =>
  client.post("/newsletter/subscribe", { email });
