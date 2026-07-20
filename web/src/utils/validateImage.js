const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Please upload a PNG, JPEG, or WEBP image.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Image must be smaller than 5MB.";
  }
  return null;
}
