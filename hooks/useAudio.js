import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext()

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

export const AudioProvider = ({ children }) => {
  const [tracks, setTracks] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('none') // 'none', 'all', 'one'
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const audioRef = useRef(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      
      const audio = audioRef.current
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
        setIsLoading(false)
      }
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }
      
      const handleEnded = () => {
        handleTrackEnd()
      }
      
      const handleLoadStart = () => {
        setIsLoading(true)
      }
      
      const handleCanPlay = () => {
        setIsLoading(false)
      }
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('loadstart', handleLoadStart)
      audio.addEventListener('canplay', handleCanPlay)
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('loadstart', handleLoadStart)
        audio.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [])

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url
      audioRef.current.load()
      
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const addTrack = (track) => {
    setTracks(prev => [...prev, track])
    
    // If this is the first track, set it as current
    if (!currentTrack) {
      setCurrentTrack(track)
      setQueue([track])
    } else {
      setQueue(prev => [...prev, track])
    }
  }

  const removeTrack = (trackId) => {
    setTracks(prev => prev.filter(t => t.id !== trackId))
    setQueue(prev => prev.filter(t => t.id !== trackId))
    
    if (currentTrack?.id === trackId) {
      const nextTrack = getNextTrack()
      if (nextTrack) {
        setCurrentTrack(nextTrack)
      } else {
        setCurrentTrack(null)
        setIsPlaying(false)
      }
    }
  }

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying)
    }
  }

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const getNextTrack = () => {
    if (queue.length === 0) return null
    
    const currentIdx = queue.findIndex(t => t.id === currentTrack?.id)
    
    if (shuffle) {
      let randomIdx
      do {
        randomIdx = Math.floor(Math.random() * queue.length)
      } while (randomIdx === currentIdx && queue.length > 1)
      return queue[randomIdx]
    }
    
    const nextIdx = (currentIdx + 1) % queue.length
    return queue[nextIdx]
  }

  const getPreviousTrack = () => {
    if (queue.length === 0) return null
    
    const currentIdx = queue.findIndex(t => t.id === currentTrack?.id)
    
    if (shuffle) {
      let randomIdx
      do {
        randomIdx = Math.floor(Math.random() * queue.length)
      } while (randomIdx === currentIdx && queue.length > 1)
      return queue[randomIdx]
    }
    
    const prevIdx = currentIdx === 0 ? queue.length - 1 : currentIdx - 1
    return queue[prevIdx]
  }

  const nextTrack = () => {
    const next = getNextTrack()
    if (next) {
      setCurrentTrack(next)
      setIsPlaying(true)
    }
  }

  const previousTrack = () => {
    // If more than 3 seconds have passed, restart current track
    if (currentTime > 3) {
      seekTo(0)
      return
    }
    
    const previous = getPreviousTrack()
    if (previous) {
      setCurrentTrack(previous)
      setIsPlaying(true)
    }
  }

  const handleTrackEnd = () => {
    if (repeat === 'one') {
      seekTo(0)
      setIsPlaying(true)
    } else if (repeat === 'all' || getNextTrack()) {
      nextTrack()
    } else {
      setIsPlaying(false)
    }
  }

  const toggleShuffle = () => {
    setShuffle(!shuffle)
  }

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one']
    const currentIdx = modes.indexOf(repeat)
    const nextIdx = (currentIdx + 1) % modes.length
    setRepeat(modes[nextIdx])
  }

  const setQueue = (newQueue) => {
    setQueue(newQueue)
  }

  const value = {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    shuffle,
    repeat,
    queue,
    addTrack,
    removeTrack,
    setCurrentTrack,
    togglePlay,
    seekTo,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    setIsPlaying,
    setQueue
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}