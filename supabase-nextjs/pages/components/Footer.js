import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <section className="shadow items-center w-full bg-[#0D47A1] mt-[12%]">
      <footer className="flex justify-between p-6">
        <span className="text-slate-100 ">
          © 2023{" "}
          <Link href="/" className="hover:underline">
            DEVS NB
          </Link>
        </span>
        <ul className=" text-white mt-0">
          <li>
            <p className="mr-6">devsNB@mail.ru</p>
          </li>
        </ul>
      </footer>
    </section>
  );
};

export default Footer;
