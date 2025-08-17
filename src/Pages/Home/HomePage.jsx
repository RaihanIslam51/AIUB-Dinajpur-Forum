import Allposts from "./Allposts";
import Announcement from "./Announcement";
import Banner from "./Banner";
import Faq from "./Faq";
import NewsLetters from "./NewsLetters";
import Reviews from "./reviews";
import TagSection from "./TagSection";

const HomePage = () => {
  return (
    <div className='pt-2'>
      <Banner></Banner>
      <TagSection></TagSection>
      <Announcement></Announcement>
      <Allposts></Allposts>
      <Reviews></Reviews>
      <NewsLetters></NewsLetters>
      <Faq></Faq>
    </div>
  );
};

export default HomePage;