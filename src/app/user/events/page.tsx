'use client'

import Navbar from "@/components/Navbar"
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { IoMdSearch } from "react-icons/io";
import { MdEventAvailable } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { toast } from "sonner";
import { v4 } from "uuid";
import { BsViewStacked } from "react-icons/bs";
import { AiOutlineShrink } from "react-icons/ai";
import { IoIosTrash } from "react-icons/io";

interface Event {
    eventName: string;
    eventDesc: string;
    eventDate: string;
    eventLocation: string;
    occur: string;
    userEmail: string;
    uniqueId: string;
}

function page() {

    const [verified, setVerified] = useState(false);
    const { dark } = useTheme()
    const router = useRouter();
    const pathname = usePathname();
    const [searchInput, setSearchInput] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [allEvents, setAllEvents] = useState<Event[] | null>(null);
    const [eventLocation, setEventLocation] = useState('');
    const [option, setOption] = useState('all');
    const [loadingMessage, setLoadingMessage] = useState('');
    const [createVisible, setCreateVisible] = useState(false);
    const [readMoreVisible, setReadMoreVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [eventDate, setEventDate] = useState<Date | undefined>(new Date);
    const [filtered, setFiltered] = useState<Event[] | [] | undefined>([]);
    const [name, setName] = useState<string | null | undefined>('');
    const [email, setEmail] = useState<string | null | undefined>('');

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
                    setName(res.data.found?.name);
                    setEmail(res.data.found?.email);
                }
            } catch (err) {
                console.log(err);
            }
        }

        verifyUser();
    }, []);

    const createEvent = async () => {
        if (loadingMessage) {
            toast.error("Please wait ...");
            return;
        }

        if (!eventName || !eventDesc || !eventLocation) {
            toast.error("All fields mandatory");
            return;
        }

        if (!eventDate) {
            toast.error("Event date required");
            return;
        }

        if(eventDesc.length > 300){
            toast.error("Description length : max 300 characters");
            return;
        }

        try {
            setLoadingMessage("Creating ...")
            const milisecond = new Date(eventDate).getTime();
            const formatted = format(milisecond, "do MMMM yyyy");
            const unique = v4();

            const current = Date.now();

            if (milisecond < current) {
                toast.error("Please select future date");
                return;
            }

            const res = await axios.post(`/api/user-events`, {
                eventName, eventDesc, eventLocation, eventDate: formatted, occur: milisecond, type: 'create', uniqueId: unique
            }, { withCredentials: true });

            if (res.status === 200) {
                toast.success("Event Created");
                setCreateVisible(false);
                setEventName('');
                setEventDesc('');
                setEventLocation('');
                setEventDate(new Date);
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
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/api/user-events', {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setAllEvents(res.data?.found);
                }

            } catch (err) {
                console.log(err);
            }
        }

        fetchEvents();
    }, []);

    const trimText = (text: string) => {
        if (text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        else {
            return text;
        }
    }

    useEffect(() => {
        if (option === 'your') {
            const filter = allEvents?.filter((event) => {
                return event.userEmail === email
            });

            setFiltered(filter);
        }
        else if (option === 'past') {
            const filter = allEvents?.filter((event) => {
                const current = Date.now();

                return Number(event.occur) > current;
            });

            setFiltered(filter);
        }
        else if (option === 'upcoming') {
            const filter = allEvents?.filter((event) => {
                const current = Date.now();

                return Number(event.occur) < current;
            });

            setFiltered(filter);
        }
    }, [option]);

    const search = () => {
        setOption('search');
        const filter = allEvents?.filter((event) => {
            return event.eventName.toLowerCase().includes(searchInput);
        });

        setFiltered(filter);
    }

    const deleteEvent = async (event: Event) => {
        try {
            const res = await axios.delete(`/api/user-events?uniqueId=${event.uniqueId}`, {
                withCredentials: true
            });

            if(res.status === 200){
                toast.success("Event deleted");
                setEventName("");
                setEventDesc("");
                setEventLocation("");
                setEventDate(new Date);
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

            <div className={`w-full h-screen ${verified ? "block" : "hidden"} ${dark ? "bg-zinc-950" : "bg-white"} duration-150 ease-in-out flex flex-col justify-start items-center relative overflow-hidden`}>
                <Navbar path={pathname} />

                {/* host event */}
                <div className={`w-full ${createVisible ? "block" : "hidden"} pb-10 h-screen px-3 fixed z-30 backdrop-blur-3xl ${dark ? "bg-black/20" : "bg-white/20"} duration-150 ease-in-out flex flex-col justify-start items-center overflow-y-auto scroll-bar pt-24 md:pt-28`}>
                    <h1 className={`w-full mb-7 text-center text-3xl font-semibold font-montserrat ${dark ? "text-white" : "text-black"}`}>Host a new Event </h1>

                    <input value={eventName} onChange={(e) => setEventName(e.target.value)} type="text" className={`w-full mb-3 md:w-[70%] lg:w-[50%] xl:w-[40%] ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out px-3 py-3  outline-none rounded-md`} placeholder="Enter event name*" />
                    <input value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} type='text' className={`w-full mb-3 md:w-[70%] lg:w-[50%] xl:w-[40%] ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out px-3 py-3  outline-none rounded-md`} placeholder="Enter event description*" />
                    <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} type="text" className={`w-full mb-3 md:w-[70%] lg:w-[50%] xl:w-[40%] ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out px-3 py-3  outline-none rounded-md`} placeholder="Enter event location*" />
                    <p className={`w-full font-montserrat text-sm text-center md:w-[70%] lg:w-[50%] xl:w-[40%] ${dark ? "text-white" : "text-black"} my-3 duration-150 ease-in-out`}>Select Event Date :*</p>
                    <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        className={`${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out mt-3 rounded-lg border`}
                    />
                    <p onClick={createEvent} className={`w-full md:w-[70%] lg:w-[50%] xl:w-[40%] bg-blue-600 text-white cursor-pointer py-3 rounded-md text-center active:opacity-80 duration-150 ease-in-out mt-4`}>{loadingMessage ? (<><span>{loadingMessage}</span><span className="ml-2 loading loading-spinner loading-sm"></span></>) : ("Create Event")}</p>
                    <p onClick={() => {
                        setCreateVisible(false);
                        setEventName('');
                        setEventDesc('');
                        setEventLocation('');
                    }} className={`w-full md:w-[70%] lg:w-[50%] xl:w-[40%] text-center text-red-600 font-montserrat font-semibold mt-5 cursor-pointer`}>Cancel</p>
                </div>

                {/* event read more */}
                <div className={`w-full ${readMoreVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"} md:w-1/2 pb-5 top-0 overflow-y-auto scroll-bar h-screen md:h-auto rounded-lg xl:rounded-xl shadow-2xl backdrop-blur-3xl ${dark ? "bg-black/20" : "bg-white/20"} duration-150 ease-in-out z-30 fixed flex flex-col justify-start items-center pt-28 md:mt-32`}>
                    <span onClick={() => {
                        setReadMoreVisible(false);
                    }} className={`w-auto absolute top-20 md:top-10 right-5 p-2 ${dark ? "bg-white text-black" : "bg-black text-white"} duration-150 ease-in-out cursor-pointer rounded-full`}><AiOutlineShrink /></span>
                    <p className={`w-full px-3 mt-4 md:mt-0 text-center ${dark ? "text-white" : "text-black"} py-3 font-semibold font-montserrat text-2xl`}>{currentEvent?.eventName}</p>
                    <p className={`w-full md:w-[70%] px-3 mt-2 md:mt-0 text-center ${dark ? "text-white" : "text-black"} py-3 text-[12px] md:text-sm font-montserrat text-2xl`}> {currentEvent?.eventDesc} </p>
                    <p className={`w-full md:w-[70%] lg:w-[50%] px-3 mt-2 md:mt-0 text-center ${dark ? "text-white" : "text-black"} py-3 text-[12px] md:text-sm font-montserrat text-2xl font-semibold flex justify-start items-center gap-3`}> Location :<span className={`font-normal`}>{currentEvent?.eventLocation}</span></p>
                    <p className={`w-full md:w-[70%] lg:w-[50%] px-3 text-center ${dark ? "text-white" : "text-black"} py-3 text-[12px] md:text-sm font-montserrat text-2xl font-semibold flex justify-start items-center gap-3`}> Date :<span className={`font-normal`}>{currentEvent?.eventDate}</span></p>
                </div>

                <div className={`w-full z-20 flex flex-col justify-start items-center pt-20 md:pt-28`}>
                    <div className={`w-full md:w-[70%] lg:w-[50%] px-3 py-4 flex justify-center items-center relative`}>
                        <input onChange={(e) => setSearchInput(e.target.value)} type="text" className={`w-full px-3 md:px-5 py-3 rounded-full outline-none font-montserrat ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} duration-150 ease-in-out`} placeholder="Search events near you" />
                        <span onClick={search} className={`w-auto absolute top-1/2 right-7 -translate-y-1/2 text-2xl ${dark ? "text-white" : "text-black"} duration-150 ease-in-out cursor-pointer`}><IoMdSearch /></span>
                    </div>

                    <div className={`w-full md:w-[70%] lg:w-[50%] flex justify-start items-start gap-3 overflow-x-auto mt-3 md:mt-6 scroll-bar px-4 relative`}>
                        <span onClick={() => {
                            setCreateVisible(true);
                        }} className={`w-auto z-10 cursor-pointer px-5 shrink-0 py-2 rounded-md bg-blue-600 text-white flex justify-center items-center gap-3`}>Host Event <MdEventAvailable /></span>
                        <span onClick={() => {
                            setOption('your');
                        }} className={`w-auto cursor-pointer px-5 shrink-0 py-2 rounded-md bg-fuchsia-700 text-white flex justify-center items-center gap-3`}>Your Events <MdEditNote /></span>
                        <span onClick={() => {
                            setOption('all');
                        }} className={`w-auto z-10 cursor-pointer px-5 py-2 rounded-md ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} shrink-0 font-dhyana duration-150 ease-in-out border-b-2 ${option === 'all' ? "border-b-blue-600" : "border-b-transparent"}`}>All Events</span>
                        <span onClick={() => {
                            setOption('past');
                        }} className={`w-auto z-10 cursor-pointer px-5 py-2 rounded-md ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} shrink-0 font-dhyana duration-150 ease-in-out border-b-2 ${option === 'past' ? "border-b-blue-600" : "border-b-transparent"}`}>Past Events</span>
                        <span onClick={() => {
                            setOption('upcoming');
                        }} className={`w-auto z-10 cursor-pointer px-5 py-2 rounded-md ${dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"} shrink-0 font-dhyana duration-150 ease-in-out border-b-2 ${option === 'upcoming' ? "border-b-blue-600" : "border-b-transparent"}`}>Upcoming Events</span>
                    </div>
                </div>

                {option === 'all' && <div className={`w-full mt-8 px-3 md:px-10 flex flex-col justify-start items-center`}>
                    <h1 className={`w-full ${dark ? "text-white" : "text-black"} duration-150 ease-in-out text-start font-dhyana font-semibold text-xl md:text-2xl`}>All Events</h1>
                    <div className={`w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4`}>
                        {allEvents && allEvents?.length > 0 && allEvents?.map((event, index) => {
                            return <div key={index} className={`w-full h-auto flex flex-col justify-start ${dark ? "bg-zinc-700" : "bg-gray-200"} items-center py-2 px-3 rounded-lg`}>
                                <p className={`w-full  font-semibold text-start px-1 py-3 font-sm lg:font-lg font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{trimText(event.eventName)}</p>
                                <p className={`w-full italic text-start px-1 pb-2 font-[10px] lg:font-sm font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{event.eventDate}</p>
                                <p onClick={() => {
                                    setCurrentEvent(event);
                                    setReadMoreVisible(true);
                                }} className={`w-full py-2 mt-2 text-center ${dark ? "bg-white text-black" : "bg-black text-white"} duration-150 ease-in-out cursor-pointer rounded-lg flex justify-center items-center gap-2 active:opacity-80`}>View Event <BsViewStacked /></p>
                            </div>
                        })}
                    </div>
                </div>}

                {option === 'your' && <div className={`w-full mt-8 px-3 md:px-10 flex flex-col justify-start items-center`}>
                    <h1 className={`w-full ${dark ? "text-white" : "text-black"} duration-150 ease-in-out text-start font-dhyana font-semibold text-xl md:text-2xl`}>Your Events</h1>
                    <div className={`w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4`}>
                        {filtered && filtered?.length > 0 && filtered?.map((event, index) => {
                            return <div key={index} className={`w-full h-auto flex flex-col justify-start ${dark ? "bg-zinc-700" : "bg-gray-200"} items-center py-2 px-3 rounded-lg`}>
                                <p className={`w-full  font-semibold text-start px-1 py-3 font-sm lg:font-lg font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{trimText(event.eventName)}</p>
                                <p className={`w-full italic text-start px-1 pb-2 font-[10px] lg:font-sm font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{event.eventDate}</p>
                                <p onClick={() => {
                                    setCurrentEvent(event);
                                    setReadMoreVisible(true);
                                }} className={`w-full py-2 mt-2 text-center ${dark ? "bg-white text-black" : "bg-black text-white"} duration-150 ease-in-out cursor-pointer rounded-lg flex justify-center items-center gap-2 active:opacity-80`}>View Event <BsViewStacked /></p>
                                <p onClick={() => deleteEvent(event)} className={`w-full py-2 mt-2 text-center bg-red-500 text-white duration-150 ease-in-out cursor-pointer rounded-lg flex justify-center items-center gap-2 active:opacity-80`}>Delete Event <IoIosTrash /></p>
                            </div>
                        })}
                    </div>
                </div>}

                {option === 'past' && <div className={`w-full mt-8 px-3 md:px-10 flex flex-col justify-start items-center`}>
                    <h1 className={`w-full ${dark ? "text-white" : "text-black"} duration-150 ease-in-out text-start font-dhyana font-semibold text-xl md:text-2xl`}>Past Events</h1>
                    <div className={`w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4`}>
                        {filtered && filtered?.length > 0 && filtered?.map((event, index) => {
                            return <div key={index} className={`w-full h-auto flex flex-col justify-start ${dark ? "bg-zinc-700" : "bg-gray-200"} items-center py-2 px-3 rounded-lg`}>
                                <p className={`w-full  font-semibold text-start px-1 py-3 font-sm lg:font-lg font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{trimText(event.eventName)}</p>
                                <p className={`w-full italic text-start px-1 pb-2 font-[10px] lg:font-sm font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{event.eventDate}</p>
                                <p onClick={() => {
                                    setCurrentEvent(event);
                                    setReadMoreVisible(true);
                                }} className={`w-full py-2 mt-2 text-center ${dark ? "bg-white text-black" : "bg-black text-white"} duration-150 ease-in-out cursor-pointer rounded-lg flex justify-center items-center gap-2 active:opacity-80`}>View Event <BsViewStacked /></p>
                            </div>
                        })}
                    </div>
                </div>}

                {option === 'upcoming' && <div className={`w-full mt-8 px-3 md:px-10 flex flex-col justify-start items-center`}>
                    <h1 className={`w-full ${dark ? "text-white" : "text-black"} duration-150 ease-in-out text-start font-dhyana font-semibold text-xl md:text-2xl`}>Upcoming Events</h1>
                    <div className={`w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4`}>
                        {filtered && filtered?.length > 0 && filtered?.map((event, index) => {
                            return <div key={index} className={`w-full h-auto flex flex-col justify-start ${dark ? "bg-zinc-700" : "bg-gray-200"} items-center py-2 px-3 rounded-lg`}>
                                <p className={`w-full  font-semibold text-start px-1 py-3 font-sm lg:font-lg font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{trimText(event.eventName)}</p>
                                <p className={`w-full italic text-start px-1 pb-2 font-[10px] lg:font-sm font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{event.eventDate}</p>
                                <p onClick={() => {
                                    setCurrentEvent(event);
                                    setReadMoreVisible(true);
                                }} className={`w-full py-2 mt-2 text-center ${dark ? "bg-white text-black" : "bg-black text-white"} duration-150 ease-in-out cursor-pointer rounded-lg flex justify-center items-center gap-2 active:opacity-80`}>View Event <BsViewStacked /></p>
                            </div>
                        })}
                    </div>
                </div>}

                {option === 'search' && <div className={`w-full mt-8 px-3 md:px-10 flex flex-col justify-start items-center`}>
                    <h1 className={`w-full ${dark ? "text-white" : "text-black"} duration-150 ease-in-out text-start font-dhyana font-semibold text-xl md:text-2xl`}>Results for "{searchInput}"</h1>
                    <div className={`w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4`}>
                        {filtered && filtered?.length > 0 && filtered?.map((event, index) => {
                            return <div key={index} className={`w-full h-auto flex flex-col justify-start ${dark ? "bg-zinc-700" : "bg-gray-200"} items-center py-2 px-3 rounded-lg`}>
                                <p className={`w-full  font-semibold text-start px-1 py-3 font-sm lg:font-lg font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{trimText(event.eventName)}</p>
                                <p className={`w-full italic text-start px-1 pb-2 font-[10px] lg:font-sm font-dhyana ${dark ? "text-white" : "text-black"} duration-150 ease-in-out`}>{event.eventDate}</p>
                                <p onClick={() => {
                                    setCurrentEvent(event);
                                    setReadMoreVisible(true);
                                }} className={`w-full py-2 mt-2 text-center ${dark ? "bg-white text-black" : "bg-black text-white"} duration-150 ease-in-out cursor-pointer rounded-lg flex justify-center items-center gap-2 active:opacity-80`}>View Event <BsViewStacked /></p>
                            </div>
                        })}
                    </div>
                </div>}

            </div>
        </>
    )
}

export default page
