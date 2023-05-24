import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Homepageafter from "./HomePageAfter";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
const Authentification = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert(error.message);
    }
    router.push("/");
  };

  return (
    <div>
      {!session ? (
        <div>
          <header>
            <div className=" flex justify-between w-90%  w-full bg-blue-500 h-20 items-center">
              <Link href="/" className="text-white font-bold text-5xl pl-10">
                DEVS NB
              </Link>
            </div>
          </header>
          <div className="w-full max-w-xs mx-auto mt-72">
            <form
              className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              <h1 className="text-center font-bold text-gray-700 text-[20px]">
                Авторизация
              </h1>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.ru"
                />
              </div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Пароль:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
              />
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 w-40 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
                  type="submit"
                >
                  Войти
                </button>
              </div>
              <Link href="../register">
                <p className="text-center font-bold text-gray-700 text-[14px] mt-2">
                  Нет аккаунта? Зарегистрироваться.
                </p>
              </Link>
            </form>
          </div>
        </div>
      ) : (
        <Homepageafter />
      )}
    </div>
  );
};

export default Authentification;
