import { useEffect } from 'react'

export const useMediaSession = ({ currentTrack, isPlaying, onPlay, onPause, onPreviousTrack, onNextTrack }) => {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      // Set metadata
      if (currentTrack) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: 'AuroraBeats',
          artwork: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-512x512.png', 
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        })
      }

      // Set playback state
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'

      // Set action handlers
      navigator.mediaSession.setActionHandler('play', onPlay)
      navigator.mediaSession.setActionHandler('pause', onPause)
      navigator.mediaSession.setActionHandler('previoustrack', onPreviousTrack)
      navigator.mediaSession.setActionHandler('nexttrack', onNextTrack)

      // Optional: Handle seek actions
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        // Implement seeking backward
        console.log('Seek backward', details)
      })

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        // Implement seeking forward  
        console.log('Seek forward', details)
      })

      return () => {
        // Cleanup
        try {
          navigator.mediaSession.setActionHandler('play', null)
          navigator.mediaSession.setActionHandler('pause', null)
          navigator.mediaSession.setActionHandler('previoustrack', null)
          navigator.mediaSession.setActionHandler('nexttrack', null)
          navigator.mediaSession.setActionHandler('seekbackward', null)
          navigator.mediaSession.setActionHandler('seekforward', null)
        } catch (error) {
          console.log('Media session cleanup error:', error)
        }
      }
    }
  }, [currentTrack, isPlaying, onPlay, onPause, onPreviousTrack, onNextTrack])
}