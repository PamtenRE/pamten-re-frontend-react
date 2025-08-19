import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    employers: [
      { id: 1, name: 'Nexus Corp', emoji: '🏢' },
      { id: 2, name: 'Synapse Tech', emoji: '🧠' },
      { id: 3, name: 'Quantum Innovations', emoji: '🔬' },
      { id: 4, name: 'Evergreen Solutions', emoji: '🌿' },
      { id: 5, name: 'Pioneer Works', emoji: '🚀' },
      { id: 6, name: 'Zenith Labs', emoji: '��' },
    ],
  });
} 