import Navigator from './components/Navigator'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="center">
      <Navigator />
      {children}
    </div>
  )
}
