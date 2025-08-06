import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Home, ListMusic, Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import Player from './Player'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

const navigationItems = [
  { href: '/', label: 'Library', icon: Home },
  { href: '/playlists', label: 'Playlists', icon: ListMusic },
]

export default function Layout({ children }) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-24">
        {children}
      </main>

      {/* Persistent Player */}
      <Player />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="glass backdrop-blur-xl bg-white/20 dark:bg-black/30 border-t border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              {navigationItems.map((item) => {
                const isActive = router.pathname === item.href
                const Icon = item.icon
                
                return (
                  <motion.button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200',
                      isActive 
                        ? 'text-primary bg-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-black/20'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={cn(
                      'h-5 w-5',
                      isActive && 'animate-pulse-glow'
                    )} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="glass-button p-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="glass backdrop-blur-sm bg-white/10 dark:bg-black/20 border-t border-white/20 dark:border-white/10">
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">Made using PantheraBuilder</p>
          </div>
        </div>
      </nav>
    </div>
  )
}