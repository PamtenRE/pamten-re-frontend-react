import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      {
        benefits: [
          {
            title: "Top Talent Pool",
            desc: "Access a curated database of highly qualified candidates or job openings.",
            icon: "UsersIcon",
          },
          {
            title: "Seamless Matching",
            desc: "Smart algorithms connect the right talent with the right roles.",
            icon: "ActivitySquareIcon",
          },
          {
            title: "Secure & Private",
            desc: "Your data is protected with industry-leading security.",
            icon: "ShieldIcon",
          },
          {
            title: "Accelerated Hiring",
            desc: "Streamline recruitment or job search with efficient tools.",
            icon: "RocketIcon",
          },
        ],
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error in benefits API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
