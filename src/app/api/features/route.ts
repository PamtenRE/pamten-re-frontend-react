import { NextResponse } from "next/server";

const candidateFeatures = [
  {
    icon: "Sparkles",
    text: "AI-powered job recommendations with 95% accuracy",
  },
  {
    icon: "CheckCircle",
    text: "One-click applications with smart resume matching",
  },
  {
    icon: "Clock",
    text: "Real-time application tracking and interview scheduling",
  },
  { icon: "BarChart", text: "Resume improvement tips and skills gap analysis" },
  { icon: "Globe", text: "Visa-friendly company filtering and insights" },
];

const recruiterFeatures = [
  {
    icon: "Users",
    text: "Multi-tenant architecture with white-label branding",
  },
  { icon: "Settings", text: "Advanced candidate pipeline management" },
  {
    icon: "ActivitySquare",
    text: "Team collaboration and role-based permissions",
  },
  { icon: "Shield", text: "Automated screening and interview scheduling" },
  {
    icon: "BarChart",
    text: "Comprehensive analytics and performance insights",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const features =
      type === "candidate"
        ? candidateFeatures
        : type === "recruiter"
        ? recruiterFeatures
        : [];

    return NextResponse.json(
      { features },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error in features API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
