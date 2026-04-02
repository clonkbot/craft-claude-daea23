import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Training categories for Minecraft content
const CATEGORIES = [
  { id: 'blocks', name: 'Blocks', icon: '🟫', color: '#8B5A2B' },
  { id: 'mobs', name: 'Mobs', icon: '🧟', color: '#50C878' },
  { id: 'items', name: 'Items', icon: '⚔️', color: '#FFD700' },
  { id: 'structures', name: 'Structures', icon: '🏰', color: '#9370DB' },
  { id: 'commands', name: 'Commands', icon: '⌨️', color: '#FF6B6B' },
  { id: 'redstone', name: 'Redstone', icon: '🔴', color: '#DC143C' },
];

// Sample training prompts
const SAMPLE_PROMPTS = [
  "Create a new ore block that spawns in the Nether and drops crystals",
  "Design a friendly mob that helps players find treasure",
  "Generate a medieval village structure with custom buildings",
  "Write a command that creates a custom boss battle",
  "Build a redstone contraption for automatic farming",
];

interface TrainingEntry {
  id: string;
  category: string;
  prompt: string;
  example: string;
  timestamp: Date;
}

function PixelBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-[#1a1a2e] border-4 border-[#2d2d44]"
           style={{
             boxShadow: 'inset -4px -4px 0 #0f0f1a, inset 4px 4px 0 #3d3d5c',
             imageRendering: 'pixelated'
           }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function BlockButton({
  children,
  onClick,
  color = '#50C878',
  active = false,
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-4 py-3 font-bold text-white transition-all ${className}`}
      style={{
        background: active ? color : '#2d2d44',
        boxShadow: active
          ? `inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.2), 0 0 20px ${color}50`
          : 'inset -3px -3px 0 #1a1a2e, inset 3px 3px 0 #3d3d5c',
        imageRendering: 'pixelated',
        border: '3px solid #0f0f1a',
      }}
    >
      {children}
    </motion.button>
  );
}

function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #50C878 1px, transparent 1px),
            linear-gradient(to bottom, #50C878 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Floating blocks */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 md:w-6 md:h-6"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#50C878', '#00CED1', '#DC143C', '#FFD700', '#9370DB'][i % 5],
            boxShadow: `0 0 10px ${['#50C878', '#00CED1', '#DC143C', '#FFD700', '#9370DB'][i % 5]}50`,
            imageRendering: 'pixelated',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function TrainingCard({ entry, onDelete }: { entry: TrainingEntry; onDelete: (id: string) => void }) {
  const category = CATEGORIES.find(c => c.id === entry.category);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      layout
    >
      <PixelBorder className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl md:text-2xl">{category?.icon}</span>
            <span
              className="text-xs font-bold uppercase tracking-wider px-2 py-1"
              style={{
                background: category?.color,
                boxShadow: `0 0 10px ${category?.color}50`
              }}
            >
              {category?.name}
            </span>
          </div>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-red-400 hover:text-red-300 text-xl leading-none p-1"
          >
            ×
          </button>
        </div>
        <p className="text-[#a0a0c0] text-sm mb-2 font-mono break-words">{entry.prompt}</p>
        <div className="bg-[#0f0f1a] p-2 md:p-3 border-2 border-[#2d2d44]">
          <p className="text-[#50C878] text-xs md:text-sm font-mono whitespace-pre-wrap break-words">{entry.example}</p>
        </div>
      </PixelBorder>
    </motion.div>
  );
}

function StatsDisplay({ entries }: { entries: TrainingEntry[] }) {
  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: entries.filter(e => e.category === cat.id).length
  }));

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {categoryStats.map(stat => (
        <motion.div
          key={stat.id}
          className="text-center p-2 md:p-3"
          style={{
            background: '#1a1a2e',
            border: '3px solid #2d2d44',
            boxShadow: stat.count > 0 ? `0 0 15px ${stat.color}30` : 'none',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-xl md:text-2xl mb-1">{stat.icon}</div>
          <div
            className="text-lg md:text-2xl font-bold"
            style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}` }}
          >
            {stat.count}
          </div>
          <div className="text-[10px] md:text-xs text-[#6060a0] uppercase tracking-wider">{stat.name}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('blocks');
  const [prompt, setPrompt] = useState('');
  const [example, setExample] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim() || !example.trim()) return;

    const newEntry: TrainingEntry = {
      id: Date.now().toString(),
      category: selectedCategory,
      prompt: prompt.trim(),
      example: example.trim(),
      timestamp: new Date(),
    };

    setEntries(prev => [newEntry, ...prev]);
    setPrompt('');
    setExample('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const loadSamplePrompt = () => {
    const randomPrompt = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(randomPrompt);
  };

  useEffect(() => {
    // Keyboard shortcut for submit
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden">
      <GridBackground />

      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 py-3 bg-[#50C878] text-black font-bold text-sm md:text-base"
            style={{
              boxShadow: '0 0 30px #50C878, inset -3px -3px 0 rgba(0,0,0,0.2), inset 3px 3px 0 rgba(255,255,255,0.3)',
            }}
          >
            ⛏️ TRAINING DATA MINED!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <motion.header
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-block mb-4">
            <motion.div
              className="text-5xl md:text-7xl font-bold tracking-tight"
              style={{
                textShadow: '4px 4px 0 #1a1a2e, 8px 8px 0 #0f0f1a',
                WebkitTextStroke: '2px #50C878',
                color: 'transparent',
              }}
              animate={{
                textShadow: [
                  '4px 4px 0 #1a1a2e, 8px 8px 0 #0f0f1a',
                  '4px 4px 0 #50C878, 8px 8px 20px #50C87850',
                  '4px 4px 0 #1a1a2e, 8px 8px 0 #0f0f1a',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              CRAFT
            </motion.div>
            <div
              className="text-5xl md:text-7xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(180deg, #50C878 0%, #00CED1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px #50C87830',
              }}
            >
              CLAUDE
            </div>
          </div>
          <p className="text-[#6060a0] text-sm md:text-lg font-mono max-w-xl mx-auto px-4">
            Train Claude to create Minecraft blocks, mobs, items, and more.
            <br className="hidden md:block" />
            <span className="text-[#50C878]">Feed examples. Watch it learn.</span>
          </p>
        </motion.header>

        {/* Stats */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsDisplay entries={entries} />
        </motion.div>

        {/* Training Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PixelBorder className="mb-8 md:mb-12 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-[#50C878] mb-4 md:mb-6 flex items-center gap-2">
              <span className="text-xl md:text-2xl">⛏️</span> ADD TRAINING DATA
            </h2>

            {/* Category Selection */}
            <div className="mb-4 md:mb-6">
              <label className="text-[#6060a0] text-xs uppercase tracking-wider mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <BlockButton
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    color={cat.color}
                    active={selectedCategory === cat.id}
                    className="text-xs md:text-sm"
                  >
                    <span className="mr-1 md:mr-2">{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.name}</span>
                  </BlockButton>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <label className="text-[#6060a0] text-xs uppercase tracking-wider">Prompt / Description</label>
                <button
                  onClick={loadSamplePrompt}
                  className="text-[#50C878] text-xs hover:text-[#70E898] transition-colors"
                >
                  🎲 Random prompt
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should Claude create? e.g., 'Create a new crystal ore that glows in the dark'"
                className="w-full bg-[#0f0f1a] border-3 border-[#2d2d44] p-3 md:p-4 text-sm md:text-base text-white placeholder-[#4040604] font-mono focus:outline-none focus:border-[#50C878] transition-colors resize-none"
                style={{ boxShadow: 'inset 3px 3px 0 #0a0a10' }}
                rows={2}
              />
            </div>

            {/* Example Input */}
            <div className="mb-4 md:mb-6">
              <label className="text-[#6060a0] text-xs uppercase tracking-wider mb-2 block">
                Example Output (What Claude should generate)
              </label>
              <textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder={`// Example block definition
{
  "type": "minecraft:block",
  "name": "crystal_ore",
  "properties": {
    "light_level": 12,
    "hardness": 3.0
  }
}`}
                className="w-full bg-[#0f0f1a] border-3 border-[#2d2d44] p-3 md:p-4 text-sm md:text-base text-[#50C878] placeholder-[#404060] font-mono focus:outline-none focus:border-[#50C878] transition-colors resize-none"
                style={{ boxShadow: 'inset 3px 3px 0 #0a0a10' }}
                rows={6}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <BlockButton
                onClick={handleSubmit}
                color="#50C878"
                active={true}
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              >
                ⛏️ MINE THIS DATA
              </BlockButton>
              <span className="text-[#404060] text-xs text-center sm:text-right">
                Ctrl + Enter to submit
              </span>
            </div>
          </PixelBorder>
        </motion.div>

        {/* Training Entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg md:text-xl font-bold text-[#00CED1] mb-4 md:mb-6 flex items-center gap-2">
            <span className="text-xl md:text-2xl">📦</span> TRAINING INVENTORY
            <span className="text-[#404060] text-sm font-normal">({entries.length} items)</span>
          </h2>

          {entries.length === 0 ? (
            <PixelBorder className="p-6 md:p-12 text-center">
              <div className="text-4xl md:text-6xl mb-4">📭</div>
              <p className="text-[#6060a0] font-mono text-sm md:text-base">No training data yet.</p>
              <p className="text-[#404060] font-mono text-xs md:text-sm mt-2">Add prompts and examples to train Claude on Minecraft creation!</p>
            </PixelBorder>
          ) : (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {entries.map(entry => (
                  <TrainingCard key={entry.id} entry={entry} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <PixelBorder className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-[#FFD700] mb-3 md:mb-4 flex items-center gap-2">
              <span>💡</span> CRAFTING TIPS
            </h3>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 text-xs md:text-sm">
              <div className="flex items-start gap-2">
                <span className="text-[#50C878]">▸</span>
                <p className="text-[#a0a0c0]">Be specific with prompts - include details about behavior, appearance, and mechanics</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00CED1]">▸</span>
                <p className="text-[#a0a0c0]">Use consistent formatting in examples - JSON, commands, or code structures</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#DC143C]">▸</span>
                <p className="text-[#a0a0c0]">Include edge cases and variations to help Claude understand the full scope</p>
              </div>
            </div>
          </PixelBorder>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-[#1a1a2e] text-center">
          <p className="text-[#404060] text-xs font-mono">
            Requested by @LBallz77283 · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}
