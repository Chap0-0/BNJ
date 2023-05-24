import { useSession } from "@supabase/auth-helpers-react";
import Homepage from "./components/HomePage";
import Homepageafter from "./components/HomePageAfter";
import React from "react";

const Home = () => {
  const session = useSession();

  return (
    <div>{!session ? <Homepage /> : <Homepageafter session={session} />}</div>
  );
};

export default Home;
