import { React, useEffect, useState } from "react";
import { useUser, useSession } from "@supabase/auth-helpers-react";
import Image from "./components/Image";
import { supabase } from "./api/api";
import Header from "./components/Header";

const Post = () => {
  const session = useSession();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");

  useEffect(() => {
    setLoading(true);
    getPost();
  }, [session]);

  async function getPost() {
    try {
      let { data, error, status } = await supabase
        .from("posts")
        .select(`title, description, image_url`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setImageUrl(data.image_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);

      const postData = {
        user_id: user.id,
        title,
        description,
        image_url,
        created_at: new Date(),
      };

      let { data, error } = await supabase
        .from("posts")
        .insert(postData)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setImageUrl(data.image_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header>
        <Header />
      </header>
      <container>
        <div className="flex-col justify-center items-center mx-auto mt-24 w-[1000px]">
          <form
            className="mx-auto mt-24 flex flex-col space-y-4 p-6 rounded-lg shadow-md bg-white"
            onSubmit={handleSubmit}
          >
            <div align="center">
              <Image
                className="w-full h-[400px] object-contain"
                id="image_url"
                url={image_url}
                onUpload={(url) => {
                  setImageUrl(url);
                }}
                session={session}
              />
            </div>
            <br />
            <label className="font-bold text-gray-700 mt-24">Название:</label>
            <input
              className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="font-bold text-gray-700">Описание:</label>
            <textarea
              className="border border-gray-300 min-h-[100px] rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow"
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <br />

            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? "Обновление ..." : "Создать"}
              </button>
            </div>
          </form>
        </div>
      </container>
    </div>
  );
};

export default Post;
