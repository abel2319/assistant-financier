export const metadata = {
  title: 'Seriene & Prospere IA',
  icons: {
    icon: "/logo.png",
  },
  description: 'Assistant financier personnel utilisant l\'IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
