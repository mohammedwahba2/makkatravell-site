export const PACKAGE_TYPES: Record<string, string> = { HAJJ: 'حج', UMRAH: 'عمرة', RELIGIOUS_TOUR: 'سياحة دينية', INTERNATIONAL: 'سياحة خارجية', DOMESTIC: 'سياحة داخلية' }
export const ROOMS: Record<string, string> = { DOUBLE: 'غرفة ثنائية', TRIPLE: 'غرفة ثلاثية', QUAD: 'غرفة رباعية' }
export const BOOKING_STATUS: Record<string, string> = { PENDING: 'قيد المراجعة', CONFIRMED: 'مؤكد', CANCELLED: 'ملغي', COMPLETED: 'مكتمل' }
export const PAYMENT_STATUS: Record<string, string> = { UNPAID: 'غير مدفوع', PARTIAL: 'مدفوع جزئيًا', PAID: 'مدفوع', REFUNDED: 'مسترد' }

export const nf = (n: number | string) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(n))
export const money = (n: number | string) => `${nf(n)} ج.م`
export const fdate = (d: string | Date) => new Intl.DateTimeFormat('ar-EG-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d))
export const fdateShort = (d: string | Date) => new Intl.DateTimeFormat('ar-EG-u-nu-latn', { day: 'numeric', month: 'short' }).format(new Date(d))
export const fmonth = (d: string | Date) => new Intl.DateTimeFormat('ar-EG-u-nu-latn', { month: 'long', year: 'numeric' }).format(new Date(d))
export const errMsg = (e: unknown): string => {
  const d = (e as { data?: { message?: string | string[] } })?.data?.message
  return Array.isArray(d) ? d.join('، ') : d || 'حدث خطأ غير متوقع، حاول مرة أخرى'
}
