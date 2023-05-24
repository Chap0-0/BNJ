import Header from "./Header";
import Post from "./Post";
import Footer from "./Footer";
import React from "react";

const Homepageafter = () => {
  return (
    <div>
      <Header />
      <main>
        <section className="grid grid-cols-[1fr-5fr]">
          <div className="mt-20 flex flex-wrap justify-center">
            <Post />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Homepageafter;
