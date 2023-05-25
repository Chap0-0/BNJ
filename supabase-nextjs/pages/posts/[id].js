import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../api/api";
import Header from "../components/Header";
import Comment from "../components/Comment";
import Nav from "../components/Nav";
import React from "react";

const PostRew = () => {
  const router = useRouter();
  const [postItem, setPostItem] = useState(null);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    const loadPostItem = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", router.query.id)
        .single();
      if (error) {
        console.error(error);
      } else {
        setPostItem(data);
        const { data: creatorData, error: creatorError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", data.user_id)
          .single();
        if (creatorError) {
          console.error(creatorError);
        } else {
          setCreator(creatorData);
        }
      }
    };

    const interval = setInterval(() => {
      loadPostItem();
    }, 2000);
    loadPostItem();
    return () => clearInterval(interval);
  }, [router.query.id]);

  return (
    <div>
      {postItem && creator ? (
        <div>
          <Header />
          <Nav />
          <div className="flex-col justify-center items-center mx-auto mt-24 w-[1000px]">
            <div className="p-6 rounded-lg shadow-md bg-white">
              {postItem.image_url ? (
                <img
                  className="w-full h-[400px] object-contain"
                  src={
                    "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/pictures/" +
                    postItem.image_url
                  }
                  alt=""
                />
              ) : (
                <span></span>
              )}

              <div className="mt-4 flex items-center">
                <img
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                  src={
                    "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/" +
                    creator.avatar_url
                  }
                  alt={creator.username}
                />
                <p className="text-gray-900 leading-none break-words">
                  {creator.username}
                </p>
              </div>
              <h1 className="text-3xl font-bold break-words text-gray-800 mt-2">
                {postItem.title}
              </h1>
              <div className="text-sm">
              <p className="text-1xl text-blue-600">{postItem.tags}</p>

                <p className="text-1xl text-gray-600">{postItem.created_at}</p>
                <p className="text-2xl mt-4 break-words">
                  {postItem.description}
                </p>
              </div>
            </div>
            <Comment postItem={postItem} />
          </div>
        </div>
      ) : (
        <div>
          <Header />
          <div className="flex justify-center items-center h-screen">
            <div className="bg-gray-200 p-6 rounded-lg shadow-md">
              <div>Загрузка</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostRew;
