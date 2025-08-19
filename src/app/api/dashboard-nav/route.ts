import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    items: [
      { name: 'Dashboard', href: '/recruiter/dashboard' },
      { name: 'Post a Job', href: '/recruiter/job-post' },
      { name: 'Applications', href: '/recruiter/applications' },
    ],
  });
} 