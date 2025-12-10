import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, X, Upload, Instagram } from 'lucide-react';

interface UserContent {
  id: number;
  username: string;
  image: string;
  productName: string;
  likes: number;
  caption: string;
}

const mockUserContent: UserContent[] = [
  { id: 1, username: '@fashionista', image: '/ugc/1.jpg', productName: 'Summer Dress', likes: 234, caption: 'Love this dress! Perfect for summer ðŸŒ¸' },
  { id: 2, username: '@styleking', image: '/ugc/2.jpg', productName: 'Leather Jacket', likes: 189, caption: 'Best purchase ever! Quality is amazing' },
  { id: 3, username: '@trendygirl', image: '/ugc/3.jpg', productName: 'Casual Sneakers', likes: 421, caption: 'So comfortable for daily wear â¤ï¸' },
  { id: 4, username: '@urbanstyle', image: '/ugc/4.jpg', productName: 'Denim Jeans', likes: 156, caption: 'Perfect fit! Highly recommend' },
  { id: 5, username: '@chicstyle', image: '/ugc/5.jpg', productName: 'Sunglasses', likes: 298, caption: 'These are fire! ðŸ”¥' },
  { id: 6, username: '@modernman', image: '/ugc/6.jpg', productName: 'Designer Watch', likes: 512, caption: 'Elegant and timeless piece' },
];

export default function UserContentGallery() {
  const [selectedContent, setSelectedContent] = useState<UserContent | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [showUpload, setShowUpload] = useState(false);

  const toggleLike = (id: number) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            #BluewudStyle
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            See how our customers are styling their favorites
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            <Upload className="w-5 h-5" />
            Share Your Style
          </button>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockUserContent.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedContent(content)}
            >
              {/* Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="font-semibold">{content.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Instagram className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Username Badge */}
              <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-white">
                {content.username}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal - Selected Content */}
        <AnimatePresence>
          {selectedContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedContent(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-pink-400 to-purple-400" />
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedContent.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customer
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedContent(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white mb-4">
                        {selectedContent.caption}
                      </p>
                      <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold mb-6">
                        {selectedContent.productName}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => toggleLike(selectedContent.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          likedItems.has(selectedContent.id)
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedItems.has(selectedContent.id) ? 'fill-current' : ''}`} />
                        <span className="font-semibold">
                          {selectedContent.likes + (likedItems.has(selectedContent.id) ? 1 : 0)}
                        </span>
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all">
                        Shop This Look
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Share Your Style
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tag us on Instagram @mulary or use #BluewudStyle
                  </p>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    Got It!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

