import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Homepageafter from "./components/HomePageAfter";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert("Регистрация прошла успешно!");
      router.push("/account"); // перенаправление на страницу account
    } catch (error) {
      alert(error.error_description || error.message);
    }
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
              onSubmit={handleRegister}
            >
              <div className="mb-4">
                <h1 className="text-center font-bold text-gray-700 text-[20px]">
                  Регистрация
                </h1>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@mail.ru"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Пароль:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="******"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6 text-center"
                  type="submit"
                >
                  Зарегистрироваться
                </button>
              </div>
              <Link href="./auth">
                <p className="text-center font-bold text-gray-700 text-[14px] mt-2">
                  Авторизация
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
}
