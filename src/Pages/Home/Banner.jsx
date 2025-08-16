import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaSearch, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import useAxiosSecure from '../../Hooks/AxiosSeure/useAxiosSecure';

const Banner = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  // Featured community testimonials
  const communityTestimonials = [
    {
      id: 1,
      quote: "This community helped me land my dream job as a React developer!",
      author: "Sarah Johnson",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      quote: "The support and knowledge sharing here is unparalleled. Truly a strong community.",
      author: "Michael Chen",
      role: "Fullstack Engineer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      quote: "From beginner to confident developer, this community guided me every step of the way.",
      author: "Emma Rodriguez",
      role: "UI/UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  // Fetch posts based on search term
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', submittedTerm],
    enabled: !!submittedTerm,
    queryFn: async () => {
      const res = await axiosSecure.get(`/addposts?tag=${submittedTerm}`);
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSubmittedTerm(searchTerm.trim());
    }
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Testimonials */}
      <div className="relative h-[500px] w-full bg-gradient-to-r from-indigo-900 to-purple-800">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        
        {/* Testimonial slider */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            loop={true}
            className="w-full max-w-5xl"
          >
            {communityTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left p-8"
                >
                  <div className="flex-shrink-0">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                  <div className="text-white max-w-2xl">
                    <motion.h2 
                      className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                    >
                      Join Our Thriving Developer Community
                    </motion.h2>
                    <motion.blockquote 
                      className="text-xl mb-6 italic leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      "{testimonial.quote}"
                    </motion.blockquote>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="font-semibold text-lg">{testimonial.author}</p>
                      <p className="text-indigo-200">{testimonial.role}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <button 
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
          <button 
            onClick={() => swiperRef.current?.swiper.slideNext()}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Search Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-16"
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-100">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Discover & Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Technical Knowledge</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Find solutions, share insights, and connect with developers worldwide
            </motion.p>

            <motion.form 
              onSubmit={handleSearch}
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-5 pr-32 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  placeholder="Search for React, JavaScript, CSS..."
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FaSearch /> Search
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </motion.section>

      {/* Search Results */}
      {submittedTerm && (
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Results for: <span className="text-indigo-600">"{submittedTerm}"</span>
            </h2>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-5">
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={40} className="mt-4 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center bg-gray-100 w-16 h-16 rounded-full mb-4">
                  <FaSearch className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaUser className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{post.authorName}</p>
                        <time className="text-xs text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400" />
                          {formatDate(post.date)}
                        </time>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[post.tag, ...(post.tags || [])].filter(Boolean).map((tag, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate(`/postDetails/${post._id}`)}
                        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition font-medium"
                      >
                        Read Full Post
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Banner;