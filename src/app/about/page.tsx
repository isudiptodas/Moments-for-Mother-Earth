'use client'

import Link from "next/link";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

function page() {
    return (
        <>
            <div className={`w-full min-h-screen pt-10 pb-14 bg-white flex flex-col justify-start items-center relative`}>
                <img src="/assets/logo-black.png" className={`h-6`} />

                <Link href='/' className={`w-auto fixed hover:bg-gray-200 z-20 bg-white duration-150 ease-in-out top-5 left-5 hidden text-black px-4 py-2 rounded-full shadow-2xl cursor-pointer md:flex justify-center items-center gap-2`}><MdOutlineKeyboardBackspace /> Go Back</Link>

                <div className={`w-full h-auto bg-green-600 mt-10 flex flex-col justify-center items-center py-10 xl:py-8 px-5`}>
                    <h1 className={`w-full text-center font-bold font-genos text-5xl xl:text-6xl text-white`}>About Us</h1>
                    <p className={`w-full text-center font-light italic text-lg`}>Get to know who we are</p>
                </div>

                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>Moments for Mother Earth is a podcast dedicated to creating awareness,
                    inspiring change, and celebrating the efforts that protect and preserve our planet. We believe that every action — no matter how small — is a meaningful moment for Mother Earth.
                    Through our platform, we bring together stories, ideas, and solutions that highlight the importance of living in harmony with nature.</p>

                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>Our work goes beyond conversations. We step into the field to capture real stories, 
                    document on-ground challenges, and share the innovative practices of communities and individuals making a difference. From discussions on climate change and conservation to exploring sustainable 
                    lifestyles and local initiatives, our episodes shine a light on both global and grassroots efforts.</p>

                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>At Moments for Mother Earth, we aim to educate, engage, and empower people to take mindful steps 
                    toward a more sustainable future. Each episode is crafted to spark dialogue, deepen understanding, and encourage actions that collectively lead to lasting impact.</p>
            
                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>We envision a world where humanity and nature thrive together, where protecting the environment becomes 
                    a shared responsibility, and where every voice contributes to a greener tomorrow. Join us as we turn stories into inspiration and inspiration into action — because every moment counts when it comes to saving Mother Earth.</p>
            
            </div>
        </>
    )
}

export default page
