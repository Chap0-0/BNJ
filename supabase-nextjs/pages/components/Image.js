import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
const { uuid } = require("uuidv4");

export default function ImageUpload({ url, onUpload }) {
  const supabase = useSupabaseClient();
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("pictures")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error) {
      console.log("Ошибка скачивания изображения: ", error);
    }
  }

  const handleUpload = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Вы должны выбрать изображение.");
      }

      const file = event.target.files[0];
      const fileExt = "png";
      const fileName = `${uuid()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("pictures")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Ошибка добавления изображения!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          className="w-[600px] h-[500px] object-contain"
          alt="Image"
        />
      ) : (
        <div />
      )}
      <div className="bg-blue-500 rounded text-white w-32 h-full mt-4 py-2 hover:bg-blue-700">
        <label htmlFor="single">
          {uploading ? "Добавление ..." : "Обновить шапку"}
        </label>
        <input
          className=" hidden "
          type="file"
          id="single"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
