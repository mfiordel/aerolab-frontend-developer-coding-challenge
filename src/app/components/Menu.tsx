"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Game } from "../models";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 200); 
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchGames = async (query: string) => {
    if (query.trim() === "") {
      setGames([]);
      return;
    }

    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    setGames(data);
  };

  useEffect(() => {
    searchGames(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setGames([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center pt-3 pb-1 bg-zinc-900 relative z-50 drop-shadow-md ">
      <div className="flex items-center w-full max-w-sm relative">
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="ml-2 mr-8"
          />
        </Link>
        <input
          id="searchInput"
          type="text"
          placeholder="Find a game to collect..."
          className="rounded-3xl ml-2 p-2 w-full text-zinc-100 pl-4 hover:shadow-sm hover:shadow-orange-500/50 bg-zinc-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => searchGames(searchTerm)}
        />
        <span onClick={() => searchGames(searchTerm)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 absolute top-1/2 transform -translate-y-1/2 right-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
            />
          </svg>
        </span>
      </div>

      <div className="mt-2 w-full max-w-sm relative bg-neutral-800 rounded-3xl drop-shadow-md">
        {games.length === 0 ? (
          <></>
        ) : (
          <div
            ref={resultsRef}
            className="absolute shadow-lg z-50 rounded-md py-2 px-1 bg-zinc-800"
          >
            {games.map((game) => (
              <div
                key={game.id}
                className="flex items-center h-10 p-2 my-1 bg-zinc-900 hover:shadow-sm hover:shadow-orange-500/50 hover:text-orange-400 w-96 rounded-md"
              >
                <Link href={`/game/${game.slug}`} className="flex flex-row" onClick={()=>{setGames([])}}>
                  {game.cover ? (
                    <Image
                      src={game.cover.url}
                      alt={game.name}
                      width={25}
                      height={25}
                      className="rounded mr-2 h-auto cursor-pointer"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded mr-2" />
                  )}
                  <p className="text-sm ml-2">{game.name}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
