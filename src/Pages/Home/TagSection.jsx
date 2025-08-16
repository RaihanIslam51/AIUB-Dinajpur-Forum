import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useAxiosSesure from '../../Hooks/AxiosSeure/useAxiosSecure';

const TagSection = () => {
  const [tags, setTags] = useState([]);
  const axiosSecure = useAxiosSesure();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosSecure.get('/tagss');
        const posts = res.data;

        // Count tag occurrences
        const tagCounts = {};
        posts.forEach(post => {
          tagCounts[post.tag] = (tagCounts[post.tag] || 0) + 1;
        });

        // Convert to array and sort by count (descending)
        const sortedTags = Object.entries(tagCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setTags(sortedTags);
      } catch (error) {
        console.error('Failed to fetch tags', error);
      }
    };
    fetchTags();
  }, [axiosSecure]);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Browse by Tags</h2>
        <p className="text-gray-600">Discover content through our community's most used tags</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag, index) => (
          <motion.div
            key={tag.name}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="relative group"
          >
            <button
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 transition-colors duration-200 flex items-center"
            >
              <span className="font-medium">#{tag.name}</span>
              <span className="ml-2 text-xs bg-gray-200 group-hover:bg-indigo-200 text-gray-600 group-hover:text-indigo-600 rounded-full px-2 py-0.5 transition-colors duration-200">
                {tag.count}
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="text-center mt-8 text-sm text-gray-500">
          Showing {tags.length} tags sorted by popularity
        </div>
      )}
    </section>
  );
};

export default TagSection;