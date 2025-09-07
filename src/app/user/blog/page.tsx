'use client'

import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosSearch } from "react-icons/io";
import { RiExpandUpDownFill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { format } from "date-fns";
import { IoMdCloudUpload } from "react-icons/io";
import { toast } from "sonner";
import { supabase } from "@/config/supabase";
import { v4 } from 'uuid';

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
    userName: string
}

interface SavedBlog {
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
    savedBy: string
}

function page() {

    const path = usePathname();
    const router = useRouter();
    const { dark } = useTheme();
    const [allBlogs, setAllBlogs] = useState<Blog[] | []>([]);
    const [savedBlogs, setSavedBlogs] = useState<SavedBlog[] | []>([]);
    const [filtered, setFiltered] = useState<Blog[] | []>([]);
    const [name, setName] = useState<string | null | undefined>('');
    const [email, setEmail] = useState<string | null | undefined>('');
    const [userData, setUserData] = useState<User | null>(null);
    const [verified, setVerified] = useState(false);
    const [option, setOption] = useState('all');
    const [loadingMessage, setLoadingMessage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const[searchInput, setSearchInput] = useState('');
    const [medium, setMedium] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [createVisible, setCreateVisible] = useState(false);

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

    const search = () => {
        if(!searchInput){
            toast.error("Enter search query");
            return;
        }

        const found = allBlogs.filter((blog) => {
            return blog.title.includes(searchInput) || blog.content.includes(searchInput)
        });

        setFiltered(found);
        setOption('results');
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`/api/user-blog?id=all`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setAllBlogs(res.data?.found);
                }

            } catch (err: any) {
                if (err?.response && err?.response?.data?.message) {
                    toast.error(err.response.data.message);
                }
                else {
                    toast.error("Error fetching blogs");
                }
            }
        }

        fetchBlogs();

        const fetchSavedBlogs = async () => {
            try {
                const res = await axios.get(`/api/user-blog?id=saved`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setSavedBlogs(res.data?.found);
                }

            } catch (err: any) {
                if (err?.response && err?.response?.data?.message) {
                    toast.error(err.response.data.message);
                }
                else {
                    toast.error("Error fetching blogs");
                }
            }
        }

        fetchSavedBlogs();
    }, []);

    useEffect(() => {

        if (option === 'your') {
            const filter = allBlogs.filter((blog) => {
                return blog.userEmail === email
            });

            setFiltered(filter);
        }
    }, [option]);

    const createPost = async () => {

        if (loadingMessage) {
            toast.error("PLease wait ...");
            return;
        }

        if (title.length > 70) {
            toast.error("Title limit exceeded");
            return;
        }

        if (!title || !content) {
            toast.error("Title and content required");
            return;
        }

        if (!image) {
            toast.error("Image is required");
            return;
        }

        setLoadingMessage("Creating ...");

        try {
            const { data, error } = await supabase
                .storage
                .from('user_blog_images')
                .upload(`public/${image?.name}-${Date.now().toString()}`, image, {
                });

            if (error) {
                toast.error("Error uploading image");
                setLoadingMessage("");
                return;
            }
            const path = data?.path;
            const Id = v4();

            const { data: dt } = supabase
                .storage
                .from('user_blog_images')
                .getPublicUrl(path)

            const res = await axios.post(`/api/user-blog`, {
                title: title.trim(), content: content.trim(), linkedIn: linkedIn.trim(),
                medium: medium.trim(), publishedOn: format(Date.now(), "do MMMM yyyy"), imagePath: dt?.publicUrl,
                storedPath: path, uid: Id, name, type: 'blog'
            }, {
                withCredentials: true
            });

            if (res.status === 200) {
                toast.success("Blog Created");
                setLoadingMessage("");
                setTitle("");
                setContent("");
                setLinkedIn("");
                setMedium("");
                setCreateVisible(false);
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

    const removeFromSaved = async (blogData: SavedBlog) => {
        try {
            const res = await axios.delete(`/api/user-blog?savedBy=${blogData.savedBy}&uniqueId=${blogData.uniqueId}&path=${blogData.storedPath}&type=saved`, {
                withCredentials: true
            });

            if (res.status === 200) {
                toast.success("Removed");
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
    }

    const deleteBlog = async (blogData: Blog) => {
        try {
            const res = await axios.delete(`/api/user-blog?uniqueId=${blogData.uniqueId}&path=${blogData.storedPath}&type=blog`, {
                withCredentials: true
            });

            if (res.status === 200) {
                toast.success("Blog Deleted");
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
    }

    return (
        <>
            <div className={`w-full h-screen ${verified ? "hidden" : "block"} bg-black flex justify-center items-center overflow-hidden`}>
                <img src="/assets/loading.gif" />
            </div>

            <div className={`w-full h-screen z-30 flex flex-col justify-start items-center relative overflow-hidden ${verified ? "block" : "hidden"} ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out`}>
                <Navbar path={path} />

                {/* create box */}
                <div className={`${createVisible ? "opacity-100 scale-100" : "scale-0 opacity-0"} duration-500 ease-in-out w-full h-full backdrop-blur-3xl ${dark ? "bg-black/20" : "bg-white/20"} pb-10 px-5 md:px-10 duration-150 ease-in-out pt-28 md:pt-36 flex flex-col justify-start items-center absolute z-30`}>
                    <p className={`w-full text-center ${dark ? "text-white" : "text-black"} duration-150 ease-in-out font-cinzel font-semibold text-lg md:text-2xl`}>Write your experience</p>

                    <div className={`w-full h-full mt-5 flex flex-col justify-start items-center md:flex-row md:items-start pb-5`}>
                        <div className={`w-[80%] md:w-1/2 border-2 md:h-1/2 border-dotted border-zinc-600 mt-3 rounded-lg relative py-5 flex flex-col justify-center items-center gap-3 overflow-hidden`}>
                            <span className={`w-auto ${image ? "hidden" : "block"} px-4 py-2 rounded-full text-white bg-gradient-to-r from-teal-400 to-green-600 flex justify-center items-center gap-3`}>Upload Image <IoMdCloudUpload /></span>
                            <input onChange={(e) => {
                                if (e && e?.target?.files) {
                                    const img = e.target.files[0];
                                    if (!img.type.startsWith('image')) {
                                        toast.error("Invalid format");
                                        return;
                                    }

                                    setImage(img);
                                }
                            }} type="file" className={`w-full text-3xl opacity-0 absolute text-black mx-auto`} />
                            <span className={`w-auto text-center text-[12px] md:text-sm ${dark ? "text-white" : "text-black"} ${image !== null ? "block" : "hidden"} font-dhyana duration-150 ease-in-out`}>{image?.name}</span>
                            <span onClick={() => { setImage(null) }} className={`w-auto ${image ? "block" : "hidden"} px-4 py-2 mt-2 rounded-full text-white bg-gradient-to-r from-red-400 to-red-600 flex justify-center items-center gap-3`}>Remove Image </span>
                        </div>

                        <div className={`w-full mt-4 md:mt-0 md:w-1/2 bg-transparent rounded-lg h-auto md:h-full px-2 md:px-5 py-5 flex flex-col justify-start items-center gap-4 overflow-y-auto scroll-bar`}>
                            <input onChange={(e) => setTitle(e.target.value)} type="text" className={`w-full py-3 px-3 outline-none rounded-md ${dark ? "bg-zinc-700 text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"} duration-150 ease-in-out`} placeholder="Enter Title* (Max 70 characters)" />
                            <textarea onChange={(e) => setContent(e.target.value)} className={`w-full py-3 px-3 h-48 outline-none rounded-md ${dark ? "bg-zinc-700 text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"} duration-150 ease-in-out`} placeholder="Write your content*" />
                            <input type="text" className={`w-full py-3 px-3 outline-none rounded-md ${dark ? "bg-zinc-700 text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"} duration-150 ease-in-out`} placeholder="LinkedIn URL (Optional)" />
                            <input type="text" className={`w-full py-3 px-3 outline-none rounded-md ${dark ? "bg-zinc-700 text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"} duration-150 ease-in-out`} placeholder="Medium URL (Optional)" />
                            <p onClick={createPost} className={`w-full py-2 text-center mt-2 ${dark ? "bg-white text-black" : "bg-black text-white"} font-montserrat font-semibold rounded-md duration-150 ease-in-out cursor-pointer active:opacity-70`}>{loadingMessage ? (<><span>{loadingMessage}</span><span className="ml-2 loading loading-spinner loading-sm"></span></>) : ("Create")}</p>
                            <p onClick={() => { setCreateVisible(false) }} className={`w-full py-2 text-center font-montserrat font-semibold cursor-pointer text-red-600`}>Cancel</p>
                        </div>
                    </div>
                </div>

                <div className={`w-full z-20 px-3 h-full ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center overflow-y-auto scroll-bar`}>

                    <p onClick={() => { setCreateVisible(true) }} className={`w-auto px-4 py-2 rounded-full md:hidden fixed bottom-10 right-5 bg-gradient-to-r from-blue-500 to-blue-800 text-white text-[12px] md:text-sm cursor-pointer flex justify-center items-center gap-3 z-30`}>Create <CiEdit /></p>

                    {/* search bar */}
                    <div className={`w-full md:w-[70%] xl:w-[60%] mt-24 md:mt-32 h-auto flex justify-between items-center gap-2`}>
                        <div className={`w-full flex justify-center items-center relative`}>
                            <input onChange={(e) => setSearchInput(e.target.value)} type="text" className={`w-full py-3 px-3 pr-8 ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} rounded-full outline-none font-dhyana text-sm`} placeholder="Enter search term" />
                            <span onClick={search} className={`w-auto absolute cursor-pointer right-5 top-1/2 ${dark ? "text-white" : "text-green-600"} text-xl -translate-y-1/2`}><IoIosSearch /></span>
                        </div>
                        {/* <span className={`w-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-md md:hidden flex justify-center items-center cursor-pointer text-white active:opacity-80 duration-150 ease-in-out py-3 px-2`}><RiExpandUpDownFill /></span>
                        <span className={`w-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-md md:flex justify-center items-center cursor-pointer text-white active:opacity-80 duration-150 ease-in-out py-2 px-4 gap-2 hidden`}>Filter <RiExpandUpDownFill /></span> */}
                    </div>

                    {/* filters */}
                    {/* <div className={`w-full  md:w-[70%] xl:w-[60%] mt-4 flex justify-center items-center overflow-x-auto scroll-bar gap-3`}>
                        <span className={`${dark ? "text-white bg-zinc-900" : "text-black bg-gray-100"} cursor-pointer active:opacity-75 text-[10px] md:text-sm rounded-md px-3 py-2 duration-150 ease-in-out`}>Oldest</span>
                        <span className={`${dark ? "text-white bg-zinc-900" : "text-black bg-gray-100"} cursor-pointer active:opacity-75 text-[10px] md:text-sm rounded-md px-3 py-2 duration-150 ease-in-out`}>Newest</span>
                    </div> */}

                    <div className={`mt-5 w-full md:w-[70%] xl:w-[60%] h-auto flex justify-start items-center gap-4`}>
                        <span onClick={() => setOption('all')} className={`w-auto px-4 ${option === 'all' ? "border-b-blue-600" : "border-b-transparent"} py-2 rounded-md ${dark ? "text-white bg-zinc-900" : "text-black bg-gray-100"} border-b-2 duration-150 ease-in-out cursor-pointer`}>All</span>
                        <span onClick={() => setOption('saved')} className={`w-auto px-4 ${option === 'saved' ? "border-b-blue-600" : "border-b-transparent"} py-2 rounded-md ${dark ? "text-white bg-zinc-900" : "text-black bg-gray-100"} border-b-2 duration-150 ease-in-out cursor-pointer`}>Saved Blog</span>
                        <span onClick={() => setOption('your')} className={`w-auto px-4 ${option === 'your' ? "border-b-blue-600" : "border-b-transparent"} py-2 rounded-md ${dark ? "text-white bg-zinc-900" : "text-black bg-gray-100"} border-b-2 duration-150 ease-in-out cursor-pointer`}>My Posts</span>
                        <span onClick={() => { setCreateVisible(true) }} className={`w-auto px-4 py-2 hidden md:flex justify-center items-center gap-3 text-sm bg-gradient-to-r from-blue-500 to-blue-800 text-white cursor-pointer active:opacity-80 duration-150 ease-in-out rounded-md`}>Create <CiEdit /></span>
                    </div>

                    {option === 'all' && <div className={`w-full ${allBlogs.length > 9 ? "block" : "hidden"} z-20 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 px-2 md:px-5 xl:px-10 py-4`}>
                        
                        <p className={`w-full text-start font-montserrat ${dark ? "text-white" : "text-black"} font-semibold text-lg md:text-xl`}>Latest This Week</p>
                        {allBlogs && allBlogs.length > 9 && allBlogs.slice(0, 7).map((item, index) => {
                            return <div onClick={() => {
                                router.push(`/user/blog/${item.uniqueId}`)
                            }} key={index} className={`w-full h-56 sm:h-60 md:h-64 lg:h-72 rounded-xl flex flex-col justify-start items-center gap-4 ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out md:rounded-2xl cursor-pointer relative overflow-hidden pt-1 px-1 pb-4`}>
                                <img src={item.imagePath} className={`w-full h-[70%] object-cover rounded-lg md:rounded-2xl`} />
                                <p className={`w-full px-3 font-dhyana text-start text-[10px] sm:text-[12px] md:text-sm`}>{item.title}</p>
                            </div>
                        })}
                    </div>}

                    {option === 'all' && <div className={`w-full ${allBlogs.length > 0 ? "block" : "hidden"} z-20 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 px-2 md:px-5 xl:px-10 py-4`}>
                        
                        <p className={`w-full text-start font-montserrat ${dark ? "text-white" : "text-black"} font-semibold text-lg md:text-xl`}>All</p>
                        {allBlogs && allBlogs.length > 0 && allBlogs.map((item, index) => {
                            return <div onClick={() => {
                                router.push(`/user/blog/${item.uniqueId}`)
                            }} key={index} className={`w-full h-56 sm:h-60 md:h-64 lg:h-72 rounded-xl flex flex-col justify-start items-center gap-4 ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out md:rounded-2xl cursor-pointer relative overflow-hidden pt-1 px-1 pb-4`}>
                                <img src={item.imagePath} className={`w-full h-[70%] object-cover rounded-lg md:rounded-2xl`} />
                                <p className={`w-full px-3 font-dhyana text-start text-[10px] sm:text-[12px] md:text-sm`}>{item.title}</p>
                            </div>
                        })}
                    </div>}

                    {option === 'your' && <div className={`w-full z-20 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 px-2 md:px-5 xl:px-10 py-4`}>
                        
                        <p className={`w-full text-start font-montserrat ${dark ? "text-white" : "text-black"} font-semibold text-lg md:text-xl`}>Your Posts</p>

                        {filtered && filtered.length > 0 && filtered.map((item, index) => {
                            return <div key={index} className={`w-full h-56 sm:h-60 md:h-64 lg:h-72 rounded-xl flex flex-col justify-start items-center gap-4 ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out md:rounded-2xl cursor-pointer relative overflow-hidden pt-1 px-1 pb-4`}>
                                <img onClick={() => {
                                    router.push(`/user/blog/${item.uniqueId}`)
                                }} src={item.imagePath} className={`w-full h-[60%] object-cover rounded-lg md:rounded-2xl`} />
                                <p className={`w-full px-3 font-dhyana text-start text-[10px] sm:text-[12px] md:text-sm`}>{item.title}</p>
                                <p onClick={() => { deleteBlog(item) }} className={`w-full text-center px-3 py-2 cursor-pointer font-dhyana font-semibold bg-red-500 text-white rounded-full text-[10px] sm:text-[12px] md:text-sm`}>Delete</p>

                            </div>
                        })}
                    </div>}

                    {option === 'saved' && <div className={`w-full z-20 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 px-2 md:px-5 xl:px-10 py-4`}>
                        
                        <p className={`w-full text-start font-montserrat ${dark ? "text-white" : "text-black"} font-semibold text-lg md:text-xl`}>Saved Blogs</p>

                        {savedBlogs && savedBlogs.length > 0 && savedBlogs.map((item, index) => {
                            return <div key={index} className={`w-full h-56 sm:h-60 md:h-64 lg:h-72 rounded-xl flex flex-col justify-start items-center gap-4 ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out md:rounded-2xl cursor-pointer relative overflow-hidden pt-1 px-1 pb-4`}>
                                <img onClick={() => {
                                    router.push(`/user/blog/${item.uniqueId}`)
                                }} src={item.imagePath} className={`w-full h-[60%] object-cover rounded-lg md:rounded-2xl`} />
                                <p className={`w-full px-3 font-dhyana text-start text-[10px] sm:text-[12px] md:text-sm`}>{item.title}</p>
                                <p onClick={() => { removeFromSaved(item) }} className={`w-full text-center px-3 py-2 cursor-pointer font-dhyana font-semibold bg-red-500 text-white rounded-full text-[10px] sm:text-[12px] md:text-sm`}>Remove from saved</p>
                            </div>
                        })}
                    </div>}

                    {option === 'results' && <div className={`w-full z-20 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 px-2 md:px-5 xl:px-10 py-4`}>
                        
                        <p className={`w-full text-start font-montserrat ${dark ? "text-white" : "text-black"} font-semibold text-lg md:text-xl`}>Results for "{searchInput}"</p>

                        {filtered && filtered.length > 0 && filtered.map((item, index) => {
                            return <div key={index} className={`w-full h-56 sm:h-60 md:h-64 lg:h-72 rounded-xl flex flex-col justify-start items-center gap-4 ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out md:rounded-2xl cursor-pointer relative overflow-hidden pt-1 px-1 pb-4`}>
                                <img onClick={() => {
                                    router.push(`/user/blog/${item.uniqueId}`)
                                }} src={item.imagePath} className={`w-full h-[60%] object-cover rounded-lg md:rounded-2xl`} />
                                <p className={`w-full px-3 font-dhyana text-start text-[10px] sm:text-[12px] md:text-sm`}>{item.title}</p>
                            </div>
                        })}
                    </div>}

                </div>
            </div>
        </>
    )
}

export default page
