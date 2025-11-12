import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    testimonials: [
      {
        quote: 'RecruitEdge revolutionized our hiring process. We found top-tier talent faster than ever before!',
        name: 'Sarah J.',
        title: 'HR Director at InnovateCorp',
        emoji: '💼',
      },
      {
        quote: 'Finding my dream job was effortless with their intuitive search and personalized recommendations. Highly recommend!',
        name: 'David L.',
        title: 'Senior Software Engineer',
        emoji: '👨‍💻',
      },
      {
        quote: 'The benefits section is spot on! Every feature highlighted truly makes a difference in our daily operations.',
        name: 'Emily R.',
        title: 'Recruitment Manager',
        emoji: '📈',
      },
    ],
  });
} 