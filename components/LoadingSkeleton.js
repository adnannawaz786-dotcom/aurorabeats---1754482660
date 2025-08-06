import { motion } from 'framer-motion'

const SkeletonBox = ({ className }) => (
  <motion.div
    className={`glass rounded-lg ${className}`}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
)

const TrackSkeleton = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center space-x-4 p-4"
  >
    <SkeletonBox className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-1/2" />
    </div>
    <SkeletonBox className="h-4 w-12" />
    <SkeletonBox className="h-8 w-8 rounded-full" />
  </motion.div>
)

const PlaylistSkeleton = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="glass-card rounded-xl p-6"
  >
    <SkeletonBox className="aspect-square rounded-xl mb-4" />
    <div className="space-y-2">
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="h-3 w-full" />
    </div>
  </motion.div>
)

export default function LoadingSkeleton({ type = 'library' }) {
  if (type === 'library') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <div className="glass-card rounded-xl p-6">
          {/* Header Skeleton */}
          <div className="mb-6">
            <SkeletonBox className="h-8 w-48 mb-4" />
            <div className="flex flex-col sm:flex-row gap-4">
              <SkeletonBox className="h-10 flex-1" />
              <SkeletonBox className="h-10 w-32" />
            </div>
          </div>

          {/* Track List Skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <TrackSkeleton key={i} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === 'playlists') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <div className="glass-card rounded-xl p-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <SkeletonBox className="h-8 w-40" />
            <SkeletonBox className="h-10 w-32" />
          </div>

          {/* Playlist Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaylistSkeleton key={i} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}