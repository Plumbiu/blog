import Navigator from './components/Navigator'
import styles from './layout.module.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={styles.wrap}>
      <Navigator />
      {children}
    </div>
  )
}
