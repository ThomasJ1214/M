// Checks if a model GLB exists; falls back to geometry if not
export async function checkAssetExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

export function getModelPath(slug: string): string {
  return `/models/${slug}/model.glb`
}

export function getImagePath(slug: string, filename: string): string {
  return `/images/${slug}/${filename}`
}

export function getHeroImage(slug: string): string {
  return `/images/${slug}/hero.webp`
}
