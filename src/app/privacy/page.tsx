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
                    <h1 className={`w-full text-center font-bold font-genos text-5xl xl:text-6xl text-white`}>Privacy Policy</h1>
                    <p className={`w-full text-center font-light italic text-lg`}>Have a look on data collection and privacy</p>
                </div>

                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>At Moments for Mother Earth, your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, 
                    listen to our podcast, or engage with our content.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Information We Collect</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>You agree to use our website and platforms responsibly. You may not:</p>

                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Personal Information: If you contact us or subscribe to our updates, we may collect your name, email address, or other contact details.</p>
                <p className={`w-full text-start font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Usage Data: We may collect non-personal data such as IP addresses, browser type, device information, and site activity for analytics and improvements.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>How We Use Your Information</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Share podcast updates, newsletters, or resources.</p>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Respond to your inquiries and feedback.</p>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Improve our website, podcast, and overall user experience.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Sharing of Information</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>We do not sell or rent your personal information. We may share limited data with trusted service providers (such as email platforms or analytics tools) solely to improve our services.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Data Security</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>We take effective steps to protect your information, such as login details, shared resources and others. Ensuring that every uploaded data will be secured by our side.</p>
                
                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Updates to Privacy Policy</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>We may update this Privacy Policy from time to time. Updates will be posted on this page with the revised effective date.</p>

            </div>
        </>
    )
}

export default page
