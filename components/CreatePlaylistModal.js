import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { usePlaylist } from '../hooks/usePlaylist'
import { useToast } from '../hooks/useToast'

export default function CreatePlaylistModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { createPlaylist } = usePlaylist()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await createPlaylist({
        name: name.trim(),
        description: description.trim(),
        tracks: []
      })
      
      toast({
        title: 'Playlist created',
        description: `"${name}" has been added to your playlists.`
      })
      
      setName('')
      setDescription('')
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create playlist.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setDescription('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 shadow-lg rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-gradient">Create New Playlist</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Playlist Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="glass border-white/30 dark:border-white/20"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your playlist..."
              className="glass border-white/30 dark:border-white/20 min-h-[80px]"
              disabled={loading}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
            className="glass-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="glass-button bg-primary/20 hover:bg-primary/30"
          >
            {loading ? 'Creating...' : 'Create Playlist'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}