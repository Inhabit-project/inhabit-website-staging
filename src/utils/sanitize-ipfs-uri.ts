export function sanitizeIpfsUri(uri: string): string {
  if (!uri) return "";

  // If it's an ipfs:// URI
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://gateway.lighthouse.storage/ipfs/");
  }

  // If it's a plain CID
  if (/^[a-z0-9]{46,}$/.test(uri)) {
    return `https://ipfs.io/ipfs/${uri}`;
  }

  // If it's using a gateway (e.g. Pinata), extract the CID and rewrite it to ipfs.io
  const gatewayMatch = uri.match(/\/ipfs\/([^/?]+)/);
  if (gatewayMatch) {
    return `https://ipfs.io/ipfs/${gatewayMatch[1]}`;
  }

  // Otherwise, assume it's a valid URL and return as is
  return uri;
}
