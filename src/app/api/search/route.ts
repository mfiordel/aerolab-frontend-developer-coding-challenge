import { Game, Cover } from "@/app/models";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  const gameResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
      "Content-Type": "text/plain",
    },
    body: `search "${query}"; fields name, cover, slug; limit 5;`, 
  });

  const games = await gameResponse.json();
  const gameIds = games.map((game: Game) => game.id).join(",");

  const coverResponse = await fetch("https://api.igdb.com/v4/covers", {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
      "Content-Type": "text/plain",
    },
    body: `fields game, image_id; where game = (${gameIds});`,
  });

  const covers = await coverResponse.json();
  const gamesWithCovers = games.map((game: Game) => {
    return {
      ...game,
      cover: covers.find((cover: Cover) => cover.game === game.id)
        ? {
            url: `https://images.igdb.com/igdb/image/upload/t_logo_med/${
              covers.find((cover: Cover) => cover.game === game.id).image_id
            }.jpg`,
          }
        : null,
    };
  });

  return NextResponse.json(gamesWithCovers);
}
