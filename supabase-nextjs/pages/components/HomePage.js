import Footer from "./Footer";
import Header from "./Header";
import Post from "./Post";
import React from "react";

const Homepage = () => {
  return (
    <div>
      <Header />
      <main>
        <section>
          <div className="mt-20 flex flex-wrap justify-evenly">
            <Post />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
