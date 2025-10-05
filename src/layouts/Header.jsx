import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";


function Header() {
  const { user } = useUser();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r from-primary/15 via-secondary/8 to-primary/15 dark:supports-[backdrop-filter]:bg-gradient-to-r dark:from-primary/25 dark:via-secondary/15 dark:to-primary/25">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Mobile Menu Button - Left Side */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden min-w-[40px] min-h-[40px] rounded-xl bg-white/90 dark:bg-gray-800/90 
                      hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:scale-105 active:scale-95 
                      transition-all duration-300 shadow-modern flex items-center justify-center 
                      border border-gray-200/50 dark:border-gray-600/50 hover:border-primary/30 dark:hover:border-primary/50"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
        >
            <div className="relative w-6 h-5 flex flex-col justify-between">
                {/* Top bar */}
                <span
                    className={`block h-0.5 w-6 bg-gray-700 dark:bg-gray-300 rounded transition-transform duration-500 ease-in-out ${
                        isMobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
                    }`}
                ></span>

                {/* Middle bar */}
                <span
                    className={`block h-0.5 w-6 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-500 ease-in-out ${
                        isMobileMenuOpen ? "opacity-0 scale-50" : ""
                    }`}
                ></span>

                {/* Bottom bar */}
                <span
                    className={`block h-0.5 w-6 bg-gray-700 dark:bg-gray-300 rounded transition-transform duration-500 ease-in-out ${
                        isMobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                    }`}
                ></span>
            </div>
        </button>


          {/* Logo - Center */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-300"
          >
            <img
                src="/Logo.png"
                alt="Logo"
                className="h-10 w-10 lg:w-15 lg:h-15 mr-0 "
                style={{ maxWidth: '100%', maxHeight: '100%' }}
             />
            <span className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Predictive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "gradient-primary text-white shadow-glow font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                }`
              }
              end
            >
              Home
            </NavLink>
            {user && (
              <NavLink
                to={`/${user.id}/profile`}
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "gradient-primary text-white shadow-glow font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`
                }
              >
                Profile
              </NavLink>
            )}
            {user && (
              <NavLink
                to={`/${user.id}/info`}
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "gradient-primary text-white shadow-glow font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`
                }
              >
                Predictor
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "gradient-primary text-white shadow-glow font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                }`
              }
            >
              About
            </NavLink>
          </nav>

          {/* Right Side - Auth & Dark Mode */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-300 group shadow-modern flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <use href="/icons/sprite.svg#sun" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <use href="/icons/sprite.svg#moon" />
                </svg>
              )}
            </button>

            <SignedOut>
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-sm sm:text-base font-medium hover:text-primary transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="gradient-primary text-white text-sm sm:text-base font-medium hover:shadow-glow transition-all duration-300 px-4 sm:px-6 py-2">
                    Get Started
                  </Button>
                </Link>
              </div>
            </SignedOut>

            {/* User Button - Only when signed in */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-16 sm:top-20 left-0 w-64 h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-border/40 dark:border-gray-700/40 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="py-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "gradient-primary text-white shadow-glow font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            {user && (
              <NavLink
                to={`/${user.id}/profile`}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "gradient-primary text-white shadow-glow font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
            )}
            {user && (
              <NavLink
                to={`/${user.id}/info`}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "gradient-primary text-white shadow-glow font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Predictor
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "gradient-primary text-white shadow-glow font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>

            {/* Mobile Auth Buttons */}
            <SignedOut>
              <div className="px-4 py-3">
                <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full text-base font-medium hover:text-primary transition-all duration-300 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="mt-3 w-full gradient-primary text-white text-base font-medium hover:shadow-glow transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="px-4 py-3">
              </div>
            </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
