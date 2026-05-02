import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    // You can set this in .env.local: N8N_AVAILABILITY_WEBHOOK_URL="https://your-ngrok-url/webhook/availability"
    const webhookUrl = process.env.N8N_AVAILABILITY_WEBHOOK_URL || 'https://delisa-cacographical-roland.ngrok-free.dev/webhook/availability';
    
    // Pass the date to n8n webhook
    const response = await fetch(`${webhookUrl}?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch availability from n8n: ${response.status}`);
    }

    const data = await response.json();
    
    // Normalizar la respuesta de n8n
    // n8n suele devolver [{ json: { occupied: [...] } }] o [{ occupied: [...] }] o [...]
    let occupied: string[] = [];
    
    if (Array.isArray(data)) {
      if (data.length > 0) {
        // Caso: [{ json: { occupied: [...] } }]
        if (data[0].json && Array.isArray(data[0].json.occupied)) {
          occupied = data[0].json.occupied;
        } 
        // Caso: [{ occupied: [...] }]
        else if (Array.isArray(data[0].occupied)) {
          occupied = data[0].occupied;
        }
        // Caso: ["10:00 AM", ...]
        else if (typeof data[0] === 'string') {
          occupied = data;
        }
        // Caso: n8n devuelve los items filtrados directamente [{ Hora: "10:00 AM", ... }]
        else if (data[0].Hora || (data[0].json && data[0].json.Hora)) {
          occupied = data.map((item: any) => {
            const val = item.json ? item.json.Hora : item.Hora;
            return typeof val === 'string' ? val : null;
          }).filter(Boolean) as string[];
        }
      }
    } else if (data.occupied && Array.isArray(data.occupied)) {
      occupied = data.occupied;
    }

    // Asegurarse de que todos sean strings y estén limpios
    occupied = occupied.map(s => String(s).trim());

    console.log(`Availability for ${date}:`, occupied);

    return NextResponse.json({ occupied });
  } catch (error) {
    console.error('Availability fetch error:', error);
    // On error, return empty occupied array so user can still book
    return NextResponse.json({ occupied: [] });
  }
}
