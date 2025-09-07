'use client'

import Navbar from "@/components/Navbar"
import { useTheme } from "@/context/ThemeContext";
import { dummy } from "@/data/dummy";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"
import { GoogleGenAI } from "@google/genai";
import { IoMdClose } from "react-icons/io";
import { IoSparklesSharp } from "react-icons/io5";
import { toast } from "sonner";
import Markdown from 'react-markdown'

interface Chat {
  role: string,
  message: string
}

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}


function page() {

  const [verified, setVerified] = useState(false);
  const { dark } = useTheme()
  const pathname = usePathname();
  const [allChat, setAllChat] = useState<Chat[] | []>([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [allNews, setAllNews] = useState<Article[] | []>([]);

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
        }
      } catch (err) {
        console.log(err);
      }
    }

    verifyUser();
  }, []);

  const chat = async () => {
    if (!prompt) {
      toast.error("Enter question");
      return;
    }

    const msg = prompt;
    setPrompt("");

    const id = toast.loading("Getting your answer ...");

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
    setAllChat((prev) => [...prev, { role: 'you', message: msg }]);
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: msg,
        config: {
          systemInstruction: `you are a smart AI assistant of a website Moments for Mother Earth.
          This website deals with nature and environment related topics and news, make people aware of 
          conserving environment. Website features are 1. people can upload a podcast and also manage it 
          from the podcast section, write blogs from the blog section, host a new events in the events section, 
          and from the account section they can manage their account like : profile photo update, name and email 
          update and password change and also logout. Now your task is whenever any user ask you something about the \
          website of seek help, properly guide them.`
        }
      });

      console.log(res.text);
      setAllChat((prev) => [...prev, { role: 'ai', message: res.text as string }]);

    } catch (err) {
      toast.error("Something went wrong");
    }
    finally {
      toast.dismiss(id);
    }
  }

  useEffect(() => {
    const fetchNews = async () => {
      const api = process.env.NEXT_PUBLIC_NEWS_API_KEY as string;
      const url = `https://newsapi.org/v2/everything?q=nature&apiKey=${api}`

      try {
        const res = await axios.get(url);
        setAllNews(res.data.articles);
      } catch (err) {
        console.log(err);
      }
    }

    fetchNews();
  }, []);

  return (
    <>

      <div className={`w-full h-screen ${verified ? "hidden" : "block"} bg-black flex justify-center items-center overflow-hidden`}>
        <img src="/assets/loading.gif" />
      </div>

      <div className={`w-full h-screen px-5 ${verified ? "block" : "hidden"} ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center relative overflow-hidden`}>
        <Navbar path={pathname} />

        {/* chat button */}
        <div className={`w-[90%] ${chatVisible ? "hidden" : "block"} z-20 sm:w-[80%] md:w-[50%] lg:w-[30%] fixed bottom-5 md:bottom-10 rounded-full p-[2px] bg-gradient-to-r from-teal-500 via-fuchsia-600 to-orange-600 flex justify-center items-center`}>
          <p onClick={() => {
            setChatVisible(true);
          }} className={`w-full cursor-pointer active:scale-95 duration-150 ease-in-out text-center rounded-full ${dark ? "bg-black" : "bg-white"} py-3 text-fuchsia-800 font-bold font-montserrat text-sm`}>Chat with AI</p>
        </div>

        {/* chat box */}
        <div className={`w-full ${chatVisible ? "block" : "hidden"} h-screen z-30 fixed top-0 ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex justify-center items-center`}>
          <span onClick={() => {
            setChatVisible(false);
          }} className={`w-auto absolute top-24 md:top-28 md:left-10 text-xl left-5 p-2 rounded-full bg-white text-black shadow-2xl cursor-pointer`}><IoMdClose /></span>

          <div className={`w-full px-5 pb-10 pt-5 lg:pt-10 md:w-[70%] lg:w-[60%] h-[80%] lg:h-[60%] flex flex-col ${allChat.length === 0 ? "justify-center" : "justify-start"} items-center overflow-y-auto scroll-bar`}>
            {allChat.length > 0 && allChat.map((chat, index) => {
              return <div key={index} className={`w-full flex flex-col ${chat.role === 'ai' ? "items-start" : "items-end"} justify-center`}>
                <p className={`w-[80%] ${chat.role === 'ai' ? "text-start" : "text-end"} ${dark ? "text-white" : "text-black"} duration-150 ease-in-out font-semibold font-montserrat text-[12px] md:text-sm`}>{chat.role === 'ai' ? "Assistant" : "You"}</p>
                <p className={`w-[80%] ${chat.role === 'ai' ? "text-start pr-10" : "text-end pl-10"} ${dark ? "text-white" : "text-black"} duration-150 ease-in-out font-montserrat font-light text-sm md:text-lg`}>
                  <Markdown>{chat.message}</Markdown>
                </p>
              </div>
            })}
            <h1 className={`w-full text-center font-bold text-2xl md:text-4xl ${allChat.length === 0 ? "block" : "hidden"} ${dark ? "text-white" : "text-black"} duration-150 ease-in-out opacity-30`}>Got stuck ? Chat with our AI assistant</h1>
          </div>

          <div className={`w-full z-30 md:w-[70%] lg:w-[60%] px-4 py-2 flex justify-center items-center absolute bottom-5`}>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`w-full h-28 rounded-lg px-3 py-3 outline-none ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out`} placeholder="Ask your question" />
            <span onClick={chat} className={`absolute cursor-pointer active:opacity-80 duration-150 ease-in-out bottom-6 right-8 bg-gradient-to-r from-yellow-500 via-teal-600 to-green-600 text-white rounded-md text-xl p-2`}><IoSparklesSharp /></span>
          </div>
        </div>

        <div className={`w-full h-auto flex flex-col justify-start items-center pt-24 md:pt-28 overflow-y-auto scroll-bar`}>
          <h1 className={`w-full text-center font-genos text-3xl px-5 ${dark ? "text-white" : "text-black"} duration-150 ease-in-out lg:pb-10`}>Explore what's happening around the world</h1>

          <div className={`w-full z-10 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center overflow-y-auto scroll-bar gap-4 pb-10`}>
            {allNews.map((news, index) => {
              return <div key={index} className={`w-full cursor-pointer hover:shadow-2xl rounded-lg ${dark ? "bg-zinc-700" : "bg-gray-200"} duration-150 ease-in-out h-auto flex flex-col justify-start items-center pt-[2px] px-[2px] pb-5`}>
                <div onClick={() => {
                  window.open(news.url, '_blank')
                }} className={`w-full h-40 rounded-lg overflow-hidden`}>
                  <img src={news.urlToImage} className={`h-full w-full rounded-lg object-cover`} />
                </div>
                <p className={`w-full px-3 mt-2 text-sm font-semibold font-montserrat ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{news.title}</p>
                <p className={`w-full px-3 mt-2 text-sm font-montserrat ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>Source : {news.source.name}</p>
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default page
