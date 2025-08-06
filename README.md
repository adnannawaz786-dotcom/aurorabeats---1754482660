# AuroraBeats 🎵

A beautiful, modern MP3 player built with Next.js and featuring glassmorphic design elements.

## Features

✨ **Core Features:**
- Upload and play MP3, WAV, FLAC, and other audio formats
- Beautiful glassmorphic UI with dark/light mode
- Persistent sticky player
- Media Session API support for system controls
- Mobile-first responsive design

🎛️ **Player Controls:**
- Play/pause, skip, previous track
- Shuffle and repeat modes
- Volume control with mute
- Progress bar with seeking
- Expandable full-screen player

📚 **Library Management:**
- Music library with search functionality
- Playlist creation and management
- Favorites system
- Drag & drop file uploads

🎨 **Design:**
- Glassmorphism effects with backdrop blur
- Gradient backgrounds and animations
- Smooth transitions with Framer Motion
- Bottom navigation for mobile
- Loading skeletons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aurorabeats
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. **Upload Music**: Click the "Upload Music" button to add audio files
2. **Create Playlists**: Navigate to Playlists and create custom playlists
3. **Player Controls**: Use the bottom player for basic controls, tap to expand for full controls
4. **Search**: Find tracks quickly using the search bar
5. **Favorites**: Heart tracks to add them to your favorites

## Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with glassmorphism effects
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Audio**: HTML5 Audio API with Media Session
- **Storage**: Browser localStorage

## File Structure

```
aurorabeats/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Layout.js        # Main layout with navigation
│   ├── Player.js        # Audio player component
│   ├── TrackList.js     # Track listing component
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAudio.js      # Audio state management
│   ├── usePlaylist.js   # Playlist management
│   └── ...
├── pages/               # Next.js pages
│   ├── index.js         # Home/Library page
│   └── playlists.js     # Playlists page
├── styles/
│   └── globals.css      # Global styles and Tailwind
└── lib/
    └── utils.js         # Utility functions
```

## Features in Detail

### Audio Player
- Supports multiple audio formats
- Gapless playback between tracks
- Media Session API for system-level controls
- Visual audio progress indicators

### Playlist Management
- Create, edit, and delete playlists
- Add/remove tracks from playlists
- Favorites as a special playlist
- Persistent storage across sessions

### Responsive Design
- Mobile-first approach
- Bottom navigation for easy thumb access
- Expandable player interface
- Touch-friendly controls

### Data Storage
- All data stored locally in browser
- No server uploads or external dependencies
- Persistent across browser sessions

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with modern API support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built using PantheraBuilder
- Icons by Lucide React
- UI components by Radix UI
- Animations by Framer Motion

---

**Made using PantheraBuilder** 🚀