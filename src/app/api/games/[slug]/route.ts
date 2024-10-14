import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const gameResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": "7gzqvqve27js3u8zu4ak26zq5nf76q",
      Authorization: `Bearer ttd71wcynxivj30uz44mwzhm8skv7e`,
      "Content-Type": "text/plain",
    },
    body: `fields name, summary, rating, first_release_date, cover.url, platforms.name, screenshots, similar_games, slug; where slug = "${slug}";`,
  });

  const gameData = await gameResponse.json();

  if (gameData.length === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const game = gameData[0]; 
  const gameId = game.id;
  let cover = game.cover;
  if (cover) {
    const coverResponse = await fetch("https://api.igdb.com/v4/covers", {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
        "Content-Type": "text/plain",
      },
      body: `fields *; where game = (${gameId}); limit 1;`,
    });

    cover = await coverResponse.json();
    cover = cover[0];
    cover.url = cover.url.replaceAll("thumb", "1080p");
  }
  const gameWithCover = {
    ...game,
    cover,
  };

  const screenshotsIds = game.screenshots;
  let screenshots = [];
  if (screenshotsIds && screenshotsIds.length > 0) {
    const screenshotsResponse = await fetch(
      "https://api.igdb.com/v4/screenshots",
      {
        method: "POST",
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID!,
          Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
          "Content-Type": "text/plain",
        },
        body: `fields game, image_id; where game = (${gameId}); limit 6;`,
      }
    );

    screenshots = await screenshotsResponse.json();
  }
  const gameWithScreenshots = {
    ...gameWithCover,
    screenshots,
  };

  const similarGameIds = game.similar_games;
  let similarGames = [];
  if (similarGameIds && similarGameIds.length > 0) {
    const similarGamesResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!, 
        Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`, 
        "Content-Type": "text/plain",
      },
      body: `fields id, name, cover.url, slug; where id = (${similarGameIds.join(
        ","
      )}); limit 6;`, 
    });

    similarGames = await similarGamesResponse.json();
  }

  const gameWithDetails = {
    ...gameWithScreenshots,
    similarGames,
  };
  return NextResponse.json(gameWithDetails);
}
