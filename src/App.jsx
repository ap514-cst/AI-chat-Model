
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { URL } from './constants'
import Answere from './components/Answere'
import { MdDelete } from "react-icons/md";
import Login from "./components/Login";
function App() {

  const [qustion, setQustion] = useState('')
  const [result, setResult] = useState([])
  
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')) || [])
  const [selectedHistory, setSelectedHistory] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false);
  const scroll = useRef()



  const askQustion = async () => {

    if (!qustion && !selectedHistory) {
      return false
    }
    if (qustion) {
      if (localStorage.getItem('history')) {
        let history = JSON.parse(localStorage.getItem("history"))
        history = [qustion, ...history]
        localStorage.setItem("history", JSON.stringify(history))
        setRecentHistory(history)
      } else {
        localStorage.setItem("history", JSON.stringify([qustion]))
        setRecentHistory([qustion])
      }
    }

    const payloadData = qustion ? qustion : selectedHistory

    const payload = {
      "contents": [{
        "parts": [{ "text": payloadData }]
      }]
    }
    setLoading(true)

    let response = await fetch(URL, {
      method: "post",
      body: JSON.stringify(payload)
    })
    response = await response.json()
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim())


    //console.log(response.candidates[0].content.parts[0].text);
    setResult([...result, { type: 'q', text: qustion ? qustion : selectedHistory }, { type: 'a', text: dataString }])

    setQustion("")
    setTimeout(() => {
      scroll.current.scrollTop = scroll.current.scrollHeight
    }, 500)

    setLoading(false)
  }

  const handlerDelete = () => {
    localStorage.clear()
    setRecentHistory([])
  }



  const isEnter = (e) => {
    if (e.key == 'Enter') {
      askQustion()
    }
  }


  

  useEffect(() => {
    const timer=setTimeout(()=>{
      askQustion();
    },0)
    return ()=>clearTimeout(timer)
    
  }, [selectedHistory])

  

  


  //dark mode..
  const [darkMood, setDarkMood] = useState('dark')
  useEffect(() => {
    if (darkMood == "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    console.log(darkMood);

  }, [darkMood])
  return (
    <div>

    
        <>

          <div className={darkMood === "dark" ? "dark" : "light"}>
            <div className="flex h-screen">

              {/* Sidebar BG Overlay (Mobile) */}
              {openSidebar && (
                <div
                  onClick={() => setOpenSidebar(false)}
                  className="fixed inset-0 bg-black/50 md:hidden z-20"
                ></div>
              )}

              {/* Sidebar */}
              <div
                className={`
        fixed md:static z-30
        w-64 h-full
        dark:bg-zinc-900 bg-zinc-100
        shadow-xl border-r dark:border-zinc-700
        transform transition-transform duration-300
        ${openSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
              >
                {/* Top actions */}
                <div className="flex items-center justify-between p-4 bg-zinc-200 dark:bg-zinc-800 shadow-md">
                  <span onClick={handlerDelete} className="cursor-pointer">
                    <MdDelete className="text-2xl text-red-500 hover:text-red-600" />
                  </span>

                  <a  href="https://apomojumder.netlify.app/"><h2 className=' shadow-md w-auto px-2  py-2 rounded-xl cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500  '>SAM</h2></a>
                  <select
                    onChange={(e) => setDarkMood(e.target.value)}
                    className="bg-transparent px-2 py-1 border rounded-md dark:text-white"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                {/* History List */}
                <div className="overflow-auto h-[calc(100vh-70px)] p-2 space-y-2">
                  {recentHistory &&
                    recentHistory.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setSelectedHistory(item);
                          setOpenSidebar(false); // auto close mobile
                        }}
                        className="cursor-pointer p-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm transition"
                      >
                        {item}
                      </li>
                    ))}
                </div>
              </div>

              {/* Main Section */}
              <div className="flex-1 flex flex-col">

                {/* Header */}
                <div className="sticky top-0 z-10 bg-zinc-200 dark:bg-zinc-900 shadow-md p-4 flex items-center justify-between">

                  {/* Hamburger (Mobile Only) */}
                  <button
                    className="md:hidden text-2xl"
                    onClick={() => setOpenSidebar(true)}
                  >
                    ☰
                  </button>

                  <h1 className="w-full text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    Hello User, Ask me Anything
                  </h1>

                  {/* Empty space to balance layout */}
                  <div className="w-8 md:hidden"></div>
                </div>

                {/* Chat Messages */}
                <div ref={scroll} className="flex-1 overflow-auto p-4 space-y-4">

                  {Array.isArray(result) &&
                    result.map((item, index) => (
                      <div key={index} className={item.type === "q" ? "flex justify-end" : "flex justify-start"}>
                        {item.type === "q" ? (
                          <div className="bg-blue-200 dark:bg-blue-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-2xl shadow-md max-w-xs">
                            <Answere ans={item} />
                          </div>
                        ) : (
                          item.text.map((ansItem, ansIndex) => (
                            <div
                              key={ansIndex}
                              className=" text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-2xl shadow-md w-auto"
                            >
                              <Answere ans={ansItem} />
                            </div>
                          ))
                        )}
                      </div>
                    ))}

                  {loading && (
                    <div className="flex justify-center py-6">
                      <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-zinc-200 dark:bg-zinc-900 flex items-center gap-3 shadow-inner">
                  <input
                    onKeyDown={isEnter}
                    onChange={(e) => setQustion(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl outline-none dark:bg-zinc-800 dark:text-white bg-white shadow-md"
                    type="text"
                    placeholder="Ask me anything..."
                  />
                  <button
                    onClick={askQustion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl cursor-pointer"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      
    </div>

  )
}

export default App
