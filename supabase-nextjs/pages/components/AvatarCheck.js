import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";

function AvatarChecking() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const user = useUser();

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const fileRand = Math.random();
      const url = `https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/${user?.id}.png?${fileRand}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          setAvatarUrl(url);
        } else {
          setAvatarUrl(
            "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/NoImage/NoImageUser.png?t=2023-05-20T07%3A22%3A57.040Z"
          );
        }
      } catch (error) {
        setAvatarUrl(
          "https://tcdzmtzjxlljrjivxvmp.supabase.co/storage/v1/object/public/avatars/NoImage/NoImageUser.png?t=2023-05-20T07%3A22%3A57.040Z"
        );
      }
    };

    if (user?.id) {
      fetchAvatarUrl();
    }
  }, [user?.id]);

  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="w-32 h-32 rounded-full ml-[78px] mr-[78px] bg-white"
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default AvatarChecking;
