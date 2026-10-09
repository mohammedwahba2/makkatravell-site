import { defineConfig, presetWind4, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetIcons({ scale: 1.15, extraProperties: { display: 'inline-block', 'vertical-align': 'middle', 'flex-shrink': '0' } })],
  transformers: [transformerDirectives()],
  theme: {
    font: { sans: "'IBM Plex Sans Arabic', system-ui, sans-serif", display: "'El Messiri', 'IBM Plex Sans Arabic', sans-serif", num: "'IBM Plex Sans Arabic', system-ui, sans-serif" },
    colors: {
      brand: { 50: '#FBF8F3', 100: '#F5EFE7', 200: '#E8DCCB', 300: '#D9B79A', 400: '#C98F68', 500: '#A56F4D', 600: '#85573B', 700: '#5C3A28', 800: '#472C1F', 900: '#3B2418', 950: '#241811' },
      gold: { 300: '#EBCB84', 400: '#D4A24C', 500: '#BE8A33' },
    },
    breakpoint: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  },
  shortcuts: {
    wrap: 'mx-auto w-full max-w-[1240px] px-5 sm:px-8',
    eyebrow: 'inline-flex items-center gap-2 text-[13px] font-bold tracking-[.14em] text-brand-500',
    'h-display': 'font-display font-semibold leading-[1.18] tracking-tight text-brand-950',
    btn: 'inline-flex h-12 cursor-pointer select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-7 text-[15px] font-bold transition-all duration-300 will-change-transform',
    'btn-dark': 'btn bg-brand-900 text-brand-50 hover:bg-brand-950 hover:shadow-[0_12px_30px_-10px_rgb(36_24_17/.6)]',
    'btn-copper': 'btn bg-gradient-to-l from-brand-500 to-brand-400 text-white hover:shadow-[0_14px_34px_-10px_rgb(165_111_77/.8)]',
    'btn-line': 'btn border border-brand-300 text-brand-800 hover:bg-brand-900 hover:text-brand-50 hover:border-brand-900',
    'btn-line-light': 'btn border border-white/30 text-white hover:bg-white hover:text-brand-900',
    input: 'h-12 w-full rounded-xl border border-brand-200 bg-white px-4 text-[15px] text-brand-950 outline-none transition placeholder:text-brand-400/80 focus:border-brand-500 focus:ring-4 focus:ring-brand-400/15',
    label: 'mb-1.5 block text-[13px] font-bold text-brand-700',
  },
})
