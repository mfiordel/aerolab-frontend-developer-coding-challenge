import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};
type Params = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Params }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/games/${params.slug}`
  );
  const game = await response.json();
  return {
    title: `Game Details - ${game.name}`,
    description: game.summary,
    openGraph: {
      title: game.name,
      description: game.summary,
      url: `https://yourwebsite.com/game/${params.slug}`,
      images: [
        {
          url: game.cover ? `https:${game.cover.url}` : "/default-cover.jpg",
          alt: game.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: game.name,
      description: game.summary,
      images: [game.cover ? `https:${game.cover.url}` : "/default-cover.jpg"],
    },
  };
}

const Layout = ({ children }: LayoutProps) => {
  return <div>{children}</div>;
};

export default Layout;
