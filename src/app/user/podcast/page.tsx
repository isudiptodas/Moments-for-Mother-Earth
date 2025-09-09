'use client'

import Navbar from "@/components/Navbar"
import { useTheme } from "@/context/ThemeContext"
import { dummy } from "@/data/dummy"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaPlay } from "react-icons/fa6";
import { FaReadme } from "react-icons/fa";
import { MdPublish } from "react-icons/md";
import { MdOutlineEditNote } from "react-icons/md";
import { supabase } from "@/config/supabase"
import { toast } from "sonner"
import { ImShrink2 } from "react-icons/im";
import { format } from "date-fns"
import { v4 } from 'uuid';
import { IoIosTrash } from "react-icons/io";

interface User {
    name: string,
    password: string,
    email: string,
    profilePhoto?: string | null | undefined,
    id: string,
    dateCreated: string
}

interface Podcast {
    title: string,
    description: string,
    link?: string,
    imagePath?: string,
    storedPath?: string,
    publishedOn?: string,
    userEmail?: string,
    userName?: string,
    uniqueId?: string,
}

function page() {

    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);
    const [name, setName] = useState<string | null | undefined>('');
    const [email, setEmail] = useState<string | null | undefined>('');
    const [verified, setVerified] = useState(false);
    const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
    const [readMoreVisible, setReadMoreVisible] = useState(false);
    const [publishVisible, setPublishVisible] = useState(false);
    const { dark } = useTheme();
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [allPodcast, setAllPodcast] = useState<Podcast[] | []>([]);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [option, setOption] = useState('');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`/api/user-auth`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setVerified(true);
                    setUserData(res.data.found);
                    setName(res.data.found?.name);
                    setEmail(res.data.found?.email);
                }
            } catch (err) {
                console.log(err);
            }
        }

        verifyUser();
    }, []);

    const publishPodcast = async () => {

        if (loadingMessage) {
            toast.error("Please wait ...");
            return;
        }

        if (!image) {
            toast.error("Image required");
            return;
        }

        if (!title || !description || !link) {
            toast.error("All fields are required");
            return;
        }
        if (description.length > 300) {
            toast.error("Description limit exceeded");
            return;
        }

        try {
            setLoadingMessage("Publishing ...");
            const { data, error } = await supabase
                .storage
                .from('user_podcast_images')
                .upload(`public/${image.name}-${Date.now().toString()}`, image, {
                });

            const path = data?.path as string;

            const { data: dt } = supabase
                .storage
                .from('user_podcast_images')
                .getPublicUrl(path)

            const id = v4() as string;

            const res = await axios.post('/api/user-podcast', {
                title: title.trim(), description: description.trim(), imagePath: dt.publicUrl, storedPath: path, link: link.trim(),
                publishedOn: format(Date.now(), "do MMMM yyyy"), uniqueId: id, userEmail: email, userName: name, type: 'create'
            }, { withCredentials: true });

            console.log(res.data);
            if (res.status === 201) {
                toast.success("Published");
                setPublishVisible(false);
                setTitle("");
                setDescription("");
                setLink("");
                setImage(null);
                setLoadingMessage("");
                router.refresh();
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
            setLoadingMessage("");
        }
    }

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                const res = await axios.get(`/api/user-podcast`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setAllPodcast(res.data?.found);
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchPodcast();
    }, []);

    useEffect(() => {
        if (option === 'your') {
            const filter = allPodcast.filter((item) => {
                return item.userEmail === email
            });

            setAllPodcast(filter);
        }
    }, []);

    const deletePodcast = async (data: Podcast) => {
        try {
            const res = await axios.delete(`/api/user-podcast?uniqueId=${data.uniqueId}&path=${data.storedPath}`, {
                withCredentials: true
            });

            if(res.status === 200){
                toast.success("Podcast deleted");
                router.refresh();
            }
        }
        catch (err: any) {
            if (err?.response && err?.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally{
            setReadMoreVisible(false);
        }
    }


    return (
        <>
            <div className={`w-full h-screen ${verified ? "hidden" : "block"} bg-black flex justify-center items-center overflow-hidden`}>
                <img src="/assets/loading.gif" />
            </div>

            <div className={`w-full h-screen overflow-y-auto ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center relative`}>
                <Navbar path={pathname} />

                <div className={`w-[90%] pb-5 border-b-2 border-green-800 h-auto mt-24 md:mt-28 flex flex-col justify-center items-center`}>
                    <h1 className={`w-full text-center text-xl md:text-2xl font-cinzel ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Voices for a <br /><span className={`font-montserrat font-bold text-3xl md:text-5xl bg-gradient-to-br from-teal-500 via-green-500 to-green-900 bg-clip-text text-transparent`}>Greener Future</span></h1>
                </div>

                {/* read more div */}
                <div className={`fixed z-30 ${readMoreVisible ? "block" : "hidden"} top-0 right-0 px-5 h-full flex flex-col md:flex-row justify-center items-center gap-3 overflow-hidden w-full backdrop-blur-2xl ${dark ? "bg-black/20" : "bg-white/20"}`}>
                    <img src={currentPodcast?.imagePath} className={`w-full md:w-1/2 h-48 md:h-[60%] rounded-lg`} />
                    <div className={`w-full md:w-1/2 md:px-10 h-auto md:h-full flex flex-col justify-start md:justify-center items-center`}>
                        <p className={`w-full mt-5 text-center font-semibold font-dhyana text-lg ${dark ? "text-white" : "text-black"}`}>{currentPodcast?.title}</p>
                        <p className={`w-full mt-2 text-center font-dhyana text-[12px] md:text-sm ${dark ? "text-white" : "text-black"}`}>{currentPodcast?.description}</p>
                        <p className={`w-full mt-3 mb-3 font-semibold text-center font-dhyana text-[12px] md:text-sm ${dark ? "text-white" : "text-black"}`}>Published on : {currentPodcast?.publishedOn}</p>
                        <p onClick={() => {
                            window.open(currentPodcast?.link, '_blank');
                        }} className={`w-full py-2 text-center mt-3 bg-blue-500 text-white font-sm cursor-pointer font-montserrat active:opacity-70 duration-150 ease-in-out rounded-full`}>Open Link</p>
                        <p onClick={() => {
                            deletePodcast(currentPodcast as Podcast)
                        }} className={`w-full py-2 ${currentPodcast?.userEmail === email ? "block" : "hidden"} text-center mt-3 bg-red-500 text-white font-sm cursor-pointer font-montserrat active:opacity-70 duration-150 ease-in-out rounded-full flex justify-center items-center gap-2`}>Delete <IoIosTrash /></p>
                        <p onClick={() => {
                            setReadMoreVisible(false);
                            setCurrentPodcast(null);
                        }} className={`w-full cursor-pointer mt-5 text-center ${dark ? "text-white" : "text-black"} text-sm md:text-lg font-semibold font-montserrat`}>Cancel</p>
                    </div>
                </div>

                {/* publish div */}
                <div className={`fixed z-30 ${publishVisible ? "block" : "hidden"} top-0 right-0 px-5 h-full flex flex-col md:flex-row justify-center items-center gap-3 overflow-hidden w-full backdrop-blur-2xl ${dark ? "bg-black/20" : "bg-white/20"}`}>

                    <span onClick={() => {
                        setPublishVisible(false);
                        setImage(null);
                    }} className={`w-auto absolute p-2 top-20 md:top-28 rounded-full left-5 md:left-10 ${dark ? "bg-white text-black" : "bg-black text-white"} cursor-pointer duration-150 ease-in-out`}><ImShrink2 /></span>

                    {/* image div */}
                    <div className={`w-full px-5 md:w-1/2 h-auto md:h-[70%] flex flex-col justify-start items-center md:justify-center md:gap-10`}>
                        <div className={`w-full relative overflow-hidden rounded-lg border-2 border-dashed ${dark ? "border-teal-500" : "border-teal-900"} py-5 flex flex-col justify-center items-center px-4`}>
                            <p className={`w-auto ${image ? "hidden" : "block"} cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-full`}>Select Image</p>
                            <input onChange={(e) => {
                                if (e && e.target.files) {
                                    const img = e.target.files[0];
                                    if (!img.type.startsWith("image")) {
                                        toast.error("Invalid format");
                                        return;
                                    }

                                    setImage(img);
                                }
                            }} type="file" className={`w-full opacity-0 absolute top-1/2 -translate-y-1/2 left-1/2 text-2xl`} />
                            <p className={`w-full text-center mt-3 cursor-pointer ${dark ? "text-white" : "text-black"} ${image ? "block" : "hidden"} duration-150 ease-in-out font-dhyana italic text-[12px] md:text-sm`}>{image?.name}</p>
                            <p className={`w-auto ${image ? "block" : "hidden"} mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-full`}>Upload</p>
                            <p onClick={() => {
                                setImage(null);
                            }} className={`w-auto ${image ? "block" : "hidden"} cursor-pointer px-4 py-2 mt-3 bg-red-600 text-white text-sm rounded-full`}>Remove</p>
                        </div>
                    </div>

                    {/* input div */}
                    <div className={`w-full mt-3 md:mt-0 md:w-1/2 h-auto md:h-full flex flex-col justify-start md:justify-center items-center`}>
                        <input onChange={(e) => setTitle(e.target.value)} type="text" className={`w-full px-3 py-2 rounded-md ${dark ? "bg-zinc-500 text-white" : "bg-gray-200 text-black"} font-montserrat text-[12px] md:text-sm outline-none`} placeholder="Enter title" />
                        <textarea onChange={(e) => setDescription(e.target.value)} className={`w-full px-3 py-2 h-44 md:h-36 mt-3 rounded-md ${dark ? "bg-zinc-500 text-white" : "bg-gray-200 text-black"} font-montserrat text-[12px] md:text-sm outline-none`} placeholder="Enter description (max 300 characters)" />
                        <input onChange={(e) => setLink(e.target.value)} type="text" className={`w-full mt-3 px-3 py-2 rounded-md ${dark ? "bg-zinc-500 text-white" : "bg-gray-200 text-black"} font-montserrat text-[12px] md:text-sm outline-none`} placeholder="Enter link" />
                        <p onClick={publishPodcast} className={`w-full cursor-pointer active:opacity-75 text-center mt-3 py-3 rounded-full bg-gradient-to-r from-teal-500 to-green-800 text-white font-montserrat text-[12px] d:text-sm duration-150 ease-in-out`}>{loadingMessage ? (<><span>{loadingMessage}</span><span className="ml-2 loading loading-spinner loading-sm"></span></>) : ("Publish")}</p>
                    </div>
                </div>

                <div className={`w-full pb-10 mt-5 px-5 md:px-10 flex flex-col justify-start items-start`}>

                    <div className={`w-full flex justify-center md:justify-start items-start gap-3 py-4`}>
                        <span onClick={() => {
                            setPublishVisible(true);
                        }} className={`w-1/2 md:w-auto px-3 md:px-7 py-5 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white font-montserrat text-[12px] md:text-sm active:opacity-80 duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-2`}>Publish <MdPublish /></span>
                        <span onClick={() => {
                            setOption('your');
                        }} className={`w-1/2 md:w-auto px-3 md:px-7 py-5 rounded-md bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 text-white font-montserrat text-[12px] md:text-sm active:opacity-80 duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-2`}>Your Post <MdOutlineEditNote /></span>
                    </div>

                    <h1 className={`w-full text-start ${allPodcast.length > 7 ? "block" : "hidden"} py-3 font-semibold font-montserrat text-lg ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Explore Weekly Top</h1>

                    <div className={`w-full ${allPodcast.length > 7 ? "block" : "hidden"} mt-2 ${dark ? "bg-zinc-800" : "bg-gray-200"} rounded-lg md:rounded-xl py-4 px-3 flex justify-start items-start gap-5 overflow-x-auto scroll-bar`}>
                        {allPodcast.slice(0, 5).map((item, index) => {
                            return <div key={index} className={`w-full sm:w-60 xl:w-72 h-48 rounded-lg shrink-0 flex justify-center items-center relative overflow-hidden`}>
                                <img src={item.imagePath} className={`w-full h-full z-10 object-cover rounded-lg`} />
                                <div className={`w-full h-full absolute top-0 z-20 flex justify-start items-end gap-3 px-5 pb-4`}>
                                    <span className={`p-2 flex justify-center items-center text-black bg-white rounded-full cursor-pointer active:opacity-70 text-[10px] md:text-sm duration-150 ease-in-out`}><FaPlay /></span>
                                    <span onClick={() => {
                                        setCurrentPodcast(item)
                                        setReadMoreVisible(true);
                                        document.body.style.overflow = 'hidden'; // disable background scroll
                                    }} className={`px-3 py-1 md:py-2 text-black bg-white rounded-full flex justify-center items-center gap-2 cursor-pointer active:opacity-70 duration-150 ease-in-out`}>Read More <FaReadme /></span>
                                </div>
                            </div>
                        })}
                    </div>

                    <h1 className={`w-full ${allPodcast.length > 0 ? "block" : "hidden"} text-start mt-4 py-3 font-semibold font-montserrat text-lg ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Discover All</h1>

                    <div className={`w-full mt-2 ${dark ? "bg-zinc-950" : "bg-white"} ${allPodcast.length > 0 ? "block" : "hidden"} rounded-lg md:rounded-xl py-4 px-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-5 md:gap-8 overflow-y-auto scroll-bar`}>
                        {allPodcast.length > 0 && allPodcast.map((item, index) => {
                            return <div key={index} className={`w-full sm:w-60 xl:w-72 h-48 rounded-lg shrink-0 flex justify-center items-center relative overflow-hidden`}>
                                <img src={item.imagePath} className={`w-full h-full z-10 object-cover rounded-lg`} />
                                <div className={`w-full h-full absolute top-0 z-20 flex flex-col md:flex-row justify-end md:justify-start items-end gap-3 px-5 pb-4`}>
                                    <span onClick={() => {
                                        window.open(item.link, '_blank');
                                    }} className={`p-2 hidden w-auto text-center md:flex justify-center items-center text-black bg-white rounded-full cursor-pointer text-[10px] active:opacity-70 duration-150 ease-in-out`}><FaPlay /></span>
                                    <span onClick={() => {
                                        window.open(item.link, '_blank');
                                    }} className={`p-2 w-full md:hidden text-center flex justify-center items-center text-black bg-white rounded-full cursor-pointer text-[12px] active:opacity-70 duration-150 gap-2 ease-in-out`}>Play <FaPlay /></span>
                                    <span onClick={() => {
                                        setReadMoreVisible(true);
                                        setCurrentPodcast(item)
                                        document.body.style.overflow = 'hidden'; // disable background scroll
                                    }} className={`px-3 w-full text-[12px] md:text-sm md:w-auto text-center py-1 md:py-2 text-black bg-white rounded-full flex justify-center items-center gap-2 cursor-pointer active:opacity-70 duration-150 ease-in-out`}>Read More <FaReadme /></span>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page

