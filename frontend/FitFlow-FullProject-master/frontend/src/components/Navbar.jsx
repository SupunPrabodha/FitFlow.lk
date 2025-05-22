import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggler = () => {
        setIsMenuOpen(isMenuOpen);
    };
    const navItems = [
        { path: "/", title: "Start a Search" },
        { path: "/trainer-dashboard", title: " Trainer Dashboard" },
        { path: "/myplans", title: "My Plans" },
        { path: "/request-plan", title: "Request a plan" },
    ];
    return (
        <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            <nav className="flex justify-between items-center py-6">
                <a href="/" className="flex items-right gap-1 text-xl text-black">
                    Workout & Meal Plans
                </a>
                {/* nav items for large devices */}
                <ul className="hidden md:flex gap-12">
                    {navItems.map(({ path, title }) => (
                        <li key={path} className="text-base text-primary">
                            <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                                {" "}
                                {title}
                                {/* other code */}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                {/* signup and login btn */}
                <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
                    <Link to="/login" className="py-2 px-5 border rounded">
                        Log in
                    </Link>
                    <Link to="/sign-up" className="py-2 px-5 border rounded bg-black text-white">
                        Sign Up
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
