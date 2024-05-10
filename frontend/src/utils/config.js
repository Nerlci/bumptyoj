export const baseApi = process.env.VUE_APP_API_URL || "";

export function handleUrl(Url) {
  return this.baseApi + "/" + Url;
}
