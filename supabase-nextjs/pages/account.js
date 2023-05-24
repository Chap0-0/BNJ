import Head from "next/head";
import Account from "./components/Account";
import React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import Homepage from "./components/HomePage";
import Header from "./components/Header";
import MyPost from "./myposts";
const AccountManager = () => {
  const session = useSession();
  return (
    <div>
      {!session ? (
        <Homepage />
      ) : (
        <div>
          <Head>
            <title>Profile</title>
          </Head>
          <Header/>
          <container>
          <Account session={session} />
          <div className="mt-20">
          <MyPost />
          </div>
          </container>
        </div>
      )}
    </div>
  );
};

export default AccountManager;
