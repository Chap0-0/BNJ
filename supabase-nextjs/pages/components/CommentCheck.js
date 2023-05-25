import { supabase } from "../api/api";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";

export default function Comment({ postItem }) {
  const user = useUser();
  const [comments, setComments] = useState([]);

  const handleDeleteComment = async (id) => {
    await supabase.from("comments").delete().eq("id", id);
    setComments(comments.filter((comment) => comment.id !== id));
  };

  useEffect(() => {
    const loadComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postItem.id)
        .limit(1);
      if (error) {
        console.error(error);
      } else {
        const commentsWithUsername = await Promise.all(
          data.map(async (comment) => {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", comment.user_id)
              .single();
            if (profileError) {
              console.error(profileError);
            } else {
              comment.username = profileData.username;
              comment.avatar_url = profileData.avatar_url;
            }
            return comment;
          })
        );
        setComments(commentsWithUsername);
      }
    };

    const interval = setInterval(() => {
      loadComments();
    }, 2000);
    loadComments();
    return () => clearInterval(interval);
  }, [postItem.id]);

  return (
    <div>
      <p>{postItem.body}</p>
      <hr className="my-4" />
      <div>
        <p className="font-bold mb-2">Комментарии</p>

        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-2 mb-2 shadow">
            <div className="flex">
            {comment.avatar_url ? (
                <img
                  className="w-12 h-12 rounded-full"
                  src={
                    "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/" +
                    comment.avatar_url
                  }
                />
              ) : (
                <img
                  className="w-12 h-12 rounded-full"
                  src={
                    "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/NoImage/NoImageUser.png"
                  }
                />
              )
              }
              <p className="font-bold m-2 truncate">{comment.username}</p>
            </div>
            <p className=" text-sm text-gray-600">{comment.created_at}</p>
            <p className="truncate">{comment.body}</p>
            {user && comment.user_id === user.id && (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
