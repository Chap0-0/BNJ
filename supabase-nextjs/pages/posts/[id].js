import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { React, useEffect, useState } from "react";
import { supabase } from "../api/api";
import Header from "../components/Header";
import Comment from "../components/Comment";
import Nav from "../components/Nav";

const PostRew = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [postItem, setPostItem] = useState(null);

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
      }
    };

    loadPostItem();
  }, [router.query.id]);

  return (
    <div>
      {postItem ? (
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

              <h1
                className="text-3xl font-bold"
                style={{ wordWrap: "break-word" }}
              >
                {postItem.title}
              </h1>
              <p className="text-1xl text-gray-600">{postItem.created_at}</p>
              <p className="text-base mt-4 break-words">
                {postItem.description}
              </p>
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
