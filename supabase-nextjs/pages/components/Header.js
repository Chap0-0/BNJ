import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import React, { useState, useEffect } from "react";
import AvatarChecking from "./AvatarCheck";
import Link from "next/link";
import Nav from "./Nav";

const Header = () => {
  const fileRand = `${Math.random()}`;
  const user = useUser();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function getUsername() {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (error) console.log("Error fetching username: ", error);
      else setUsername(data.username);
    }
    if (user) getUsername();
  }, [user, supabase]);
  let avatarPNG = null;
  if (user) {
    avatarPNG = `https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/${user.id}.png?${fileRand}`;
  }

  return (
    <div>
      {!session ? (
        <header>
          <div className="fixed flex justify-between w-90% top-0 left-0 right-0 z-50 w-full bg-blue-500 h-20 items-center text-center">
            <div>
              <Link href="/" className="text-white font-bold text-5xl pl-10 ">
                DEVS NB
              </Link>
            </div>
            <nav className="list-none grid gap-4 grid-cols-2 font-raleway font-normal font-400 text-24 leading-37 items-center text-center text-shadow text-white mr-24">
              <Link
                href="/register"
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-600 hover:bg-white mt-4 lg:mt-0"
              >
                Регистрация
              </Link>
              <Link
                href="/auth"
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-600 hover:bg-white mt-4 lg:mt-0"
              >
                Вход
              </Link>
            </nav>
          </div>
        </header>
      ) : (
        <header className="fixed flex justify-between top-0 left-0 right-0 z-50 w-full bg-blue-500 h-20 items-center text-center">
          <Link href="/" className="text-white font-bold text-5xl pl-10 ">
            DEVS NB
          </Link>
          <div></div>
          <nav className="list-none grid-cols-2 font-raleway font-normal font-400 text-24 leading-37 items-center text-center text-shadow text-white pr-10">
            <div className="flex flex-row items-center">
              <Nav />
            </div>
          </nav>
        </header>
      )}
    </div>
  );
};

export default Header;
