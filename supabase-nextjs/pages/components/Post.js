import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentCheck from "./CommentCheck";
import React from "react";

const Post = () => {
  const [searchValue, setSearchValue] = useState("");
  const supabase = useSupabaseClient();
  const [postItems, setPostItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("title", `%${query}%`);
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
      setSearchResults(data);
    }
  };

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
    const interval = setInterval(() => {
      loadPostItems();
    }, 2000);
    loadPostItems();
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mt-[-56px] fixed z-50 ml-12">
        <input
          type="text"
          className="h-[32px] rounded-l outline-none"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          className="h-[32px] px-2 leading-none border text-white border-white hover:border-transparent hover:text-blue-600 hover:bg-blue-100"
          onClick={() => handleSearch(searchValue)}
        >
          Поиск
        </button>
        <button
          className="h-[32px] px-2 leading-none border rounded-r text-white border-white hover:border-transparent hover:text-blue-600 hover:bg-white"
          onClick={() => handleSearch("") & setSearchValue("")}
        >
          Сброс
        </button>
      </div>

      <ul>
        {searchResults.length > 0
          ? searchResults.map((item) => (
              <div className="p-10 m-6 rounded-lg shadow flex-col bg-white w-[800px]">
                <Link href={"/posts/" + item.id}>
                  <div>
                    <li key={item.id}>
                      <div className="flex items-center justify-center w-full">
                        {item.image_url ? (
                          <img
                            className="w-[600px] h-[400px] object-contain"
                            src={
                              "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/pictures/" +
                              item.image_url
                            }
                            alt={item.image_url}
                          />
                        ) : (
                          <span></span>
                        )}
                      </div>
                      <div className="flex mt-2">
                        {!item.avatar_url ? (
                          <img
                            className="w-16 h-16 rounded-full"
                            src="https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/NoImage/NoImageUser.png?t=2023-05-20T07%3A22%3A57.040Z"
                          />
                        ) : (
                          <img
                            className="w-16 h-16 rounded-full"
                            src={
                              "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/" +
                              item.avatar_url
                            }
                          />
                        )}

                        <p className="ml-2 font-bold text-xl my-4">
                          {!item.username ? "Noname" : item.username}
                        </p>
                      </div>
                      <h2 className="text-3xl mt-2 truncate ...">
                        {item.title}
                      </h2>
                      <p className="text-1xl text-gray-600">
                        {item.created_at}
                      </p>

                      <p className="text-base truncate ...">
                        {item.description}
                      </p>
                    </li>
                  </div>
                </Link>
                <CommentCheck postItem={item} />
              </div>
            ))
          : postItems.map((item) => (
              <div className="p-10 m-6 rounded-lg shadow flex-col bg-white w-[800px]">
                <Link href={"/posts/" + item.id}>
                  <div>
                    <li key={item.id}>
                      <div className="flex items-center justify-center w-full">
                        {item.image_url ? (
                          <img
                            className="w-[600px] h-[400px] object-contain"
                            src={
                              "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/pictures/" +
                              item.image_url
                            }
                            alt=""
                          />
                        ) : (
                          <span></span>
                        )}
                      </div>
                      <div className="flex mt-2">
                        {!item.avatar_url ? (
                          <img
                            className="w-16 h-16 rounded-full"
                            src="https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/NoImage/NoImageUser.png?t=2023-05-20T07%3A22%3A57.040Z"
                          />
                        ) : (
                          <img
                            className="w-16 h-16 rounded-full"
                            src={
                              "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/" +
                              item.avatar_url
                            }
                          />
                        )}

                        <p className="ml-2 font-bold text-xl my-4">
                          {!item.username ? "Noname" : item.username}
                        </p>
                      </div>
                      <h2 className="text-3xl mt-2 truncate ...">
                        {item.title}
                      </h2>
                      <p className="text-1xl text-gray-600">
                        {item.created_at}
                      </p>

                      <p className="text-base truncate ...">
                        {item.description}
                      </p>
                    </li>
                  </div>
                </Link>
                <CommentCheck postItem={item} />
              </div>
            ))}
      </ul>
    </div>
  );
};

export default Post;
