import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Link from "next/link";
import React from "react";

const MyPost = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [postItems, setPostItems] = useState([]);

  useEffect(() => {
    const loadPostItems = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id);
        if (error) {
          console.error(error);
        } else {
          setPostItems(data);
        }
      }
    };

    loadPostItems();
  }, [supabase, user]);

  const deletePost = async (postId, imageUrl) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error(error);
    } else {
      setPostItems(postItems.filter((post) => post.id !== postId));
      const { data, error } = await supabase.storage
        .from("pictures")
        .remove([imageUrl]);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-center text-4xl text-blue-950 mt-24 mb-2">
          Ваши посты
        </h1>
        <ul className="grid grid-cols-[1fr_1fr_1fr] ml-12">
          {postItems.map((item) => (
            <div key={item.id}>
              <div className="p-12 m-6 rounded-lg shadow flex-col bg-white w-[500px]">
                <Link href={"/posts/" + item.id}>
                  <div className="flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        className="w-[600px] h-[400px] object-contain"
                        src={
                          "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/pictures/" +
                          item.image_url
                        }
                        alt={item.title}
                      />
                    ) : (
                      <span></span>
                    )}
                  </div>
                  <h2 className="text-3xl mt-2 truncate ...">{item.title}</h2>
                  <p className="text-base truncate ...">{item.description}</p>
                </Link>
                <div className="flex ml-[220px] mt-8">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-1 h-8"
                    onClick={() => deletePost(item.id, item.image_url)}
                  >
                    Удалить
                  </button>
                  <Link href={"/editor/" + item.id}>
                    <button className="bg-blue-500 hover:bg-blue-700 h-8 ml-1 p-1 text-white">
                      Редактировать
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyPost;
