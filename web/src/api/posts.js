import client from "./client";

export const listPosts = (params) => client.get("/posts/", { params });

export const listMyPosts = (params) => client.get("/posts/me", { params });

export const getPostBySlug = (slug) => client.get(`/posts/${slug}`);

export const getRelatedPosts = (slug, limit = 3) =>
  client.get(`/posts/${slug}/related`, { params: { limit } });

export const getPostForEdit = (postId) => client.get(`/posts/id/${postId}`);

export const createPost = (payload) => client.post("/posts/", payload);

export const updatePost = (postId, payload) => client.patch(`/posts/${postId}`, payload);

export const deletePost = (postId) => client.delete(`/posts/${postId}`);

export const uploadPostCoverImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return client.post("/posts/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
