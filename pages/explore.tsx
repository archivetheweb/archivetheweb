import { Footer } from "../components/footer";
import { Header } from "../components/header";

const Explore = () => {
  return (
    <div className="flex flex-col h-screen px-8">
      <Header />
      <div className="container p-16 grow ">Explore</div>
      <Footer />;
    </div>
  );
};

export default Explore;
