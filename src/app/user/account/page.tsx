'use client'

import Navbar from "@/components/Navbar"
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/data/colors";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { MdPublishedWithChanges } from "react-icons/md";
import { toast } from "sonner";
import { ImShrink2 } from "react-icons/im";
import { supabase } from "@/config/supabase";

interface User {
    name: string,
    password: string,
    email: string,
    profilePhoto?: string | null | undefined,
    id: string,
    dateCreated: string
}

function page() {

    const [verified, setVerified] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const [name, setName] = useState<string | null | undefined>('');
    const [email, setEmail] = useState<string | null | undefined>('');
    const [randomColor, setRandomColor] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const { dark } = useTheme()
    const [imageBoxVisible, setImageBoxVisible] = useState(false);
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

    useEffect(() => {
        const random = Math.floor(Math.random() * 5);
        setRandomColor(colors[random]);
    }, []);

    const updateProfile = async () => {

        if (loadingMessage) {
            toast.error("PLease wait ...");
            return;
        }

        if (!name || !email) {
            toast.error("Empty fields not allowed");
            return;
        }

        if (!(email.includes('@gmail.com')) && !(email.includes('@outlook.com'))) {
            toast.error("Enter valid email");
            return;
        }

        try {
            setLoadingMessage("Updating ...");
            const res = await axios.put(`/api/user-account`, {
                name, newEmail: email.trim(), type: 'profile'
            }, {
                withCredentials: true
            });

            //console.log(res.data);
            if (res.status === 200) {
                toast.success("Profile Updated");
                setLoadingMessage('');
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
            setLoadingMessage('');
        }
    }

    const updatePassword = async () => {

        if (passwordMessage) {
            toast.error("PLease wait ...");
            return;
        }

        if (!password || !newPassword) {
            toast.error("Empty fields not allowed");
            return;
        }

        if (newPassword.length < 7) {
            toast.error("New password length : minimum 8");
            return;
        }

        try {
            setPasswordMessage("Changing ...");
            const res = await axios.put(`/api/user-account`, {
                oldPassword: password.trim(), newPassword: newPassword.trim(), type: 'password'
            }, {
                withCredentials: true
            });

            //console.log(res.data);
            if (res.status === 200) {
                setPasswordMessage('');
                toast.success("Password Changed");
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
            setPasswordMessage('');
        }
    }

    useEffect(() => {
        if (imageBoxVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // cleanup on unmount
        };
    }, [imageBoxVisible]);

    const uploadImage = async () => {

        if(uploading){
            toast.error("Please wait ...");
            return;
        }

        if (!image) {
            toast.error("Select image");
            return;
        }

        const id = toast.loading("Uploading ...");
        try {
            setUploading(true);
            const { data, error } = await supabase
                .storage
                .from('user_photo')
                .upload(`public/${image.name}-${Date.now().toString()}`, image, {
                });

            if (error) {
                toast.error("Error uploading image");
                return;
            }
            const path = data?.path;

            const { data: dt } = supabase
                .storage
                .from('user_photo')
                .getPublicUrl(path)

            const res = await axios.put('/api/user-account', {
                photo: dt.publicUrl, type: 'image', path: path
            }, {
                withCredentials: true
            });

            console.log(res.data);

            if (res.status === 200) {
                toast.dismiss(id);
                toast.success("Profile Photo Updated");
                setImage(null);
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
        finally {
            toast.dismiss(id);
            setImageBoxVisible(false);
            setUploading(false);
        }
    }

    const removePhoto = async () => {
        const path = userData?.profilePhoto?.split('user_photo/')[1] as string;

        const id = toast.loading("Removing ...");
        try {
            const { data, error } = await supabase
                .storage
                .from('user_photo')
                .remove([path])

            if (!error) {
                const res = await axios.delete(`/api/user-account`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    toast.success("Profile photo removed");
                    toast.dismiss(id);
                    router.refresh();
                }
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

    const logout = async () => {
        try {
            const res = await axios.post(`/api/user-account`, {}, {
                withCredentials: true
            });

            if (res.status === 201) {
                router.push('/');
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    }

    return (
        <>

            <div className={`w-full h-screen ${verified ? "hidden" : "block"} bg-black flex justify-center items-center overflow-hidden`}>
                <img src="/assets/loading.gif" />
            </div>

            <div className={`w-full z-20 pb-10 h-auto ${verified ? "block" : "hidden"} ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center relative overflow-hidden`}>
                <Navbar path={pathname} />

                {/* image box */}
                <div className={`w-full px-5 ${imageBoxVisible ? "opacity-100 scale-100 z-50" : "opaciy-0 scale-0 z-20"} duration-300 ease-in-out flex justify-center items-center h-screen rounded-lg top-0 overflow-hidden bg-black/10 backdrop-blur-3xl absolute`}>
                    <div className={`w-full z-50 flex flex-col justify-start items-center`}>
                        <span onClick={() => setImageBoxVisible(!imageBoxVisible)} className={`absolute top-5 right-5 ${dark ? "bg-white text-black" : "bg-black text-white"} p-3 text-[12px] md:text-sm rounded-full cursor-pointer`}><ImShrink2 /></span>
                        <p className={`w-auto text-center bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer active:bg-blue-900 duration-150 ease-in-out font-montserrat text-sm ${image === null ? "block" : "hidden"}`}>Choose Picture</p>
                        <input onChange={(e) => {
                            if (e && e?.target?.files) {
                                const img = e.target.files[0];
                                if (img.type.startsWith('image')) {
                                    setImage(img);
                                }
                                else {
                                    toast.error("Invalid format");
                                    return;
                                }
                            }
                        }} type="file" className={`cursor-pointer absolute opacity-0 left-1/2 -translate-x-1/2 text-3xl`} />
                        <p className={`w-auto text-center ${dark ? "text-white" : "text-black"} mt-2 italic duration-150 ease-in-out font-montserrat text-sm ${image ? "block" : "hidden"}`}>{image?.name}</p>
                        <p onClick={uploadImage} className={`w-auto text-center mt-2 bg-gradient-to-r from-teal-400 to-green-700 text-white px-4 py-2 rounded-md cursor-pointer active:bg-green-800 duration-150 ease-in-out font-montserrat text-sm ${image ? "block" : "hidden"}`}>Upload</p>
                        <p onClick={() => setImage(null)} className={`w-auto text-center font-bold mt-2 text-red-500 px-4 py-2 cursor-pointer font-montserrat text-sm ${image ? "block" : "hidden"}`}>Remove Picture</p>
                    </div>
                </div>

                <div className={`w-full min-h-screen ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center relative mt-24`}>
                    <h1 className={`w-full text-center font-cinzel text-xl md:text-3xl ${dark ? "text-white" : "text-black"} duration-150 ease-in-out py-5 font-semibold`}>Manage Your Account</h1>

                    <div className={`w-full flex flex-col justify-start items-center py-3 px-3`}>
                        <div className={`h-20 ${userData?.profilePhoto ? "block" : "hidden"} w-20 rounded-full bg-gray-200 overflow-hidden`}>
                            <img src={userData?.profilePhoto ? userData?.profilePhoto : "/img"} className={`w-full h-full object-cover`} />
                        </div>

                        <div className={`h-20 w-20 ${randomColor} ${userData?.profilePhoto ? "hidden" : "block"} rounded-full flex justify-center items-center overflow-hidden`}>
                            <span className={`text-white text-3xl font-bold`}>{userData?.name[0]}</span>
                        </div>

                        <p onClick={() => setImageBoxVisible(!imageBoxVisible)} className={`w-auto text-center ${dark ? "text-white" : "text-black"} cursor-pointer italic font-[10px] md:text-sm mt-2 font-dhyana`}>Change Picture</p>
                        <p onClick={removePhoto} className={`w-auto text-center text-red-600 cursor-pointer font-[10px] md:text-sm mt-2 font-dhyana ${userData?.profilePhoto ? "block" : "hidden"}`}>Remove Picture</p>
                    </div>

                    <div className={`w-full md:w-[60%] lg:w-[50%] flex flex-col justify-start items-center py-5 px-5 md:px-10 gap-4`}>
                        <input onChange={(e) => setName(e.target.value)} type="text" className={`${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} w-full outline-none rounded-md px-3 py-2 duration-150 font-dhyana ease-in-out`} value={name || ""} placeholder="Enter name" />
                        <input onChange={(e) => setEmail(e.target.value)} type="text" className={`${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} w-full outline-none rounded-md px-3 py-2 duration-150 font-dhyana ease-in-out`} value={email || ""} placeholder="Enter email" />
                        <p onClick={updateProfile} className={`w-full py-2 text-center font-montserrat font-semibold cursor-pointer active:opacity-70 duration-150 rounded-md ease-in-out bg-gradient-to-r from-teal-300 via-green-400 to-green-700 text-white flex justify-center items-center gap-2`}>{loadingMessage ? loadingMessage : "Update Profile"} <MdPublishedWithChanges className={`${loadingMessage ? "hidden" : "block"}`} /></p>
                    </div>

                    <div className={`w-full mt-4 md:w-[60%] lg:w-[50%] flex flex-col justify-start items-center py-5 px-5 md:px-10 gap-4`}>
                        <div className={`w-full flex flex-col justify-center items-center gap-2 relative`}>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full font-montserrat outline-none ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} px-3 py-2 duration-150 ease-in-out rounded-md`} placeholder="old password*" />
                            <span onClick={() => setVisible(!visible)} className={`absolute top-1/2 -translate-y-1/2 right-5 opacity-50 ${dark ? "text-white" : "text-black"} cursor-pointer`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                        <div className={`w-full flex flex-col justify-center items-center gap-2 relative`}>
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full font-montserrat outline-none ${dark ? "bg-zinc-800 text-white" : "bg-gray-200 text-black"} px-3 py-2 duration-150 ease-in-out rounded-md`} placeholder="new password*" />
                            <span onClick={() => setVisible(!visible)} className={`absolute top-1/2 -translate-y-1/2 right-5 opacity-50 ${dark ? "text-white" : "text-black"} cursor-pointer`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                        <p onClick={updatePassword} className={`w-full py-2 text-center font-montserrat font-semibold cursor-pointer active:opacity-70 duration-150 rounded-md ease-in-out bg-gradient-to-r from-teal-300 via-green-400 to-green-700 text-white flex justify-center items-center gap-2`}>{passwordMessage ? passwordMessage : "Change Password"} <MdPublishedWithChanges className={`${passwordMessage ? "hidden" : "block"}`} /></p>
                    </div>

                    <p onClick={logout} className={`w-auto text-center cursor-pointer py-5 mt-5 text-red-500 font-dhyana text-sm xl:text-lg font-semibold`}>Logout</p>
                    <p className={`w-full text-center opacity-60 ${dark ? "text-white" : "text-black"} text-[10px] md:text-sm mt-2 font-dhyana`}>Account created on : {userData?.dateCreated}</p>
                </div>
            </div>
        </>
    )
}

export default page
