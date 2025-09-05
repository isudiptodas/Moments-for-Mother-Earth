'use client'

import Navbar from "@/components/Navbar"
import { useTheme } from "@/context/ThemeContext"
import axios from "axios"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaMedium } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link"
import { FaBookmark } from "react-icons/fa";
import { toast } from "sonner"

interface User {
    name: string,
    password: string,
    email: string,
    profilePhoto?: string | null | undefined,
    id: string,
    dateCreated: string
}

interface Blog {
    title: string,
    content: string,
    linkedIn: string,
    medium: string,
    publishedOn: string,
    imagePath: string,
    storedPath: string,
    userEmail: string,
    uniqueId?: string,
    userName: string,
    savedBy?: string
}

function page() {

    const path = usePathname();
    const router = useRouter();
    const { dark } = useTheme();
    const [name, setName] = useState<string | null | undefined>('');
    const [email, setEmail] = useState<string | null | undefined>('');
    const [userData, setUserData] = useState<User | null>(null);
    const [blogData, setBlogData] = useState<Blog | null>(null);
    const [verified, setVerified] = useState(false);
    const blogId = path.split("blog/")[1];

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`/api/user-auth`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setUserData(res.data.found);
                    setName(res.data.found?.name);
                    setEmail(res.data.found?.email);
                    setVerified(true);
                }
            } catch (err) {
                console.log(err);
            }
        }

        verifyUser();
    }, []);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/user-blog?id=${blogId}`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setBlogData(res.data.found);
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchBlog();
    }, [blogId]);

    const saveBlog = async () => {
        const id = toast.loading("Saving ...");
        try {
            const res = await axios.post(`/api/user-blog`, {
                title: blogData?.title, content: blogData?.content, linkedIn: blogData?.linkedIn, 
                medium: blogData?.medium, publishedOn: blogData?.publishedOn, imagePath: blogData?.imagePath, 
                storedPath: blogData?.storedPath, userEmail: blogData?.userEmail, userName: blogData?.userName, 
                uniqueId: blogData?.uniqueId, savedBy: email, type: 'save'
            }, { withCredentials: true });

            if (res.status === 200) {
                toast.dismiss(id);
                toast.success("Saved");
            }
        } catch (err: any) {
            if (err?.response && err?.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally {
            toast.dismiss(id);
        }
    }

    return (
        <>
            <div className={`w-full h-screen ${verified ? "hidden" : "block"} bg-black flex justify-center items-center overflow-hidden`}>
                <img src="/assets/loading.gif" />
            </div>

            <div className={`w-full ${verified ? "block" : "hidden"} pb-10 flex flex-col justify-start items-center h-auto overflow-hidden relative ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out`}>
                <Navbar path={path} />

                <Link href='/user/blog' className={`fixed top-20 md:top-24 text-[12px] md:text-sm left-5 flex justify-center items-center gap-2 w-auto text-black bg-white shadow-2xl rounded-full py-1 px-3 text-center`}><IoIosArrowBack /> Go Back</Link>

                <div className={`w-full pt-24 h-auto md:h-screen overflow-y-auto md:overflow-hidden flex flex-col md:flex-row justify-start items-center md:items-start gap-4 ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out`}>

                    <div className={`w-full md:w-[70%] h-auto md:h-full px-2 py-5 flex flex-col justify-start items-center overflow-y-auto scroll-bar`}>
                        <img src={blogData?.imagePath} className={`w-full h-72 md:h-[320px] xl:h-[400px] rounded-lg lg:rounded-xl`} />

                        <p className={`w-full text-start mt-5 ${dark ? "text-white" : "text-black"} text-lg duration-150 ease-in-out font-montserrat font-semibold px-3`}>{blogData?.title}</p>
                        <pre className={`w-full whitespace-pre-wrap text-start mt-5 ${dark ? "text-white" : "text-black"} text-[12px] duration-150 ease-in-out font-montserrat px-3`}>
                            {blogData?.content}
                        </pre>
                    </div>

                    <div className={`w-full md:pt-10 mt-5 md:mt-0 h-auto md:w-[25%] flex flex-col justify-start items-start overflow-hidden px-5`}>
                        <p className={`w-full text-[12px] md:text-sm lg:text-lg ${dark ? "text-white" : "text-black"} duration-150 ease-in-out text-start font-dhyana text-sm`}>Published by : {blogData?.userName}</p>
                        <div className={`w-full mt-2 flex justify-start items-start`}>
                            <div className={`w-full flex justify-start items-center gap-3`}>
                                <span onClick={() => {
                                    window.open(blogData?.linkedIn, '_blank');
                                }} className={`w-auto text-[10px cursor-pointer] p-2 ${blogData?.linkedIn ? "block" : "hidden"} rounded-full ${dark ? "bg-white text-black" : "bg-zinc-600 text-white"} duration-150 ease-in-out`}><FaLinkedin /></span>
                                <span onClick={() => {
                                    window.open(blogData?.medium, '_blank');
                                }} className={`w-auto text-[10px cursor-pointer] p-2 ${blogData?.medium ? "block" : "hidden"} rounded-full ${dark ? "bg-white text-black" : "bg-zinc-600 text-white"} duration-150 ease-in-out`}><FaMedium /></span>
                            </div>
                        </div>
                        <p onClick={saveBlog} className={`w-full ${blogData?.savedBy ? "hidden" : "block"} cursor-pointer active:bg-blue-800 duration-150 ease-in-out rounded-md mt-4 py-2 text-center bg-blue-500 text-white flex justify-center items-center gap-2`}>Save <FaBookmark /></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
