import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Music, Play } from 'lucide-react'
import { Button } from '../components/ui/button'
import PlaylistGrid from '../components/PlaylistGrid'
import CreatePlaylistModal from '../components/CreatePlaylistModal'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { usePlaylist } from '../hooks/usePlaylist'
import { useAudio } from '../hooks/useAudio'

export default function Playlists() {
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const { playlists, playPlaylist } = usePlaylist()
  const { setCurrentTrack, setIsPlaying } = useAudio()

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800)
  }, [])

  const handlePlayPlaylist = (playlist) => {
    if (playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0])
      playPlaylist(playlist)
      setIsPlaying(true)
    }
  }

  if (loading) {
    return <LoadingSkeleton type="playlists" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-6"
    >
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gradient">My Playlists</h1>
          <Button
            onClick={() => setShowCreate(true)}
            className="glass-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        {playlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No playlists yet</h2>
            <p className="text-muted-foreground mb-4">Create your first playlist to organize your music</p>
            <Button
              onClick={() => setShowCreate(true)}
              className="glass-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </motion.div>
        ) : (
          <PlaylistGrid
            playlists={playlists}
            onPlayPlaylist={handlePlayPlaylist}
          />
        )}
      </div>

      <CreatePlaylistModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </motion.div>
  )
}