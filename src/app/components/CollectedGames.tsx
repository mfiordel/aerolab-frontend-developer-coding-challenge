"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Game } from "../models";
import { toast } from "react-toastify"; 

const CollectedGames = () => {
  const [collectedGames, setCollectedGames] = useState<Game[]>([]);
  const [sortOrder, setSortOrder] = useState("ascending"); 
  const [filterCategory, setFilterCategory] = useState("all"); 
  useEffect(() => {
    const storedGames = localStorage.getItem("collectedGames");
    if (storedGames) {
      setCollectedGames(JSON.parse(storedGames));
    }
  }, []);
  const handleRemoveGame = (gameId: number) => {
    const updatedCollection = collectedGames.filter(
      (game) => game.id !== gameId
    );
    setCollectedGames(updatedCollection);
    localStorage.setItem("collectedGames", JSON.stringify(updatedCollection)); 
    toast.info("Game removed from collection.", {
      className: "bg-zinc-900 text-white",
    }); 
  };

  const handleFilterChange = (category: string) => {
    if (filterCategory === category) {
      setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
    } else {
      setFilterCategory(category);
      setSortOrder("ascending");
    }
  };
  const filteredGames = [...collectedGames].sort((a, b) => {
    const gameAReleaseDate = new Date(a.first_release_date!);
    const gameBReleaseDate = new Date(b.first_release_date!);
    const gameAAddedDate = new Date(a.addedDate!);
    const gameBAddedDate = new Date(b.addedDate!);

    if (filterCategory === "release_date") {
      if (
        isNaN(gameAReleaseDate.getTime()) ||
        isNaN(gameBReleaseDate.getTime())
      ) {
        return 0;
      }
      return sortOrder === "ascending"
        ? gameAReleaseDate.getTime() - gameBReleaseDate.getTime() 
        : gameBReleaseDate.getTime() - gameAReleaseDate.getTime();
    }

    if (filterCategory === "added_date") {
      if (isNaN(gameAAddedDate.getTime()) || isNaN(gameBAddedDate.getTime())) {
        return 0;
      }
      return sortOrder === "ascending"
        ? gameAAddedDate.getTime() - gameBAddedDate.getTime()
        : gameBAddedDate.getTime() - gameAAddedDate.getTime();
    }

    return 0;
  });

  return (
    <div className="w-full justify-center items-center text-center pt-8 py-4 sm:px-4 bg-zinc-900 relative z-0">
      <h2 className="text-2xl font-bold border-b border-zinc-800 pb-5 text-white">
        COLLECTED <span className="text-orange-500">GAMES</span>
      </h2>
      <div className="flex space-x-2 mb-4 mt-4 text-sm justify-center items-center flex-wrap">
        <button
          onClick={() => handleFilterChange("all")}
          aria-label={`Sort type by all`}
          className={`py-1 px-3 mt-1 rounded-lg ${
            filterCategory === "all"
              ? "bg-orange-600 text-white"
              : "bg-zinc-800 text-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("release_date")}
          aria-label={`Sort by release date. Double click to change ascending vs descending`}
          className={`py-1 px-3 mt-1 rounded-lg flex items-center ${
            filterCategory === "release_date"
              ? "bg-orange-600 text-white"
              : "bg-zinc-800 text-white"
          }`}
        >
          By Release Date
          {filterCategory === "release_date"
            ? sortOrder === "ascending"
              ? " ↑"
              : " ↓"
            : null}
        </button>
        <button
          onClick={() => handleFilterChange("added_date")}
          aria-label={`Sort by added date. Double click to change ascending vs descending`}
          className={`py-1 px-3 mt-1 rounded-lg flex items-center ${
            filterCategory === "added_date"
              ? "bg-orange-600 text-white"
              : "bg-zinc-800 text-white"
          }`}
        >
          By Added Date
          {filterCategory === "added_date"
            ? sortOrder === "ascending"
              ? " ↑"
              : " ↓"
            : null}
        </button>
      </div>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-4 p-1 sm:p-4 rounded-lg justify-items-center">
          {filteredGames.map((collectedGame) => (
            <div key={collectedGame.id} className="flex flex-col items-center">
              <Link
                href={`/game/${collectedGame.slug}`}
                key={collectedGame.id}
                className="flex flex-col items-center bg-zinc-800 rounded-lg mb-2 bg-zinc-900 py-4 items-center w-52 h-64 text-center shadow-md hover:shadow-orange-500 border border-zinc-800"
              >
                {collectedGame.cover && (
                  <div className="h-44 flex items-center">
                    <Image
                      src={`https:${collectedGame.cover.url}`}
                      alt={`${collectedGame.name} cover`}
                      width={100}
                      height={100}
                      className="rounded-lg mb-4 mx-8 "
                    />
                  </div>
                )}
                <div className="border-t border-zinc-800 w-full pt-4 px-2 text-white">
                  {collectedGame.name}
                </div>
              </Link>
              <button
                onClick={() => handleRemoveGame(collectedGame.id)}
                className="mt-1 mb-2 bg-zinc-800 text-white py-1 px-3 rounded-lg hover:bg-orange-600"
                aria-label={`Remove ${collectedGame.name} from collection`}
              >
                X
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex ml-auto mr-auto justify-center items-center border border-zinc-800 p-4 mx-4 my-8 rounded-lg max-w-md h-32 text-center bg-zinc-800">
          <p className="text-zinc-300 text-lg leading-6">
            No games collected yet.
          </p>
          <button
            aria-label={`Click to focus on game search input element`}
            onClick={() => document.getElementById("searchInput")?.focus()}
            className="mt-2 ml-2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectedGames;
