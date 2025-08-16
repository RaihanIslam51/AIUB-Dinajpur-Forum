import Allposts from "./Allposts";
import Announcement from "./Announcement";
import Banner from "./Banner";
import TagSection from "./TagSection";

const HomePage = () => {
  return (
    <div className='pt-2'>
      <Banner></Banner>
      <TagSection></TagSection>
      <Announcement></Announcement>
      <Allposts></Allposts>
    </div>
  );
};

export default HomePage;