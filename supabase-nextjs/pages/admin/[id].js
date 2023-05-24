import { useState, useEffect } from "react";
import { supabase } from "../api/api";
import { useRouter } from "next/router";
import Header from "../components/Header";
import React from "react";

export default function Profile() {
  const router = useRouter();
  const [id, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [real_name, setReal_name] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`id,username, real_name, avatar_url, admin`)
          .eq("id", router.query.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUserId(data.id);
          setUsername(data.username);
          setReal_name(data.real_name);
          setAvatarUrl(data.avatar_url);
          setAdmin(data.admin);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [router.query.id]);

  return (
    <div>
      <Header />
      <div className="max-w-xs mx-auto mt-24 rounded-lg shadow flex-col bg-white flex justify-between w-90%  w-full p-4 items-center">
        <div className="mb-4">
          <label
            className=" text-sm font-bold mb-2 flex justify-center"
            htmlFor="Avatar"
          >
            Аватар
          </label>
          <img
            className="w-[140px] h-[140px] rounded-full"
            src={
              "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/" +
              avatar_url
            }
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Имя пользователя
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            value={username || ""}
            disabled
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="real_name"
          >
            Настоящее имя
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="real_name"
            type="real_name"
            value={real_name || ""}
            disabled
          />
          {admin ? (
            <p className="block text-gray-700 text-0.5xl font-bold text-center mt-4">
              Администратор
            </p>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
}
