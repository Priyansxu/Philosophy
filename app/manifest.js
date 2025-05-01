export default function manifest() {
  return {
    name: 'Philosophy Quotes', 
    short_name: 'Philosophy Quotes',
    description: '...',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}