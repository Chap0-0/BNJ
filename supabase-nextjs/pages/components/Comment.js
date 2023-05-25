import { supabase } from "../api/api";
import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";

export default function Comment({ postItem }) {
  const user = useUser();
  const [commentBody, setCommentBody] = useState("");
  const [comments, setComments] = useState([]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error(profileError);
    } else {
      const { username } = profileData;
      const { data, error } = await supabase.from("comments").insert({
        body: commentBody,
        user_id: user.id,
        post_id: postItem.id,
        created_at: new Date(),
      });
      if (error) {
        console.error(error);
      } else {
        setCommentBody("");
        console.log(data);
        if (data !== null) {
          setComments([...comments, data[0]]);
        }
      }
    }
  };

  const handleDeleteComment = async (id) => {
    await supabase.from("comments").delete().eq("id", id);
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const loadComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postItem.id);
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

  useEffect(() => {
    const interval = setInterval(() => {
      loadComments();
    }, 2000);
    loadComments();
    return () => clearInterval(interval);
  }, [postItem.id]);

  return (
    <div>
      <hr className="my-4" />
      <form onSubmit={handleSubmitComment}>
        <div className="flex flex-col mb-4">
          <label htmlFor="comment" className="font-bold mb-2">
            Добавить комментарий
          </label>
          <textarea
            className="border rounded-lg py-2 px-3 shadow"
            id="comment"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            required
          />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Отправить
        </button>
      </form>
      <hr className="my-4" />
      <div>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className=" bg-white border rounded-lg p-2 mb-2 shadow"
          >
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
              <p className="font-bold my-2 ml-2">{comment.username}</p>
            </div>
            <p className="text-sm text-gray-600">{comment.created_at}</p>
            <p className="mt-2 break-words">{comment.body}</p>
            {user && comment.user_id === user.id && (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-[880px]"
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
