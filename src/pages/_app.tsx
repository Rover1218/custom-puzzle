import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import type { Session } from "next-auth"

function MyApp({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps<{ session: Session | null }>) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp