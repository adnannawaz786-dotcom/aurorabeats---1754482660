import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Music, Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import TrackList from '../components/TrackList'
import UploadModal from '../components/UploadModal'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useAudio } from '../hooks/useAudio'
import { usePlaylist } from '../hooks/usePlaylist'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(true)
  const { tracks } = useAudio()
  const { currentPlaylist } = usePlaylist()

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSkeleton type="library" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-6"
    >
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gradient mb-4">Music Library</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tracks or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-white/30 dark:border-white/20"
            />
          </div>
          <Button
            onClick={() => setShowUpload(true)}
            className="glass-button shrink-0"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Music
          </Button>
        </div>

        {tracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No music yet</h2>
            <p className="text-muted-foreground mb-4">Upload your first track to get started</p>
            <Button
              onClick={() => setShowUpload(true)}
              className="glass-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Music
            </Button>
          </motion.div>
        ) : (
          <TrackList tracks={filteredTracks} searchTerm={searchTerm} />
        )}
      </div>

      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </motion.div>
  )
}