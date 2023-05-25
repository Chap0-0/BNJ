import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../api/api";
import { useUser } from "@supabase/auth-helpers-react";
import Header from "../components/Header";
import Link from "next/link";
import Footer from "../components/Footer";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useUser();
  const [users, setUsers] = useState([]);
  const [deletingItem, setDeletingItem] = useState(null);
  const [postsItems, setPostsItems] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    };

    loadUsers();
    const loadpostsItems = async () => {
      const { data, error } = await supabase.from("posts").select("*");

      if (error) {
        console.error(error);
      } else {
        setPostsItems(data);
      }
    };

    loadpostsItems();
    const fetchAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("admin")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error(error);
        } else {
          setIsAdmin(data.admin);
        }
      }
    };

    fetchAdminStatus();
  }, [user]);

  const userDelete = async (itemId) => {
    try {
      setDeletingItem(itemId);

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", itemId);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Пользователь успешно удален");
    } catch (error) {
      console.error("Ошибка удаления пользователя:", error);
    } finally {
      setDeletingItem(null);
    }
  };
  const handleDelete = async (itemId) => {
    const { error } = await supabase.from("posts").delete().eq("id", itemId);

    if (error) {
      console.error(error);
    } else {
      setPostsItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    }
  };

  return (
    <>
      {isAdmin ? (
        <div>
          <Header />
          <h1 className="text-center text-black mt-24 font-extrabold">
            Таблица постов
          </h1>
          <table className="mt-2 border-2 border-gray-500 mx-4 w-[98%]">
            <thead>
              <tr>
                <th className="border-2 border-gray-500">ID поста</th>
                <th className="border-2 border-gray-500">Название поста</th>
                <th className="border-2 border-gray-500">Описание</th>
                <th className="border-2 border-gray-500">Удалить</th>
              </tr>
            </thead>
            <tbody>
              {postsItems.map((item) => (
                <tr className="border-2 p-2 border-gray-500 " key={item.id}>
                  <td className="border-2 p-2 border-gray-500 ">{item.id}</td>
                  <td className="border-2 p-2 border-gray-500 ">
                    {item.title}
                  </td>
                  <td className="border-2 p-2 border-gray-500  ">
                    <Link href={"/posts/" + item.id}>Подробнее о посте...</Link>
                  </td>
                  <td className=" text-center border-2 p-2 border-gray-500 ">
                    <button
                      className=" bg-red-500 rounded w-20 hover:bg-red-700 h-8 text-white"
                      onClick={() => handleDelete(item.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Header />
            <h1 className="text-center text-black mt-8 font-extrabold">
              Таблица пользователей
            </h1>
            <table className="mt-4 border-2 border-gray-500 mx-4 w-[98%]">
              <thead>
                <tr>
                  <th className="border-2 p-2 border-gray-500 text-center ">
                    ID
                  </th>
                  <th className="border-2 p-2 border-gray-500 text-center ">
                    Имя пользователя
                  </th>
                  <th className="border-2 p-2 border-gray-500 text-center ">
                    Информация о пользователе
                  </th>
                  <th className="border-2 p-2 border-gray-500 text-center ">
                    Удаление пользователя
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr
                    className="border-2 p-2 border-gray-500 text-center "
                    key={item.id}
                  >
                    <td className="border-2 p-2 border-gray-500 text-center ">
                      {item.id}
                    </td>
                    <td className="border-2 p-2 border-gray-500 text-center ">
                      {item.username}
                    </td>
                    <td className="border-2 p-2 border-gray-500 text-center ">
                      <Link href={"/admin/" + item.id}>
                        Подробнее о пользователе...
                      </Link>
                    </td>
                    <td className="border-2 p-2 border-gray-500 text-center ">
                      {user.id == item.id ? (
                        <p>Это вы</p>
                      ) : (
                        <button
                          className="bg-red-500 rounded w-44 h-8 hover:bg-red-700 text-white"
                          onClick={() => userDelete(item.id)}
                        >
                          Удалить пользователя
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2 text-center text-white rounded font-semibold bg-blue-500 hover:bg-blue-700 w-[180px] h-[40px] mt-10 mb-10 mx-auto">
            <Link href="/">На главную</Link>
          </div>
          <Footer />
        </div>
      ) : (
        <div>
          <Header />
          <p>Вам запрещён доступ</p>
        </div>
      )}
    </>
  );
};
export default Admin;
