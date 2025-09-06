'use client'
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSidebar } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

function Navbar({ path }: { path: string }) {

  const { dark, setDark } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={`w-full z-40 ${dark ? "bg-zinc-900" : "bg-white"} duration-150 ease-in-out h-auto fixed flex justify-center md:justify-between items-center py-5 md:px-8 shadow-xl`}>
        <img src={dark ? "/assets/logo-white.png" : "/assets/logo-black.png"} className={`h-5 duration-150 z-20 ease-in-out cursor-pointer lg:h-8`} />
        <span onClick={() => setVisible(!visible)} className={`absolute z-50 top-1/2 right-5 md:hidden text-lg sm:text-xl ${dark ? "text-white" : "text-black"} -translate-y-1/2 cursor-pointer`}>{visible ? <IoMdClose className={`text-2xl`} /> : <FiSidebar />}</span>

        <div className={`w-full h-auto z-40 px-5 rounded-b-3xl ${dark ? "backdrop-blur-3xl bg-black/60" : "backdrop-blur-3xl bg-white/25"} py-5 fixed top-0 ${visible ? "translate-y-0 shadow-2xl" : "-translate-y-full"} duration-200 ease-in-out flex md:hidden flex-col justify-start items-start pt-16`}>
          <Link href='/user/dashboard' className={`w-full ${path === '/user/dashboard' ? "border-l-2 border-green-700 px-2 font-semibold" : ""} text-start font-montserrat text-lg py-1 my-2 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Home</Link>
          <Link href='/user/blog' className={`w-full ${path === '/user/blog' || path.includes("/user/blog") ? "border-l-2 border-green-700 px-2 font-semibold" : ""} text-start font-montserrat text-lg py-1 my-2 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Blog</Link>
          <Link href='/user/podcast' className={`w-full ${path === '/user/podcast' ? "border-l-2 border-green-700 px-2 font-semibold" : ""} text-start font-montserrat text-lg py-1 my-2 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Podcast</Link>
          <Link href='/user/events' className={`w-full ${path === '/user/events' ? "border-l-2 border-green-700 px-2 font-semibold" : ""} text-start font-montserrat text-lg py-1 my-2 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Events</Link>
          {/* <Link href='/user/donate' className={`w-full ${path === '/user/donate' ? "border-l-2 border-green-700 px-2 font-semibold" : ""} text-start font-montserrat text-lg py-1 my-2 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out flex justify-start items-center gap-2`}>Donate <span className={`opacity-45`}>Beta</span></Link> */}
          <Link href='/user/account' className={`w-full ${path === '/user/account' ? "border-l-2 border-green-700 px-2 font-semibold" : ""} text-start font-montserrat text-lg py-1 mt-2 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Account</Link>
          <input
            onChange={(e) => { setDark(!dark) }}
            type="checkbox"
            checked={dark}
            className="toggle my-4 border-gray-400 text-white bg-gray-300 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
          />
        </div>

        <div className={`w-auto z-40 hidden md:flex justify-center items-center gap-4 xl:gap-6`}>
          <Link href='/user/dashboard' className={`w-auto ${dark ? "text-white" : "text-black"} py-2 px-3 ${path === '/user/dashboard' ? "bg-gradient-to-r from-teal-400 to-green-700 rounded-full px-5 font-semibold text-white" : ""} shrink-0 text-sm xl:text-lg font-montserrat`}>Home</Link>
          <Link href='/user/blog' className={`w-auto ${dark ? "text-white" : "text-black"} py-2 px-3 ${path === '/user/blog' || path.includes("/user/blog") ? "bg-gradient-to-r from-teal-400 to-green-700 rounded-full px-5 font-semibold text-white" : ""} shrink-0 text-sm xl:text-lg font-montserrat`}>Blog</Link>
          <Link href='/user/podcast' className={`w-auto ${dark ? "text-white" : "text-black"} py-2 px-3 ${path === '/user/podcast' ? "bg-gradient-to-r from-teal-400 to-green-700 rounded-full px-5 font-semibold text-white" : ""} shrink-0 text-sm xl:text-lg font-montserrat`}>Podcast</Link>
          <Link href='/user/events' className={`w-auto ${dark ? "text-white" : "text-black"} py-2 px-3 ${path === '/user/events' ? "bg-gradient-to-r from-teal-400 to-green-700 rounded-full px-5 font-semibold text-white" : ""} shrink-0 text-sm xl:text-lg font-montserrat`}>Events</Link>
          {/* <Link href='/user/donate' className={`w-auto ${dark ? "text-white" : "text-black"} py-2 ${path === '/user/donate' ? "bg-gradient-to-r from-teal-400 to-green-700 rounded-full px-5 font-semibold text-white" : ""} shrink-0 text-sm xl:text-lg font-montserrat flex justify-center items-center gap-2`}>Donate <span className={`opacity-50 text-[10px] xl:text-sm`}>Beta</span></Link> */}
        </div>

        <div className={`w-auto z-40 hidden md:flex justify-center items-center gap-5`}>
          <Link href='/user/account' className={`w-auto ${path === '/user/account' ? "bg-gradient-to-r from-teal-400 to-green-700 rounded-full px-5 font-semibold text-white" : ""} py-2 ${dark ? "text-white" : "text-black"} shrink-0 text-sm xl:text-lg font-montserrat`}>Account</Link>
          <input
            onChange={(e) => { setDark(!dark) }}
            type="checkbox"
            checked={dark}
            className="toggle border-gray-400 text-white bg-gray-300 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
          />
        </div>
      </div>
    </>
  )
}

export default Navbar
