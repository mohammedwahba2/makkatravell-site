type Params = Record<string, unknown>
// our event -> [GA4, Meta Pixel, TikTok Pixel]
const MAP: Record<string, [string, string, string]> = {
  view_package: ['view_item', 'ViewContent', 'ViewContent'],
  booking_start: ['begin_checkout', 'InitiateCheckout', 'InitiateCheckout'],
  booking_submit: ['generate_lead', 'Lead', 'SubmitForm'],
  contact_whatsapp: ['contact', 'Contact', 'Contact'],
  contact_call: ['contact', 'Contact', 'Contact'],
  inquiry_submit: ['generate_lead', 'Lead', 'SubmitForm'],
}
/** Fire a conversion event to whichever tools are loaded (GA4 / Meta / TikTok). Silent no-op when none are configured. */
export const track = (name: string, params: Params = {}) => {
  if (import.meta.server) return
  const w = window as any
  const [ga, fb, tt] = MAP[name] ?? [name, name, name]
  try { w.gtag?.('event', ga, params) } catch { /* ignore */ }
  try { w.fbq?.('track', fb, params.currency ? params : { ...params }) } catch { /* ignore */ }
  try { w.ttq?.track(tt, params) } catch { /* ignore */ }
}
