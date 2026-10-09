/** Downscale + re-encode a photo in the browser (phones produce 5-10 MB files; the host rejects bodies above 4.5 MB). */
export async function compressImage(file: File, max = 1800): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  if (file.size < 700_000) return file
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    const blob = await new Promise<Blob | null>((res) => c.toBlob(res, 'image/jpeg', 0.85))
    return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file
  } catch { return file }
}
