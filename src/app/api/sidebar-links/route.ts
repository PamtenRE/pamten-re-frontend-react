import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    links: [
      { name: 'Dashboard', href: '/recruiter/dashboard', icon: 'Briefcase' },
      { name: 'Requisitions', href: '/recruiter/requisitions', icon: 'ClipboardList' },
      { name: 'Candidates', href: '/recruiter/candidates', icon: 'Users' },
    ],
  });
} 