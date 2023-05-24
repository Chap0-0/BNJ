import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentCheck from "./components/CommentCheck";
import React from "react";

const Post = () => {
  const supabase = useSupabaseClient();
  const [postItems, setPostItems] = useState([]);

  useEffect(() => {
    const loadPostItems = async () => {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) {
        console.error(error);
      } else {
        const PostsWithUsernameAndWithAvatar = await Promise.all(
          data.map(async (postItems) => {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", postItems.user_id)
              .single();
            if (profileError) {
              console.error(profileError);
            } else {
              postItems.username = profileData.username;
              postItems.avatar_url = profileData.avatar_url;
            }
            return postItems;
          })
        );
        setPostItems(PostsWithUsernameAndWithAvatar);
      }
    };
    loadPostItems();
  }, []);

  return (
    <div>
      <ul className="space-y-10">
        {postItems.map((item) => (
          <Link href={"/posts/" + item.id}>
            <div className="p-12 m-6 rounded-lg shadow flex-col bg-white w-[800px]">
              <li key={item.id}>
                <div className="flex items-center justify-center">
                  <img
                    className="w-[600px] h-[400px] object-contain"
                    src={
                      "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/pictures/" +
                      item.image_url
                    }
                    alt={item.title}
                  />
                </div>
                <div className="flex mt-2 mb-2">
                  <img
                    className="w-20 h-20 rounded-full"
                    src={
                      "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/" +
                      item.avatar_url
                    }
                  />
                  <p className="ml-2 font-bold text-xl my-4">{item.username}</p>
                </div>
                <h2 className="text-3xl mt-2 truncate ...">{item.title}</h2>
                <p className="text-base truncate ...">{item.description}</p>
              </li>
              <CommentCheck postItem={item} />
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Post;
