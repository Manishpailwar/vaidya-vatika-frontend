/**
 * Returns the best available image src for a product.
 *
 * Priority:
 *   1. imageUrl field — always an https:// Cloudinary URL for new products
 *   2. First image entry in mediaFiles JSON (url field, then legacy dataUrl fallback)
 *   3. Empty string if nothing is found
 *
 * The old code allowed base64 dataUrls to be stored in mediaFiles/imageUrl.
 * New uploads go through Cloudinary so dataUrl will never appear in fresh records,
 * but the fallback below keeps old data rendering until it's re-saved.
 */
export function getProductImage(product) {
  if (!product) return ''

  // 1 — imageUrl is the primary field; after the Cloudinary migration it's always https://
  if (product.imageUrl && product.imageUrl.startsWith('http')) {
    return product.imageUrl
  }

  // 2 — Parse mediaFiles JSON and return the first image URL
  if (product.mediaFiles) {
    try {
      const files = typeof product.mediaFiles === 'string'
        ? JSON.parse(product.mediaFiles)
        : product.mediaFiles
      if (Array.isArray(files)) {
        const firstImage = files.find(f => f.type === 'image')
        if (firstImage) {
          // New records have .url; old records may still have .dataUrl
          return firstImage.url || firstImage.dataUrl || ''
        }
      }
    } catch {}
  }

  // 3 — Nothing found
  return ''
}