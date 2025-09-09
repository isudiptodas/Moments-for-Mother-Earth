'use client'

import { PiPlantLight } from "react-icons/pi";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"
import { faq } from "@/data/faq";
import { PlusIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

function page() {
  return (
    <>
      <div className={`w-full h-auto overflow-hidden flex flex-col justify-start items-center bg-white relative scroll-bar`}>

        {/* hero section */}
        <div className={`w-full h-screen flex flex-col justify-start items-center relative overflow-hidden scroll-bar rounded-b-3xl`}>
          <img src="/assets/mobile-landing.jpg" className={`w-full h-full md:hidden object-cover`} />
          <img src="/assets/laptop-landing.jpg" className={`w-full h-full hidden md:block object-cover`} />

          <div className={`w-full h-full absolute z-20 bg-black opacity-10`}></div>
          <div className="absolute bottom-0 px-5 w-full h-[50%] z-30 flex flex-col justify-center items-center">
            <div className={`
              absolute inset-0 
              backdrop-blur-3xl bg-white/20 
              [mask-image:linear-gradient(to_top,black,transparent)]
              [-webkit-mask-image:linear-gradient(to_top,black,transparent)]
              `}>
            </div>
            <h1 className="w-full motion-scale-in-[0.5] motion-rotate-in-[-10deg] motion-blur-in-[10px] motion-delay-[0.75s]/rotate motion-delay-[0.75s]/blur text-center font-cinzel z-40 text-xl md:text-2xl xl:text-3xl text-white font-semibold">Join a global community dedicated to caring for our planet,</h1>
            <h1 className="w-full motion-scale-in-[0.5] motion-rotate-in-[-10deg] motion-blur-in-[10px] motion-delay-[0.75s]/rotate motion-delay-[0.75s]/blur text-center font-cinzel z-40 text-xl md:text-2xl xl:text-3xl text-white font-semibold">one moment at a time</h1>
            <div className={`w-[80%] motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate md:w-[50%] border-t-2 border-white pt-4 z-40 md:hidden flex justify-center items-center gap-3 mt-2`}>
              <Link href='/auth/login' className={`w-auto px-3 text-white font-kalnia text-sm active:opacity-75 duration-200 ease-in-out`}>Login</Link>
              <Link href='/auth/signup' className={`w-auto px-3 py-2 rounded-full bg-white text-black font-kalnia text-sm active:opacity-75 duration-200 ease-in-out`}>Get Started</Link>
            </div>
          </div>


          <div className={`w-[90%] md:w-[95%] z-50 fixed top-5 md:pl-5 md:justify-between flex justify-center items-center py-4 rounded-full backdrop-blur-3xl bg-white/25`}>
            <img src="/assets/logo-black.png" className={`h-5 md:h-8 cursor-pointer`} />

            <div className={`w-auto px-5 py-2 hidden lg:flex justify-center items-center gap-3`}>
              <Link href='/about' className={`w-auto motion-preset-expand motion-duration-1000 cursor-pointer hover:opacity-75 duration-150 ease-in-out px-3 font-kalnia text-sm text-white`}>About Us</Link>
              <Link href='/privacy' className={`w-auto motion-preset-expand motion-duration-1000 cursor-pointer hover:opacity-75 duration-150 ease-in-out px-3 font-kalnia text-sm text-white`}>Privacy Policy</Link>
              <Link href='/terms' className={`w-auto motion-preset-expand motion-duration-1000 cursor-pointer hover:opacity-75 duration-150 ease-in-out px-3 font-kalnia text-sm text-white`}>Terms of Usage</Link>
              <Link href='/contact' className={`w-auto motion-preset-expand motion-duration-1000 cursor-pointer hover:opacity-75 duration-150 ease-in-out px-3 font-kalnia text-sm text-white`}>Contact Us</Link>
            </div>
            <div className={`w-auto motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate px-5 py-2 hidden md:flex justify-center items-center gap-3`}>
              <Link href='/auth/login' className={`w-auto cursor-pointer hover:opacity-75 duration-150 ease-in-out px-3 font-kalnia text-sm text-white active:opacity-75`}>Login</Link>
              <Link href='/auth/signup' className={`w-auto cursor-pointer hover:opacity-75 duration-150 ease-in-out font-kalnia text-sm text-black bg-white px-5 py-2 rounded-full active:opacity-75`}>Get Started</Link>
            </div>
          </div>
        </div>

        {/* intro section */}
        <div className={`w-full flex flex-col justify-start items-center h-auto pt-7 pb-12`}>
          <img src="/assets/logo-round.png" className={`h-32 lg:h-40 duration-300 ease-in-out cursor-pointer`} />
          <p className={`w-full text-black text-center mt-2 px-5 sm:px-10 md:px-24 font-dhyana text-[10px] md:text-sm leading-8`}>Moments for Mother Earth is more than just a website; it’s a living community. We believe that every action, no matter how small, can create a ripple of positive change. Our platform connects passionate individuals, environmental groups, and local communities to share their stories, organize events, and inspire a global movement. Whether you're planting a single tree, organizing a large-scale clean-up, or sharing your knowledge, your moments here will help create a healthier, more vibrant planet for all.</p>
        </div>

        {/* ribbon */}
        <div className={`w-full h-auto bg-[#7CBB39] flex justify-center items-center gap-2 overflow-hidden relative`}>
          <div className={`w-[20%] h-full absolute z-30 left-0 bg-gradient-to-r from-[#7CBB39] to-transparent`}></div>
          <Marquee speed={40}>
            <p className={`w-auto z-10 text-white text-4xl font-genos px-4 py-4 font-bold`}>JOIN</p>
            <p className={`w-auto z-10 text-white text-4xl font-genos px-4 py-4 font-bold`}><PiPlantLight /></p>
            <p className={`w-auto z-10 text-white text-4xl font-genos px-4 py-4 font-bold`}>SHARE</p>
            <p className={`w-auto z-10 text-white text-4xl font-genos px-4 py-4 font-bold`}><PiPlantLight /></p>
            <p className={`w-auto z-10 text-white text-4xl font-genos px-4 py-4 font-bold`}>MAKE THE CHANGE HAPPEN</p>
            <p className={`w-auto z-10 text-white text-4xl font-genos px-4 py-4 font-bold`}><PiPlantLight /></p>
          </Marquee>
          <div className={`w-[20%] h-full absolute z-30 right-0 bg-gradient-to-l from-[#7CBB39] to-transparent`}></div>
        </div>

        {/* features */}
        <div className={`w-full lg:w-[70%] h-auto flex flex-col justify-start items-center overflow-hidden py-8 px-4`}>
          <h1 className={`w-full text-start font-genos font-bold text-4xl md:text-5xl xl:text-6xl bg-gradient-to-r from-[#7CBB39] to-[#3f700b] bg-clip-text text-transparent`}>What you can do </h1>
          <hr className={`w-full h-[2px] rounded-full bg-gradient-to-r from-[#7CBB39] to-[#3f700b] mt-3 mb-5`} />

          {/* blog feature */}
          <div className={`w-full flex flex-col py-5 justify-start items-center`}>
            <div className={`w-full flex flex-col justify-center items-start`}>
              <h1 className={`w-full text-start font-cinzel text-xl md:text-2xl lg:text-3xl font-semibold text-black`}>SHARE THOUGHTS</h1>
              <p className={`w-full mt-3 lg:leading-8 mb-5 text-start text-black font-dhyana text-[10px] md:text-sm `}>This is your space to share your journey and inspire others. From personal stories and tips for sustainable living to in-depth articles on environmental issues, your blog is a powerful tool for change. Create an account to easily publish, edit, and manage your posts, and connect with a community that shares your passion.</p>
            </div>
            <div className={`w-full mt-5 flex justify-between items-center gap-3`}>
              <div className={`w-[60%] rounded-xl overflow-hidden h-44 md:h-56 xl:h-60`}>
                <img src="/assets/blog2.jpg" className={`h-full w-full object-cover`} />
              </div>
              <div className={`w-[40%] rounded-xl lg:rounded-[40px] overflow-hidden h-44 md:h-56 xl:h-60`}>
                <img src="/assets/blog1.jpg" className={`h-full w-full object-cover`} />
              </div>
            </div>
          </div>

          {/* event feature */}
          <div className={`w-full rounded-xl bg-black flex flex-col py-5 mt-5 md:py-10 justify-start items-center`}>
            <div className={`w-full flex flex-col justify-center items-start px-4`}>
              <h1 className={`w-full text-start font-cinzel text-xl md:text-2xl lg:text-3xl font-semibold text-white`}>PUBLISH EVENTS</h1>
              <p className={`w-full mt-3 lg:leading-8 mb-5 text-start font-dhyana text-white text-[10px] md:text-sm `}>This is your space to share your journey and inspire others. From personal stories and tips for sustainable living to in-depth articles on environmental issues, your blog is a powerful tool for change. Create an account to easily publish, edit, and manage your posts, and connect with a community that shares your passion.</p>
            </div>
            <div className={`w-full mt-5 flex justify-between items-center gap-3 px-4`}>
              <div className={`w-[50%] rounded-xl overflow-hidden h-44 md:h-56 xl:h-60`}>
                <img src="/assets/event1.jpg" className={`h-full w-full object-cover`} />
              </div>
              <div className={`w-[50%] rounded-xl overflow-hidden h-44 md:h-56 xl:h-60`}>
                <img src="/assets/event2.jpg" className={`h-full w-full object-cover`} />
              </div>
            </div>
          </div>

          {/* podcast feature */}
          <div className={`w-full rounded-xl bg-white flex flex-col py-5 mt-5 md:py-10 justify-start items-center`}>
            <div className={`w-full flex flex-col justify-center items-start px-4`}>
              <h1 className={`w-full text-end font-cinzel text-xl md:text-2xl lg:text-3xl font-semibold text-black`}>EXPLORE PODCASTS</h1>
              <p className={`w-full mt-3 lg:leading-8 mb-5 text-end font-dhyana text-black text-[10px] md:text-sm `}>Knowledge is a powerful tool for change. Here, you can share your environmental expertise, interviews, and inspiring conversations with a wider audience. Create a new podcast post by simply adding a name, a short description, an image, and a YouTube link. We make it easy for you to share your voice and help others learn about the issues and solutions that matter most.</p>
            </div>
            <div className={`w-full mt-5 flex justify-center items-center gap-3 px-4`}>
              <div className={`w-full rounded-xl overflow-hidden h-44 md:h-56 xl:h-60 relative`}>
                <img src="/assets/podcast.png" className={`h-full w-full object-cover`} />
                <div className={`w-auto flex flex-col justify-center items-center absolute left-5 md:left-10 top-1/2 -translate-y-1/2`}>
                  <h1 className={`w-full text-3xl md:text-4xl xl:text-5xl text-start font-bold font-genos text-orange-400 opacity-90`}>LISTEN,</h1>
                  <h1 className={`w-full text-3xl md:text-4xl xl:text-5xl text-start font-bold font-genos text-orange-400 opacity-90`}>SHARE,</h1>
                  <h1 className={`w-full text-3xl md:text-4xl xl:text-5xl text-start font-bold font-genos text-orange-400 opacity-90`}>LEARN,</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* get started */}
        <div className={`w-full justify-start items-center py-5 px-5 md:px-10 lg:px-24`}>
          <h1 className={`w-full text-center font-cinzel text-xl md:text-2xl lg:text-3xl font-semibold text-black`}>READY TO GET STARTED ?</h1>
          <p className={`w-full mt-3 lg:leading-8 mb-5 text-center font-dhyana text-black text-[10px] md:text-sm `}>Join our community today and be a part of something bigger.</p>
        </div>

        {/* faq */}
        <div className={`w-full mb-5 md:w-[60%] lg:w-[50%] px-8 overflow-hidden flex flex-col justify-start items-center`}>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="py-2">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="focus-visible:border-ring cursor-pointer text-black focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                    {item.title}
                    <PlusIcon
                      size={16}
                      className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-muted-foreground text-black pb-2">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* footer */}
        <div className={`w-full md:w-[60%] h-auto pt-10 grid grid-cols-3 md:grid-cols-5 justify-items-center gap-4`}>
          <Link href='/about' className={`text-[12px] z-30 md:text-sm font-montserrat cursor-pointer px-3 py-1 md:py-2 bg-white text-black`}>About</Link>
          <Link href='/privacy' className={`text-[12px] z-30 md:text-sm font-montserrat cursor-pointer px-3 py-1 md:py-2 bg-white text-black`}>Privacy</Link>
          <Link href='/terms' className={`text-[12px] z-30 md:text-sm font-montserrat cursor-pointer px-3 py-1 md:py-2 bg-white text-black`}>Terms</Link>
          <Link href='/contact' className={`text-[12px] z-30 md:text-sm font-montserrat cursor-pointer px-3 py-1 md:py-2 bg-white text-black`}>Contact</Link>
          <Link href='/developer' className={`text-[12px] z-30 md:text-sm font-montserrat cursor-pointer px-3 py-1 md:py-2 bg-white text-black`}>Developer</Link>
        </div>
        <div className={`w-full h-auto flex justify-center items-center overflow-hidden`}>
          <img src="/assets/footer.jpg" className={`w-full z-10`} />
        </div>

      </div>
    </>
  )
}

export default page
