import '../styles/globals.css'
import Layout from '../components/Layout'
import { AudioProvider } from '../hooks/useAudio'
import { PlaylistProvider } from '../hooks/usePlaylist'
import { ThemeProvider } from '../hooks/useTheme'
import { Toaster } from '../components/ui/toaster'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AudioProvider>
        <PlaylistProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster />
        </PlaylistProvider>
      </AudioProvider>
    </ThemeProvider>
  )
}