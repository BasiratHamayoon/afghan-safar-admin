import { getLocale, setLocale } from "@/actions";

import { useState, useEffect, useRef } from "react";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: "en",
    name: "English",
    flag: "🇬🇧",
  });
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ps", name: "پښتو (Pashto)", flag: "🇦🇫" },
    { code: "fa", name: "دری (Dari)", flag: "🇦🇫" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language);
    await setLocale(language.code);
    setIsOpen(false);
    window.location.reload();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const setinitialState = async () => {
    const code = await getLocale();
    console.log(code);
    languages.forEach(
      (it, index) => it.code === code && setSelectedLanguage(languages[index])
    );
  };

  useEffect(() => {
    setinitialState();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-28 md:w-48" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center">
          <span className="mr-2 text-lg">{selectedLanguage.flag}</span>
          <span>{selectedLanguage.name}</span>
        </div>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {languages.map((language) => (
              <div
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`language-option flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer ${
                  selectedLanguage.code === language.code ? "bg-blue-50" : ""
                }`}
              >
                <span className="mr-2 text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
