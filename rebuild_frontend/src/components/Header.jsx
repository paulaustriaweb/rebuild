import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-white/15
        bg-gradient-to-r from-blue-600 via-blue-500 to-amber-400
        shadow-lg backdrop-blur-md"
        >
           <nav
           aria-label="Main navigation"
           className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 px-4 sm:px-8 py-3 max-w-screen-xl"
           >
            <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg transition"
            >
                <img
                src="/Lost-and-found.png"
                alt="Lost and Found logo"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/80 shadow-md object-contain"
                />

                <span className="font-semibold text-lg sm:text-xl text-white tracking-wide text-center sm:text-left">
                    Lost&nbsp;&amp;&nbsp;Found
                </span>
            </Link>
           </nav>
        </header>
    )
}