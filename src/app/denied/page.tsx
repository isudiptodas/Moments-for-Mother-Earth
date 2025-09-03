'use client'

import Link from "next/link"

function page() {
  return (
    <>
      <div className={`w-full px-10 h-screen overflow-hidden flex flex-col justify-center items-center bg-gradient-to-tr from-[#4338ca] via-[#1e40af] to-[#164e63]`}>
        <h1 className={`w-full text-center font-montserrat text-white text-2xl font-semibold`}>Looks like you are not allowed to acceess this page </h1>
        <Link href='/' className={`w-auto px-3 md:px-5 py-2 rounded-full mt-3 bg-white text-black font-dhyana text-[12px] md:text-sm cursor-pointer active:opacity-75 duration-150 ease-in-out`}>Back to Landing Page</Link>
      </div>
    </>
  )
}

export default page
