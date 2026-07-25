// Prefixes a public/-relative path with Vite's configured base URL (e.g. '/' in dev, '/wildlife-explorer/'
// in the GitHub Pages build). Raw '/assets/...' string literals resolve from the domain root and break
// once the app is served from a subpath - always go through this helper instead.
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
