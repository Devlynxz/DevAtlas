import client from "./client";

export const registerUser = (payload) => client.post("/auth/register", payload);

export const loginUser = (payload) => client.post("/auth/login", payload);

export const forgotPassword = (payload) => client.post("/auth/forgot-password", payload);

export const fetchMyProfile = () => client.get("/users/");

export const updateMyProfile = (payload) => client.patch("/users/me", payload);

export const uploadMyAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return client.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteMyAvatar = () => client.delete("/users/me/avatar");
