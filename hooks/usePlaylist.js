import { createContext, useContext, useState, useEffect } from 'react'

const PlaylistContext = createContext()

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }
  return context
}

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([])
  const [favorites, setFavorites] = useState([])
  const [currentPlaylist, setCurrentPlaylist] = useState(null)

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPlaylists = localStorage.getItem('aurorabeats_playlists')
      const savedFavorites = localStorage.getItem('aurorabeats_favorites')
      
      if (savedPlaylists) {
        try {
          setPlaylists(JSON.parse(savedPlaylists))
        } catch (error) {
          console.error('Error parsing playlists from localStorage:', error)
        }
      }
      
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error)
        }
      }
    }
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurorabeats_playlists', JSON.stringify(playlists))
    }
  }, [playlists])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurorabeats_favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  const createPlaylist = async (playlistData) => {
    const newPlaylist = {
      id: Date.now() + Math.random(),
      name: playlistData.name,
      description: playlistData.description || '',
      tracks: playlistData.tracks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPlaylists(prev => [...prev, newPlaylist])
    return newPlaylist
  }

  const updatePlaylist = async (playlistId, updates) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, ...updates, updatedAt: new Date().toISOString() }
        : playlist
    ))
  }

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId))
    
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null)
    }
  }

  const addToPlaylist = async (playlistId, track) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if track already exists in playlist
        const trackExists = playlist.tracks.some(t => t.id === track.id)
        if (trackExists) {
          throw new Error('Track already exists in this playlist')
        }
        
        return {
          ...playlist,
          tracks: [...playlist.tracks, track],
          updatedAt: new Date().toISOString()
        }
      }
      return playlist
    }))
  }

  const removeFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? {
            ...playlist,
            tracks: playlist.tracks.filter(track => track.id !== trackId),
            updatedAt: new Date().toISOString()
          }
        : playlist
    ))
  }

  const playPlaylist = (playlist) => {
    setCurrentPlaylist(playlist)
  }

  const addToFavorites = (track) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === track.id)
      if (exists) return prev
      return [...prev, track]
    })
  }

  const removeFromFavorites = (trackId) => {
    setFavorites(prev => prev.filter(track => track.id !== trackId))
  }

  const getFavoritesPlaylist = () => {
    return {
      id: 'favorites',
      name: 'Favorites',
      description: 'Your favorite tracks',
      tracks: favorites,
      createdAt: null,
      updatedAt: null
    }
  }

  const getAllPlaylists = () => {
    return [
      getFavoritesPlaylist(),
      ...playlists
    ]
  }

  const getPlaylist = (id) => {
    if (id === 'favorites') {
      return getFavoritesPlaylist()
    }
    return playlists.find(playlist => playlist.id === id)
  }

  const value = {
    playlists,
    favorites,
    currentPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    playPlaylist,
    addToFavorites,
    removeFromFavorites,
    getFavoritesPlaylist,
    getAllPlaylists,
    getPlaylist
  }

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  )
}