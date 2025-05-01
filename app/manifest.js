export default function manifest() {
  return {
    name: 'Philosophy Quotes', 
    short_name: 'Philosophy Quotes',
    description: 'Explore philosophical quotes from the greatest thinkers throughout history.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
