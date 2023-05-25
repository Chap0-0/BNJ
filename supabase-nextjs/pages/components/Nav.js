import Link from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useState, useEffect } from "react";
import AvatarChecking from "./AvatarCheck";

const Nav = () => {
  const fileRand = `${Math.random()}`;
  const user = useUser();
  const supabase = useSupabaseClient();
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    async function getUsername() {
      const { data, error } = await supabase
        .from("profiles")
        .select("username,admin")
        .eq("id", user.id)
        .single();
      if (error) console.log("Error fetching username: ", error);
      else {
        setUsername(data.username);
        setAdmin(data.admin);
      }
    }
    if (user) getUsername();
  }, [user, supabase]);

  let avatarPNG = null;
  if (user) {
    avatarPNG = `https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/${user.id}.png?${fileRand}`;
  }
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {user ? (
        <div className="mt-24 z-0">
          <div
            className={`p-2 ml-40 text-center h-[650px] w-[300px] rounded-lg shadow bg-[#5797FF] fixed ${
              isOpen ? "right-10" : "-top-[1000px]"
            }`}
          >
            <AvatarChecking />

            <div className="mb-4 mt-4 font-bold text-[20px] text-white ">
              {!username ? user.email : username}
            </div>
            <div className="grid gap-y-2 font-bold text-white">
              <p className="border-b mt-[4px]">
                <Link href="/account">Профиль</Link>
              </p>
              <p className="border-b mt-[4px]">
                <Link href="/myposts">Мои посты</Link>
              </p>
              <p className="border-b mt-[4px]">
                <Link href="/createpost">Создать пост</Link>
              </p>
              <button
                onClick={() => supabase.auth.signOut()}
                className="mt-[220px] border w-40 m-auto text-white border-white hover:text-blue-600 hover:bg-white"
              >
                Выход
              </button>
              {!admin ? (
                false
              ) : (
                <Link href="../admin/adminPage">Страница администратора</Link>
              )}
            </div>
          </div>
          <button
            onClick={togglePanel}
            className={`fixed right-0 top-[12px] w-14 h-14 rounded mr-[162px] ${
              isOpen ? "border-white border-2 bg-blue-500" : ""
            } flex items-center justify-center text-white z-50`}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <div>
          <div>
            <div className="p-2 right-10 text-center h-[200px] w-[300px] rounded-lg shadow bg-[#5797FF] fixed">
              <div className="grid gap-y-2 font-bold text-white">
                <p className="text-lg mt-[4px]">
                  Авторизируйтесь, чтобы оставлять комментарии и создавать посты
                </p>
                <Link
                  href="../auth"
                  className="mt-2 border w-40 m-auto text-white border-white hover:border-transparent hover:text-blue-600 hover:bg-white"
                >
                  Вход
                </Link>
                <Link
                  href="../register"
                  className="border w-40 m-auto text-white border-white hover:border-transparent hover:text-blue-600 hover:bg-white"
                >
                  Регистрация
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
