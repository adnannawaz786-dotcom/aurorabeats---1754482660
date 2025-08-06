import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { useAudio } from '../hooks/useAudio'
import { useMediaSession } from '../hooks/useMediaSession'
import { formatTime } from '../lib/utils'

export default function Player() {
  const [expanded, setExpanded] = useState(false)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    shuffle,
    repeat,
    togglePlay,
    previousTrack,
    nextTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat
  } = useAudio()

  // Initialize Media Session API
  useMediaSession({
    currentTrack,
    isPlaying,
    onPlay: togglePlay,
    onPause: togglePlay,
    onPreviousTrack: previousTrack,
    onNextTrack: nextTrack
  })

  useEffect(() => {
    const audio = document.querySelector('audio')
    if (audio) {
      audio.volume = muted ? 0 : volume / 100
    }
  }, [volume, muted])

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Player Container */}
      <motion.div
        layout
        className={`fixed ${expanded ? 'inset-4 z-50' : 'bottom-16 md:bottom-8 left-4 right-4 z-30'} 
          glass-card rounded-xl transition-all duration-300`}
        initial={false}
      >
        {expanded ? (
          /* Expanded Player */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Now Playing</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
                className="glass-button"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            {/* Track Art & Info */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                  className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <div className="w-6 h-6 rounded-full bg-white/40" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2 mb-6">
              <Slider
                value={[progress]}
                onValueChange={(value) => {
                  const newTime = (value[0] / 100) * duration
                  seekTo(newTime)
                }}
                className="w-full"
                step={0.1}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShuffle}
                className={`glass-button ${shuffle ? 'text-primary' : ''}`}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                className="glass-button"
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={togglePlay}
                disabled={isLoading}
                className="glass-button w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className="glass-button"
              >
                <SkipForward className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRepeat}
                className={`glass-button ${repeat !== 'none' ? 'text-primary' : ''}`}
              >
                <Repeat className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMuted(!muted)}
                className="glass-button"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[muted ? 0 : volume]}
                onValueChange={(value) => {
                  setVolume(value[0])
                  setMuted(false)
                }}
                className="flex-1"
                max={100}
                step={1}
              />
            </div>
          </motion.div>
        ) : (
          /* Compact Player */
          <div className="p-4">
            <div className="flex items-center space-x-4">
              {/* Track Info */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(true)}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                      className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                    </motion.div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{currentTrack.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousTrack}
                  className="glass-button h-10 w-10"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="glass-button h-12 w-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  className="glass-button h-10 w-10"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(true)}
                  className="glass-button h-10 w-10"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 -mx-1">
              <div className="h-1 bg-white/20 dark:bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-400 to-purple-600"
                  style={{ width: `${progress}%` }}
                  layout
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}