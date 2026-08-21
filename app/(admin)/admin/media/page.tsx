import MediaLibraryScreen from "@blawness/admin-kit/screens/media";
/**
 * NOTE: Uploads require Cloudflare R2 env vars (R2_BUCKET, R2_PUBLIC_URL,
 * R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT). Until those are
 * set, the upload widget will error but the rest of the screen renders.
 */
export default MediaLibraryScreen;
