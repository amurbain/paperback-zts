/**
 * Extracts gallery IDs from Hitomi search results page
 */

export function parseSearchGalleryIds(html: string): string[] {
  const galleryIds: string[] = []

  // Hitomi search results use <a href="/galleries/ID.html">
  const regex = /\/galleries\/(\d+)\.html/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(html)) !== null) {
    galleryIds.push(match[1])
  }

  // Remove duplicates
  return [...new Set(galleryIds)]
}
