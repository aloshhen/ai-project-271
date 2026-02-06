import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// SafeIcon Component - converts kebab-case to PascalCase
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const [Icon, setIcon] = useState(null)

  useEffect(() => {
    import('lucide-react').then((icons) => {
      const pascalCase = name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
      const IconComponent = icons[pascalCase] || icons.HelpCircle
      setIcon(() => IconComponent)
    })
  }, [name])

  if (!Icon) return <div style={{ width: size, height: size }} className={className} />

  return <Icon size={size} className={className} color={color} />
}

// Gallery data with user provided media
const galleryItems = [
  {
    id: 1,
    type: 'photo',
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    thumbnail: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Момент 1',
    category: 'portfolio',
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: 2,
    type: 'video',
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-video-2.MOV?',
    thumbnail: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Видео момент',
    category: 'video',
    aspectRatio: 'aspect-video'
  },
  {
    id: 3,
    type: 'photo',
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-3.jpg?',
    thumbnail: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-3.jpg?',
    title: 'Момент 2',
    category: 'portfolio',
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: 4,
    type: 'photo',
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-4.jpg?',
    thumbnail: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-4.jpg?',
    title: 'Момент 3',
    category: 'nature',
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: 5,
    type: 'gif',
    url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-animation-1770406522-5232.mp4?',
    thumbnail: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-animation-1770406522-5232.mp4?',
    title: 'Анимация',
    category: 'portfolio',
    aspectRatio: 'aspect-video'
  }
]

const categories = [
  { id: 'all', label: 'Все', icon: 'grid-3x3' },
  { id: 'portfolio', label: 'Портфолио', icon: 'image' },
  { id: 'video', label: 'Видео', icon: 'video' },
  { id: 'nature', label: 'Природа', icon: 'mountain' }
]

// Lightbox Component
const Lightbox = ({ item, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 lightbox-backdrop flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
      >
        <SafeIcon name="x" size={24} className="text-white" />
      </button>

      {/* Navigation buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation hidden md:flex"
      >
        <SafeIcon name="chevron-left" size={32} className="text-white" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation hidden md:flex"
      >
        <SafeIcon name="chevron-right" size={32} className="text-white" />
      </button>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-w-6xl max-h-[90vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
          />
        ) : item.type === 'gif' ? (
          <img
            src={item.url}
            alt={item.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <img
            src={item.url}
            alt={item.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        )}
      </motion.div>

      {/* Title */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <h3 className="text-white text-xl font-semibold">{item.title}</h3>
        <p className="text-gray-400 text-sm mt-1">
          {item.type === 'video' ? 'Видео' : item.type === 'gif' ? 'GIF Анимация' : 'Фотография'}
        </p>
      </div>

      {/* Mobile swipe hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-2 text-gray-500 text-sm">
        <SafeIcon name="move-left" size={16} />
        <span>Свайпайте</span>
        <SafeIcon name="move-right" size={16} />
      </div>
    </motion.div>
  )
}

// Gallery Item Component
const GalleryItem = ({ item, onClick, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="gallery-item group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-800"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className={`relative ${item.aspectRatio} overflow-hidden`}>
        {item.type === 'video' ? (
          <>
            <video
              src={item.thumbnail}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <SafeIcon name="play" size={28} className="text-white ml-1" />
              </div>
            </div>
          </>
        ) : item.type === 'gif' ? (
          <>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <SafeIcon name="sparkles" size={20} className="text-white" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg">{item.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <SafeIcon
                name={item.type === 'video' ? 'video' : item.type === 'gif' ? 'sparkles' : 'image'}
                size={14}
                className="text-gray-300"
              />
              <span className="text-gray-300 text-sm capitalize">{item.category}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Filter items
  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory || (activeCategory === 'video' && item.type === 'video'))

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!selectedItem) return
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id)
    const nextIndex = (currentIndex + 1) % filteredItems.length
    setSelectedItem(filteredItems[nextIndex])
  }, [selectedItem, filteredItems])

  const handlePrev = useCallback(() => {
    if (!selectedItem) return
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id)
    const prevIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1
    setSelectedItem(filteredItems[prevIndex])
  }, [selectedItem, filteredItems])

  // Scroll handler for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) handleNext()
    if (isRightSwipe) handlePrev()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 mobile-safe-container">
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <SafeIcon name="aperture" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Галерея</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Галерея</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">О нас</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Контакты</a>
          </div>

          <button className="md:hidden p-2 text-gray-400 hover:text-white">
            <SafeIcon name="menu" size={24} />
          </button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 md:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
              <SafeIcon name="sparkles" size={16} className="text-yellow-400" />
              <span className="text-sm text-gray-300">Коллекция лучших моментов</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Визуальная <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">галерея</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Погрузитесь в мир визуальных историй. Фотографии, видео и анимации, которые рассказывают больше, чем слова.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#gallery"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 min-h-[56px]"
              >
                <SafeIcon name="images" size={20} />
                Смотреть галерею
              </a>
              <button className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-slate-700 min-h-[56px]">
                <SafeIcon name="share-2" size={20} />
                Поделиться
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{galleryItems.length}+</div>
              <div className="text-sm text-gray-500 mt-1">Работ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">4K</div>
              <div className="text-sm text-gray-500 mt-1">Качество</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-500 mt-1">Уникальность</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Наша <span className="text-blue-500">коллекция</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Исследуйте наши работы. Используйте фильтры для навигации по категориям.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-medium transition-all touch-manipulation min-h-[48px] ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <SafeIcon name={category.icon} size={18} />
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <SafeIcon name="image-off" size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">В этой категории пока нет работ</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 md:py-24 px-4 md:px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
                <SafeIcon name="info" size={16} className="text-blue-400" />
                <span className="text-sm text-blue-400">О проекте</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Создаем визуальные <span className="text-purple-500">истории</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Наша галерея — это пространство, где каждое изображение и видео несет смысл.
                Мы тщательно отбираем работы, чтобы создать уникальную коллекцию,
                которая вдохновляет и вызывает эмоции.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="zap" size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Быстрая загрузка</h4>
                    <p className="text-gray-500 text-sm">Оптимизированные миниатюры</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="smartphone" size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Адаптивный дизайн</h4>
                    <p className="text-gray-500 text-sm">Работает на всех устройствах</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-animation-1770406522-5232.mp4?"
                  alt="GIF Animation"
                  className="w-full h-auto rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <SafeIcon name="check-circle" size={24} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Анимация</div>
                    <div className="text-gray-400 text-sm">Динамичный контент</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Хотите сотрудничать?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Открыты для новых проектов и идей. Свяжитесь с нами для обсуждения деталей.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@gallery.com"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 min-h-[56px]"
              >
                <SafeIcon name="mail" size={20} />
                Написать нам
              </a>
              <button className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-slate-700 min-h-[56px]">
                <SafeIcon name="download" size={20} />
                Скачать портфолио
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-12">
              {['instagram', 'twitter', 'facebook', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-700 touch-manipulation"
                >
                  <SafeIcon name={social} size={20} className="text-gray-400" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-12 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <SafeIcon name="aperture" size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">Галерея</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Условия использования</a>
              <a href="#" className="hover:text-white transition-colors">Контакты</a>
            </div>

            <div className="text-gray-500 text-sm">
              © 2024 Галерея. Все права защищены.
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App