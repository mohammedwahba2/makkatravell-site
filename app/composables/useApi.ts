/** Typed $fetch bound to the public API. Server-side it talks to the API directly. */
export const useApi = () => {
  const base = useRuntimeConfig().public.apiBase as string
  return <T = any>(path: string, opts: Parameters<typeof $fetch>[1] = {}) => $fetch<T>(`${base}${path}`, opts as never) as Promise<T>
}
