import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, File, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { useAudio } from '../hooks/useAudio'
import { useToast } from '../hooks/useToast'

export default function UploadModal({ open, onClose }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { addTrack } = useAudio()
  const { toast } = useToast()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = [...e.dataTransfer.files]
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = [...e.target.files]
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    setUploading(true)
    const audioFiles = files.filter(file => file.type.startsWith('audio/'))
    
    if (audioFiles.length === 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please select audio files only.',
        variant: 'destructive'
      })
      setUploading(false)
      return
    }

    try {
      for (const file of audioFiles) {
        await processAudioFile(file)
      }
      
      toast({
        title: 'Upload successful',
        description: `Added ${audioFiles.length} track${audioFiles.length > 1 ? 's' : ''} to your library.`
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const processAudioFile = (file) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      
      audio.onloadedmetadata = () => {
        const track = {
          id: Date.now() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          duration: audio.duration,
          url: url,
          file: file
        }
        
        addTrack(track)
        resolve(track)
      }
      
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error(`Failed to load ${file.name}`))
      }
      
      audio.src = url
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 shadow-lg rounded-xl p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient">Upload Music</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            
            <motion.div
              animate={{ scale: dragActive ? 1.05 : 1 }}
              className="space-y-3"
            >
              <Upload className={`h-12 w-12 mx-auto ${
                dragActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
              
              <div>
                <p className="font-medium">
                  {dragActive ? 'Drop your files here' : 'Drag & drop your music'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Supports MP3, WAV, FLAC, and other audio formats
              </p>
            </motion.div>
          </div>

          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 p-4 glass rounded-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full"
              />
              <span className="text-sm">Processing files...</span>
            </motion.div>
          )}

          <div className="flex items-start space-x-2 p-3 glass rounded-lg">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Note:</p>
              <p>Files are stored locally in your browser. They won't be uploaded to any server.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={uploading}
              className="glass-button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}