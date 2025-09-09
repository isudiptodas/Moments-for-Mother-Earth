'use client'

import Link from "next/link";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

function page() {

    const openLink = (link: string) => {
        if (link.includes('@gmail.com')) {
            window.open(`mailto:${link}`);
        }
        else {
            window.open(link, '_blank');
        }
    }

    return (
        <>
            <div className={`w-full min-h-screen pt-10 pb-14 bg-white flex flex-col justify-start items-center relative`}>
                <img src="/assets/logo-black.png" className={`h-6`} />

                <Link href='/' className={`w-auto fixed hover:bg-gray-200 z-20 bg-white duration-150 ease-in-out top-5 left-5 hidden text-black px-4 py-2 rounded-full shadow-2xl cursor-pointer md:flex justify-center items-center gap-2`}><MdOutlineKeyboardBackspace /> Go Back</Link>

                <div className={`w-full h-auto bg-green-600 mt-10 flex flex-col justify-center items-center py-10 xl:py-8 px-5`}>
                    <h1 className={`w-full text-center font-bold font-genos text-5xl xl:text-6xl text-white`}>Contact Us</h1>
                    <p className={`w-full text-center font-light italic text-lg`}>Got a query ? let's connect together</p>
                </div>

                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>At Moments for Mother Earth, we believe that change begins with conversation. Whether you’re a listener, a sustainability enthusiast, an
                    organization, or simply someone who wants to make a difference, we’d love to hear from you.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Have a Question ?</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>Reach out and tell us your story, we’ll be happy to hear and assist you.</p>

                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black flex gap-2`}>● Email : <span className={`text-blue-600 font-montserrat italic font-semibold`} onClick={() => {openLink('info.mfme@gmail.com')}}>info.mfme@gmail.com</span></p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Connect with Our Social Profile</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black flex gap-2`}>● Instagram : <span className={`text-blue-600 font-montserrat italic font-semibold`} onClick={() => {openLink('https://www.instagram.com/momentformotherearth/?igsh=MTQ2MjRzcGJoeGR2Ng%3D%3D#')}}>@momentformotherearth</span></p>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black flex gap-2`}>● YouTube : <span className={`text-blue-600 font-montserrat italic font-semibold`} onClick={() => {openLink('https://www.youtube.com/@momentformotherearth')}}>Moment For Mother Earth</span></p>

            </div>
        </>
    )
}

export default page
