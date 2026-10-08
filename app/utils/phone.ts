const AR = '٠١٢٣٤٥٦٧٨٩', FA = '۰۱۲۳۴۵۶۷۸۹'
/** Arabic/Persian digits -> latin, strip spaces/dashes, +20 / 0020 -> 0. */
export const normalizePhone = (v: string) =>
  v.replace(/[٠-٩۰-۹]/g, (d) => String(AR.includes(d) ? AR.indexOf(d) : FA.indexOf(d))).replace(/[\s\-().]/g, '').replace(/^(\+?20|0020)/, '0')
export const isEgMobile = (v: string) => /^01[0125]\d{8}$/.test(normalizePhone(v))
