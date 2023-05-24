import {
  useUser,
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import Avatar from "./Avatar";
import Homepage from "@/pages/components/HomePage";
import React from "react";

export default function Profile() {
  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [real_name, setReal_name] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, real_name, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setReal_name(data.real_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, real_name, avatar_url }) {
    try {
      setLoading(true);

      const updates = {
        username,
        real_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user?.id);

      if (error) {
        throw error;
      }

      alert("Профиль обновлён!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!session ? (
        <Homepage />
      ) : (
        <div className="max-w-xs mx-auto mt-24 rounded-lg shadow flex-col bg-white flex justify-between w-90%  w-full p-4 items-center">
          <div className="mb-4">
            <label
              className=" text-sm font-bold mb-2 flex justify-center"
              htmlFor="Avatar"
            >
              Аватар
            </label>
            <Avatar
              uid={user?.id}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url);
              }}
              url={avatar_url || ""}
              session={session}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              value={session.user.email}
              disabled
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
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setReal_name(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => updateProfile({ username, real_name, avatar_url })}
              disabled={loading}
            >
              {loading ? "Обновление ..." : "Обновить"}
            </button>
          </div>
          {!username ? (
            <h1 className="text-lg text-red-500 font-bold">
              Впишите свой никнейм!
            </h1>
          ) : (
            <span></span>
          )}
        </div>
      )}
    </div>
  );
}
