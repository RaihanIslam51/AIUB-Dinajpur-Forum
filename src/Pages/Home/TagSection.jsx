import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSesure from '../../Hooks/AxiosSeure/useAxiosSecure';
 // Adjust if needed

const TagSection = () => {
  const [tags, setTags] = useState([]);
  const axiosSecure = useAxiosSesure()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosSecure.get('/tags'); // All posts
        const posts = res.data;

        // Extract unique tags
        const uniqueTags = [...new Set(posts.map(post => post.tag))];
        setTags(uniqueTags);
      } catch (error) {
        console.error('Failed to fetch tags', error);
      }
    };
    fetchTags();
  }, [axiosSecure]);

  const handleTagClick = (tag) => {
    navigate(`/search?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="my-10 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Explore by Tags</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className="px-4 py-2 text-sm rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            #{tag}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TagSection;
