export default function manifest() {
  return {
    name: 'Priyanshu Gupta',
    short_name: 'Priyanshu Gupta',
    description: 'They dont know me son.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}