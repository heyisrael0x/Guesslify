import { Navbar, Content, More, Footer } from "../src/components";

const Home = () => {
  return (
    <div className="min-h-screen gradient01">
      <div className="">
        <Navbar />
        <Content />
        <More />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
