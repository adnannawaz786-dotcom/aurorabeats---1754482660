import { motion } from 'framer-motion'
import { Play, Music, MoreHorizontal, Trash2, Edit } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { usePlaylist } from '../hooks/usePlaylist'

export default function PlaylistGrid({ playlists, onPlayPlaylist }) {
  const { deletePlaylist } = usePlaylist()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist, index) => (
        <motion.div
          key={playlist.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="group glass-card rounded-xl p-6 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-200"
        >
          {/* Playlist Cover */}
          <div className="relative mb-4">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Music className="h-12 w-12 text-white/80" />
            </div>
            
            {/* Play Button Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <Button
                onClick={() => onPlayPlaylist(playlist)}
                className="glass-button h-12 w-12 rounded-full"
                disabled={playlist.tracks.length === 0}
              >
                <Play className="h-6 w-6 ml-0.5" />
              </Button>
            </motion.div>
          </div>

          {/* Playlist Info */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
              </p>
              {playlist.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {playlist.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass-button h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 shadow-lg rounded-xl"
              >
                <DropdownMenuItem className="hover:bg-white/20 dark:hover:bg-black/30">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Playlist
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deletePlaylist(playlist.id)}
                  className="hover:bg-red-500/20 text-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      ))}
    </div>
  )
}