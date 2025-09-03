'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

function page() {

    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [enteredOTP, setEnteredOTP] = useState<string | null>(null);
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [contact, setContact] = useState('');
    const [visible, setVisible] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const sendOTP = async () => {
        if (!name || !email || !contact || !password || !confirm) {
            toast.error("All fields are required");
            return;
        }

        if (password.length < 7) {
            toast.error("Password length : minimum 8");
            return;
        }

        if (password !== confirm) {
            toast.error("Password and confirm password must match");
            return;
        }

        if (!email.includes('@gmail.com') && !email.includes("@outlook.com")) {
            toast.error("Enter valid email");
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOTP(otp);

        try {
            setLoadingMessage("Requesting ...")
            const res = await axios.post(`/api/user-auth`, {
                name: name.trim(), email: email.trim(), otp, type: 'otp'
            });

            //console.log(res.data);
            if (res.status === 200) {
                toast.success("OTP sent on email");
                setOtpSent(true);
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

    const createAccount = async () => {
        if (!enteredOTP) {
            toast.error("Enter otp");
            return;
        }

        if (enteredOTP !== generatedOTP) {
            toast.error("Invalid OTP");
            return;
        }

        try {
            setLoadingMessage('Creating ...')
            const res = await axios.post(`/api/user-auth`, {
                name: name.trim(), email: email.trim(), contact: contact.trim(), password: password.trim(), date: format(Date.now(), "do MMMM yyyy"), type: 'register'
            });
            //console.log(res.data);
            if(res.status === 200){
                router.push('/auth/login');
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

    return (
        <>
            <div className={`w-full h-auto flex flex-col justify-start items-center relative overflow-hidden`}>
                <Link href='/' className={`w-auto cursor-pointer absolute top-5 md:top-10 left-5 md:left-8 text-sm flex justify-center items-center gap-2 bg-white text-black px-2 py-1 md:py-2 rounded-full`}><MdOutlineArrowBackIosNew /> Go Back</Link>

                <div className={`w-full h-screen flex flex-col md:flex-row justify-start items-center md:py-3 md:px-3`}>
                    <div className={`h-full w-full md:w-1/2 overflow-hidden md:rounded-xl`}>
                        <img src="/assets/signup.jpg" className={`h-full w-full object-cover`} />
                    </div>

                    <div className={`w-full ${otpSent ? "hidden" : "block"} px-5 sm:px-14 md:px-20 md:w-1/2 h-[65vh] sm:h-[55vh] md:h-auto pt-5 absolute md:static overflow-y-auto scroll-bar flex flex-col justify-start items-center bg-white bottom-0 rounded-t-[180px] md:rounded-none sm:rounded-t-[250px]`}>
                        <h1 className={`w-full px-10 text-center font-genos text-2xl md:text-4xl pt-10`}>Create a new account</h1>

                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className={`w-full font-montserrat outline-none mt-8 py-4 border-b-[2px] border-b-[#4a8808]`} placeholder="Enter fulll name*" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className={`w-full font-montserrat outline-none py-4 border-b-[2px] border-b-[#4a8808]`} placeholder="Enter email address*" />
                        <input value={contact} onChange={(e) => setContact(e.target.value)} type="text" className={`w-full font-montserrat outline-none py-4 border-b-[2px] border-b-[#4a8808]`} placeholder="Enter contact number*" />
                        <div className={`w-full flex flex-col justify-center items-center gap-2 relative`}>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type={visible ? "text" : "password"} className={`w-full font-montserrat outline-none py-4 border-b-[2px] border-b-[#4a8808]`} placeholder="Set a password*" />
                            <span onClick={() => setVisible(!visible)} className={`absolute top-1/2 right-5 opacity-50 cursor-pointer`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                        <div className={`w-full flex flex-col justify-center items-center gap-2 relative`}>
                            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type={visible ? "text" : "password"} className={`w-full font-montserrat outline-none py-4 border-b-[2px] border-b-[#4a8808]`} placeholder="Confirm password*" />
                            <span onClick={() => setVisible(!visible)} className={`absolute top-1/2 right-5 opacity-50 cursor-pointer`}>{visible ? <FaEye /> : <FaEyeSlash />}</span>
                        </div>
                        <p onClick={sendOTP} className={`w-full mt-4 rounded-lg py-2 text-center font-montserrat bg-gradient-to-r from-teal-400 via-green-500 to-green-700 text-white cursor-pointer hover:opacity-75 duration-200 ease-in-out`}>{loadingMessage ? loadingMessage : "Request OTP"}</p>
                    </div>

                    <div className={`w-full ${otpSent ? "block" : "hidden"} px-5 sm:px-14 md:px-20 md:w-1/2 h-[65vh] sm:h-[55vh] pt-5 absolute md:static overflow-y-auto scroll-bar flex flex-col justify-start items-center bg-white bottom-0 rounded-t-[180px] md:rounded-none sm:rounded-t-[250px]`}>
                        <h1 className={`w-full px-10 text-center font-genos text-2xl md:text-4xl pt-10`}>Create a new account</h1>

                        <input value={enteredOTP ? enteredOTP : ""} onChange={(e) => setEnteredOTP(e.target.value)} type="text" className={`w-full font-montserrat mt-8 outline-none py-4 border-b-[2px] border-b-[#4a8808]`} placeholder="Enter otp" />
                        <p onClick={createAccount} className={`w-full rounded-lg mt-4 py-2 text-center font-montserrat bg-gradient-to-r from-teal-400 via-green-500 to-green-700 text-white cursor-pointer hover:opacity-75 duration-200 ease-in-out`}>{loadingMessage ? loadingMessage : "Create Account"}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
