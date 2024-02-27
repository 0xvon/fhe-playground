import { FaGithub } from "react-icons/fa";

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <h1 className="text-lg font-semibold">FHE Playground</h1>
            <a href="https://github.com/0xvon/fhe-playground" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-200">
                <FaGithub className="mr-2" size={25} />
            </a>
        </header>
    );
};

export default Header;