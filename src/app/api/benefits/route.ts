import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    benefits: [
      {
        title: 'Top Talent Pool',
        desc: 'Access a curated database of highly qualified candidates or job openings.',
        icon: 'UsersIcon',
      },
      {
        title: 'Seamless Matching',
        desc: 'Smart algorithms connect the right talent with the right roles.',
        icon: 'ActivitySquareIcon',
      },
      {
        title: 'Secure & Private',
        desc: 'Your data is protected with industry-leading security.',
        icon: 'ShieldIcon',
      },
      {
        title: 'Accelerated Hiring',
        desc: 'Streamline recruitment or job search with efficient tools.',
        icon: 'RocketIcon',
      },
    ],
  });
} 