import { DICTIONARY } from "@/backend/entity";
import Link from "next/link";
import { FaBrain, FaGithub } from "react-icons/fa";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <Link href="/" className="text-lg font-semibold">{DICTIONARY.WEBSITE_TITLE}</Link>
            <div className="flex gap-2" >
                <Link href="/ml" className="text-lg font-semibold items-center hover:text-gray-200"><FaBrain size={25} /></Link>
                <a href="https://github.com/0xvon/fhe-playground" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-200">
                    <FaGithub className="mr-2" size={25} />
                </a>
            </div>

        </header>
    );
};

export default Header;