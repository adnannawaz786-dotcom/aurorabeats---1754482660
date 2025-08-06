import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Music, MoreHorizontal, Heart, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import AddToPlaylistModal from './AddToPlaylistModal'
import { useAudio } from '../hooks/useAudio'
import { usePlaylist } from '../hooks/usePlaylist'
import { formatTime } from '../lib/utils'
import { cn } from '../lib/utils'

export default function TrackList({ tracks, searchTerm }) {
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false)
  const { currentTrack, isPlaying, setCurrentTrack, togglePlay } = useAudio()
  const { addToFavorites, removeFromFavorites, favorites } = usePlaylist()

  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay()
    } else {
      setCurrentTrack(track)
    }
  }

  const handleAddToPlaylist = (track) => {
    setSelectedTrack(track)
    setShowAddToPlaylist(true)
  }

  const toggleFavorite = (track) => {
    const isFavorite = favorites.some(fav => fav.id === track.id)
    if (isFavorite) {
      removeFromFavorites(track.id)
    } else {
      addToFavorites(track)
    }
  }

  const highlightText = (text, search) => {
    if (!search) return text
    const regex = new RegExp(`(${search})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) => 
      part.toLowerCase() === search.toLowerCase() ? 
        <span key={index} className="bg-primary/30 text-primary font-medium">{part}</span> : part
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No tracks found</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id
          const isFavorite = favorites.some(fav => fav.id === track.id)
          
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'group flex items-center space-x-4 p-4 rounded-lg transition-all duration-200',
                'hover:bg-white/10 dark:hover:bg-black/20',
                isCurrentTrack && 'bg-primary/20 ring-1 ring-primary/50'
              )}
            >
              {/* Play Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePlay(track)}
                className="glass-button h-10 w-10 rounded-full shrink-0"
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  'font-medium truncate',
                  isCurrentTrack && 'text-primary'
                )}>
                  {highlightText(track.title, searchTerm)}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {highlightText(track.artist, searchTerm)}
                </p>
              </div>

              {/* Duration */}
              <div className="text-sm text-muted-foreground shrink-0">
                {formatTime(track.duration || 0)}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(track)}
                  className={cn(
                    'glass-button h-8 w-8',
                    isFavorite && 'text-red-500'
                  )}
                >
                  <Heart className={cn(
                    'h-4 w-4',
                    isFavorite && 'fill-current'
                  )} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="glass-button h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 shadow-lg rounded-xl"
                  >
                    <DropdownMenuItem 
                      onClick={() => handleAddToPlaylist(track)}
                      className="hover:bg-white/20 dark:hover:bg-black/30"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => toggleFavorite(track)}
                      className="hover:bg-white/20 dark:hover:bg-black/30"
                    >
                      <Heart className={cn(
                        'h-4 w-4 mr-2',
                        isFavorite && 'fill-current text-red-500'
                      )} />
                      {isFavorite ? 'Remove from' : 'Add to'} Favorites
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AddToPlaylistModal
        track={selectedTrack}
        open={showAddToPlaylist}
        onClose={() => {
          setShowAddToPlaylist(false)
          setSelectedTrack(null)
        }}
      />
    </>
  )
}