'use client'

import Link from "next/link";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

function page() {
    return (
        <>
            <div className={`w-full min-h-screen pt-10 pb-14 bg-white flex flex-col justify-start items-center relative`}>
                <img src="/assets/logo-black.png" className={`h-6`} />

                <Link href='/' className={`w-auto fixed z-20 hover:bg-gray-200 duration-150 ease-in-out top-5 left-5 hidden text-black px-4 py-2 bg-white rounded-full shadow-2xl cursor-pointer md:flex justify-center items-center gap-2`}><MdOutlineKeyboardBackspace /> Go Back</Link>

                <div className={`w-full h-auto bg-green-600 mt-10 flex flex-col justify-center items-center py-10 xl:py-8 px-5 `}>
                    <h1 className={`w-full text-center font-bold font-genos text-5xl xl:text-6xl text-white`}>Terms of Use</h1>
                    <p className={`w-full text-center font-light italic text-lg`}>Points to keep in mind in account of using this website</p>
                </div>

                <p className={`w-full text-start mt-10 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>Welcome to Moments for Mother Earth. By accessing or using our website, podcast, or related services, you agree to comply with and be bound by the
                    following Terms and Conditions. Please read them carefully.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Use of Our Content</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>All content published on our website, podcast episodes, articles, images, and media is for informational and educational purposes only. You may share our
                    content for personal or non-commercial use, provided you give proper credit. Any unauthorized commercial use, reproduction, or distribution is prohibited.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>User Conduct</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>You agree to use our website and platforms responsibly. You may not:</p>

                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Post or transmit harmful, unlawful, or offensive material.</p>
                <p className={`w-full text-start font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Attempt to disrupt, hack, or interfere with our website.</p>
                <p className={`w-full text-start font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>● Use our content in ways that misrepresent our message or brand.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Third Party Links</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>Our website may include links to third-party websites or services. We are not responsible for the content, policies, or practices of these external sites.</p>

                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Limitation of Liability</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>We are not liable for any damages arising from the use of our website, podcast, or related services. Use our platform at your own discretion.</p>
                
                <h1 className={`w-full text-start mt-5 font-montserrat font-semibold text-xl text-black px-5 md:px-10`}>Changes to Terms</h1>
                <p className={`w-full text-start mt-2 font-montserrat text-[12px] md:text-sm px-5 md:px-10 text-black`}>We reserve the right to update these Terms and Conditions at any time. Continued use of our services after changes constitutes acceptance of the revised terms.</p>


            </div>
        </>
    )
}

export default page
