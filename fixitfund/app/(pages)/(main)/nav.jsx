"use client";

import Link from 'next/link'; 
import Image from 'next/image'; 
import Logo from './a.jpeg'; 
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { auth } from '../../_lib/firebase';
import { usePathname } from 'next/navigation';

const Navbar = ({children}) => {
	const [isMobile, setIsMobile] = useState(false);
	const [isOpen, setIsOpen] = useState(false); //used for HAMBURGER
	const [navbarHeight, setNavbarHeight] = useState('h-24');
	const pathname = usePathname();

	const user = auth.currentUser;
	const isNotLoggedIn = user === null;

    useEffect(() => {
        const handleResize = () => { // determines if mobile
            setIsMobile(window.innerWidth < 1025);
        };

        const handleScroll = () => {
			if(isMobile){
				setNavbarHeight('h-16')
			}else{
				const scrollThreshold = 440; //scroll value
				if (window.scrollY > scrollThreshold) {
					setNavbarHeight('h-16');
				} else {
					setNavbarHeight('h-24');
				}
			}
		}

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

	const toggleMenu = () => {
		setIsOpen(prev => !prev);
	};

	const closeMenu = () =>{
		setIsOpen(false);
	};

	return (
	  <nav className={`sticky top-0 w-full h-[10vh] ${navbarHeight} bg-[#f17418] z-50 transition-all duration-300`}>
		<div className="w-full h-full flex justify-between items-center px-4 sm:px-6 md:px-6">
			<div className="justify-between flex space-x-8 items-center">
				<Link href='/'>
					<Image
						src={Logo}
						alt="Logo"
						width={50}
						height={50}
						style={{ borderRadius: '50%'}}
						className="cursor-pointer"
						priority
					/>
				</Link>
				{!isMobile && (
					<>
					{!isNotLoggedIn && 
					<Link href='/account'>
						<div className={`font-bold text-lg ${pathname === '/account' ? 'underline decoration-white' : ''}`}>Account</div>
					</Link>
					}
					<Link href='/'>
						<div className={`font-bold text-lg ${pathname === '/' ? 'underline decoration-white' : ''}`}>Home</div>
					</Link>
					</>
				)}
			</div>
			{!isMobile && (
			<div className="justify-between flex space-x-6 items-center">
				{isNotLoggedIn && 
					<>
						<Link href='/signin'>
							<div className="font-bold text-lg">Sign up</div>
						</Link>
						<Link href='/signup'>
							<div className="font-bold text-lg rounded-xl bg-[#019ca0] cursor-pointer hover:bg-[#49bfc3] px-3 py-2">Log in</div>
						</Link>
					</>
				}
				{ !isNotLoggedIn && 
				<Link href='/create'>
				<div className="font-bold text-lg bg-[#fff7db] text-black px-3 py-2 rounded-xl hover:bg-gray-400 cursor-pointer">
					Create
				</div>
				</Link>
				}
			</div>
			)}
			{isMobile && (
			<div className="cursor-pointer">
				<FaBars onClick={toggleMenu} size={24} />
		  	</div>
			)}
			{isMobile && (
			<>
				{isOpen && ( //panel closer
				<div 
					className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 transition-opacity duration-300"
					onClick={toggleMenu}
				></div>
				)}
				<div className={`fixed top-0 right-0 w-3/4 h-full bg-[#f17418] shadow-xl z-50 flex flex-col p-4 transform transition-all duration-300 ease-in-out ${ //panel opener
					isOpen ? 'translate-x-0' : 'translate-x-full' //conditional, isOpen = true -> translates element 0, false -> translates it to right
				}`}
				>
				<div className="flex justify-end">
					<FaTimes onClick={toggleMenu} size={24} className="cursor-pointer" />
				</div>
				<Link href='/account' onClick={closeMenu}>
					<div className={`font-bold text-lg py-2 ${pathname === '/account' ? 'underline decoration-white' : ''}`}>Account</div>
				</Link>
				<Link href='/' onClick={closeMenu}>
					<div className={`font-bold text-lg py-2 ${pathname === '/' ? 'underline decoration-white' : ''}`}>Home</div>
				</Link>
				{isNotLoggedIn && 
				<>
				<Link href='/signup' onClick={closeMenu}>
					<div className="font-bold text-lg py-2">Sign Up</div>
				</Link>
				<Link href='/signin' onClick={closeMenu}>
					<div className="font-bold text-lg rounded-xl w-3/5 mt-[3vh] text-center bg-[#019ca0] cursor-pointer px-3 py-2">Sign In</div>
				</Link>
				</>
				
				}
				{!isNotLoggedIn &&
				<Link href='/create'>
				<div className="font-bold text-lg bg-[#fff7db] w-3/5 mt-[3vh] text-white text-center py-2 rounded-xl hover:bg-gray-400 cursor-pointer">
					Create
				</div>
				</Link>
				}
				</div>
			</>
			)}
		</div>
	  </nav>
	);
};

export default Navbar;