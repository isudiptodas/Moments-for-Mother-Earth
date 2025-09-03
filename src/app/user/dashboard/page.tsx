'use client'

import Navbar from "@/components/Navbar"
import axios from "axios";
import { useEffect, useState } from "react"

function page() {

    const[verified, setVerified] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`/api/user-auth`, {
                    withCredentials: true
                });

                if(res.status === 200){
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
    
      <div className={`w-full h-auto ${verified ? "block" : "hidden"} flex flex-col justify-start items-center relative overflow-hidden`}>

      </div>
    </>
  )
}

export default page
