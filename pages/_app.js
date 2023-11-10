import { ThemeProvider } from 'next-themes'
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from 'recoil'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ThemeProvider attribute='class'>
          <Component {...pageProps} />
        </ThemeProvider>
      </RecoilRoot>
    </SessionProvider>
  )
}