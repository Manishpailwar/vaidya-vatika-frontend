/**
 * Returns the best available image src for a product.
 * - If product has a plain imageUrl (http/https), use it.
 * - Otherwise parse mediaFiles JSON and return the first image's dataUrl.
 * - Falls back to a placeholder if nothing is found.
 */
export function getProductImage(product) {
  if (!product) return ''

  // Plain URL from imageUrl field
  if (product.imageUrl && product.imageUrl.startsWith('http')) {
    return product.imageUrl
  }

  // Base64 from uploaded mediaFiles
  if (product.mediaFiles) {
    try {
      const files = typeof product.mediaFiles === 'string'
        ? JSON.parse(product.mediaFiles)
        : product.mediaFiles
      const firstImage = Array.isArray(files) && files.find(f => f.type === 'image')
      if (firstImage && firstImage.dataUrl) return firstImage.dataUrl
    } catch {}
  }

  // Nothing found
  return ''
}