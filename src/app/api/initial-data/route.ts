import { NextResponse } from "next/server";

async function getTestimonials() {
  // Simulate API call
  return [
    {
      id: "1",
      quote: "Found my dream job through this platform!",
      name: "John Doe",
      title: "Software Engineer",
      emoji: "👨‍💻",
    },
    // Add more testimonials...
  ];
}

async function getFeatures(type: "candidate" | "recruiter") {
  // Simulate API call
  const features = {
    candidate: [
      {
        id: "1",
        title: "Job Matching",
        description: "AI-powered job matching for better opportunities",
        icon: "🎯",
        type: "candidate",
      },
      // Add more candidate features...
    ],
    recruiter: [
      {
        id: "1",
        title: "Talent Pool",
        description: "Access to pre-vetted talent pool",
        icon: "👥",
        type: "recruiter",
      },
      // Add more recruiter features...
    ],
  };

  return features[type];
}

async function getBenefits() {
  // Simulate API call
  return [
    {
      id: "1",
      title: "Fast Hiring",
      description: "Reduce time-to-hire by 50%",
      icon: "⚡",
    },
    // Add more benefits...
  ];
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Fetch all data in parallel
    const [testimonials, candidateFeatures, recruiterFeatures, benefits] =
      await Promise.all([
        getTestimonials(),
        getFeatures("candidate"),
        getFeatures("recruiter"),
        getBenefits(),
      ]);

    const response = {
      testimonials,
      features: {
        candidate: candidateFeatures,
        recruiter: recruiterFeatures,
      },
      benefits,
    };

    // Add cache headers
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error in combined API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
