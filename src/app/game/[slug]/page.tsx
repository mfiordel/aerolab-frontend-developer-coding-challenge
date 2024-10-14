"use client";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/app/models"; 
import SkeletonLoader from "./SkeletonLoader";

const GameDetail = () => {
  const { slug } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [collectedGames, setCollectedGames] = useState<Game[]>([]); 
  const [isCollected, setIsCollected] = useState(false);

  const calculateYearsAgo = (releaseDate?: number) => {
    if (!releaseDate) return null;
    const releaseYear = new Date(releaseDate * 1000).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - releaseYear;
  };

  useEffect(() => {
    if (slug) {
      const fetchGameDetails = async () => {
        try {
          const response = await fetch(`/api/games/${slug}`);
          const data = await response.json();
          setGame(data);
        } catch (error) {
          console.error("Failed to fetch game details:", error);
        }
      };
      fetchGameDetails();
    }
  }, [slug]);

  useEffect(() => {
    const storedGames = localStorage.getItem("collectedGames");
    if (storedGames) {
      setCollectedGames(JSON.parse(storedGames));
    }
  }, []);

  useEffect(() => {
    if (
      game &&
      collectedGames.some((collectedGame) => collectedGame.id === game.id)
    ) {
      setIsCollected(true);
    }
  }, [game, collectedGames]);

  const handleCollectGame = () => {
    if (game && !isCollected) {
      const newGame = {
        ...game,
        addedDate: new Date().toISOString(), 
      };
      const newCollection = [...collectedGames, newGame];
      setCollectedGames(newCollection);
      localStorage.setItem("collectedGames", JSON.stringify(newCollection));
      setIsCollected(true);
      toast.success(`${game.name} added to collection!`, {
        className: "bg-zinc-900 text-white",
      });
    }
  };

  const handleRemoveCollectedGame = (gameId: number) => {
    const updatedCollection = collectedGames.filter(
      (collectedGame) => collectedGame.id !== gameId 
    );
    setCollectedGames(updatedCollection);
    localStorage.setItem("collectedGames", JSON.stringify(updatedCollection));
    if (game && game.id === gameId) {
      setIsCollected(false);
      toast.info(`${game.name} has been removed from collection.`, {
        className: "bg-zinc-900 text-white",
      });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (imageId: any) => {
    setSelectedImage(imageId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (!game) {
    return <SkeletonLoader />;
  }

  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;
  const yearsAgo = calculateYearsAgo(game.first_release_date);

  return (
    <div className="w-full flex flex-col items-center pt-8 bg-zinc-900 text-white flex-grow">
      <h2 className="text-2xl font-bold border-b border-zinc-800 pb-5">
        GAME <span className="text-orange-500">DETAILS</span>
      </h2>
      <div className="w-full flex flex-col md:flex-row justify-center items-center pt-4 bg-zinc-900 text-white w-full sm:w-3/4 rounded-lg p-1 sm:p-4 md:p-6 drop-shadow-xl">
        {game.cover && (
          <div className="flex p-10 rounded-lg items-center">
            <Image
              src={`https:${game.cover.url}`}
              alt={`${game.name} cover`}
              width={200}
              height={160}
              className="rounded-lg w-4/5 h-auto "
            />
          </div>
        )}
        <div className="flex flex-col pt-4 text-white w-full sm:w-3/4 md:w-3/4 rounded-lg p-5 drop-shadow-md border border-zinc-800">
          {/* Detalles del juego */}
          <h1 className="text-2xl mb-4 text-orange-500 font-bold">
            {game.name}
          </h1>
          {game.rating && (
            <p className="text-sm mb-2">
              Rating: {Math.round(game.rating)} / 100
            </p>
          )}

          {releaseYear && (
            <p className="text-sm mb-2">
              Released: {releaseYear} ({yearsAgo} years ago)
            </p>
          )}

          {game.platforms && (
            <p className="text-sm mb-4">
              Platforms:{" "}
              {game.platforms.map((platform) => platform.name).join(", ")}
            </p>
          )}
          {game.summary && (
            <p className="text-sm mb-4">Summary: {game.summary}</p>
          )}

          {/* Botón para coleccionar juego */}
          {!isCollected ? (
            <button
              onClick={handleCollectGame}
              className="w-full sm:w-72 bg-orange-500 p-2 rounded-lg mb-4 shadow-md hover:shadow-green-500/20"
              aria-label={`Add ${game.name} to collection`}
            >
              + Collect game
            </button>
          ) : (
            <button
              className="w-full sm:w-72 bg-blue-500 p-2 rounded-lg mb-4 shadow-md hover:shadow-blue-500/20"
              onClick={() => handleRemoveCollectedGame(game.id)}
              aria-label={`Remove ${game.name} from collection`}
            >
              Game already collected!
            </button>
          )}
        </div>
      </div>
      <h2 className="text-lg font-bold mt-4 border-b border-zinc-800 pb-5 text-center">
        GAME <span className="text-orange-500">SCREENSHOTS</span>
      </h2>
      <div className="w-full flex flex-row flex-wrap justify-center items-center py-2 text-center">
        {game.screenshots && game.screenshots.length > 0 ? (
          game.screenshots.map((screenshot) => (
            <div className="pt-4 px-2 flex" key={screenshot.image_id}>
              {screenshot.image_id && (
                <Image
                  src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`}
                  alt={`${screenshot.game} screenshot`}
                  width={100}
                  height={100}
                  className="rounded-lg mb-4 w-4/5 h-auto"
                  onClick={() => openModal(screenshot.image_id)}
                />
              )}
            </div>
          ))
        ) : (
          <p>No screenshots found.</p>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-0 right-0 text-white text-2xl p-2"
              onClick={closeModal}
              aria-label={`Close modal`}
            >
              &times;
            </button>
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${selectedImage}.jpg`}
              alt="Screenshot enlarged"
              width={600}
              height={600}
              className="rounded-lg w-full h-auto "
            />
          </div>
        </div>
      )}
      {/* Juegos similares */}
      <div className="w-full flex flex-col py-2 text-center">
        <h2 className="text-2xl font-bold my-8 border-b border-zinc-800 pb-5">
          SIMILAR <span className="text-orange-500">GAMES</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-4 p-1 sm:p-4 rounded-lg justify-items-center">
          {game.similarGames && game.similarGames.length > 0 ? (
            game.similarGames.map((similarGame) => (
              <Link
                href={`/game/${similarGame.slug}`}
                prefetch={true}
                key={similarGame.id}
                className="rounded-lg mb-2 bg-zinc-900 flex flex-col py-4 mx-4 items-center w-52 h-64 rounded-lg text-center shadow-md hover:shadow-orange-500  border border-zinc-800"
              >
                {similarGame.cover && (
                  <div className="h-full object-contain">
                  <Image
                    src={`https:${similarGame.cover.url.replaceAll('thumb','screenshot_med')}`}
                    alt={`${similarGame.name} cover`}
                    width={1000}
                    height={1000}
                    className="rounded-lg object-scale-down"
                  />
                  </div>
                )}
                <div className="border-t border-zinc-800 w-full pt-4 px-2">
                  {similarGame.name}
                </div>
              </Link>
            ))
          ) : (
            <p>No similar games found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
