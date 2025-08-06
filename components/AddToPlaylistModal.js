import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { usePlaylist } from '../hooks/usePlaylist'
import { useToast } from '../hooks/useToast'

export default function AddToPlaylistModal({ track, open, onClose }) {
  const [loading, setLoading] = useState(false)
  const { playlists, addToPlaylist } = usePlaylist()
  const { toast } = useToast()

  const handleAddToPlaylist = async (playlist) => {
    if (!track) return
    
    setLoading(true)
    try {
      await addToPlaylist(playlist.id, track)
      
      toast({
        title: 'Added to playlist',
        description: `"${track.title}" has been added to "${playlist.name}".`
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add track to playlist.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const isTrackInPlaylist = (playlist) => {
    return playlist.tracks.some(t => t.id === track?.id)
  }

  if (!track) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 shadow-lg rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-gradient">
            Add to Playlist
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add "{track.title}" to a playlist
          </p>
        </DialogHeader>
        
        {playlists.length === 0 ? (
          <div className="text-center py-8">
            <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No playlists found</p>
            <p className="text-sm text-muted-foreground">
              Create a playlist first to add tracks
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const inPlaylist = isTrackInPlaylist(playlist)
                
                return (
                  <Button
                    key={playlist.id}
                    variant="ghost"
                    onClick={() => handleAddToPlaylist(playlist)}
                    disabled={loading || inPlaylist}
                    className="w-full justify-between glass-button h-auto p-4"
                  >
                    <div className="text-left">
                      <p className="font-medium">{playlist.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {playlist.tracks.length} tracks
                      </p>
                    </div>
                    
                    {inPlaylist && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}