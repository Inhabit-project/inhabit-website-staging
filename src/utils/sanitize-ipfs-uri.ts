const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

export function sanitizeIpfsUri(uri: string): string {
  if (!uri) return "";

  // If it's an ipfs:// URI
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", IPFS_GATEWAY);
  }

  // If it's a plain CID
  if (/^[a-z0-9]{46,}$/i.test(uri)) {
    return `${IPFS_GATEWAY}${uri}`;
  }

  // If it's already using a gateway (Lighthouse, Pinata, etc.), extract CID and use ipfs.io
  if (uri.includes("/ipfs/")) {
    const cidMatch = uri.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    if (cidMatch) {
      return `${IPFS_GATEWAY}${cidMatch[1]}`;
    }
  }

  // Otherwise, assume it's a valid URL and return as is
  return uri;
}
