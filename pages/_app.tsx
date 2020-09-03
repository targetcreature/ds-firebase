import { useRouter } from "next/router"
import { FirebaseProvider } from "../context/firebase"
import "../styles/_.scss"

export default function App({ Component, pageProps }) {

  const { asPath } = useRouter()

  const path: string = asPath === "/"
    ? "/"
    : asPath.includes("[")
      ? null
      : asPath.replace("/", "")

  return path ? (
    <FirebaseProvider path={path}>
      <Component {...pageProps} roomId={asPath as string} />
    </FirebaseProvider>
  ) : null
}
