'use client'

import Navbar from "@/components/Navbar"
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

function page() {

  const [verified, setVerified] = useState(true);
  const { dark } = useTheme()
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`/api/user-auth`, {
          withCredentials: true
        });

        if (res.status === 200) {
          setVerified(true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    verifyUser();
  }, []);

  return (
    <>

      <div className={`w-full h-screen ${verified ? "hidden" : "block"} bg-black flex justify-center items-center overflow-hidden`}>
        <img src="/assets/loading.gif" />
      </div>

      <div className={`w-full h-screen ${verified ? "block" : "hidden"} ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center relative overflow-hidden`}>
        <Navbar path={pathname} />
      </div>
    </>
  )
}

export default page
