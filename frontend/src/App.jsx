import { useState } from 'react'
import BKLogo from './assets/logoVienTrang.png';
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './tabs/Home.jsx';


function About() {
  return <h1>Giới thiệu</h1>;
}

function Contact() {
  return <h1>Liên hệ</h1>;
}

function Header() {
    return (
        <header className='flex flex-wrap justify-center self-center p-[5px] bg-[#003399]'>
            <div className='flex flex-wrap items-center gap-[5px] text-white'>
                <img src={BKLogo} alt="Logo" style={{ width: '50px', height: '50px' }} />
                <p className='md:text-2xl text-lg font-bold'>HỆ THỐNG QUẢN LÝ SINH VIÊN</p>
            </div>
            {/* <div className='flex flex-wrap self-center w-3/6'>
                <nav className='flex gap-4 justify-between w-full text-lg'>
                    <Link to="/" className='text-white no-underline'>Trang chủ</Link>
                    <Link to="/about" className='text-white no-underline'>Giới thiệu</Link>
                    <Link to="/contact" className='text-white no-underline'>Liên hệ</Link>
                </nav>
            </div> */}
        </header>
    );
}

function Footer() {
    return (
        <footer className='flex flex-wrap justify-center self-center p-[5px] bg-[#003399] mt-[10px]'>
            <p className='text-white'>© 2025 Hệ thống quản lý sinh viên</p>
        </footer>
    );
}

function App() {
    return (
        <>
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
        </Router>
        </>
    )
}

// function App() {
//     const [count, setCount] = useState(0)

//     return (
//         <>
//         <div>
//             <a href="https://vite.dev" target="_blank">
//             <img src={viteLogo} className="logo" alt="Vite logo" />
//             </a>
//             <a href="https://react.dev" target="_blank">
//             <img src={reactLogo} className="logo react" alt="React logo" />
//             </a>
//         </div>
//         <h1>Vite + React</h1>
//         <div className="card">
//             <button onClick={() => setCount((count) => count + 1)}>
//             count is {count}
//             </button>
//             <p>
//             Edit <code>src/App.jsx</code> and save to test HMR
//             </p>
//         </div>
//         <p className="read-the-docs">
//             Click on the Vite and React logos to learn more
//         </p> 
//         </>
//     )
// }
export default App
