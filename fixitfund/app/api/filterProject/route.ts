import { NextResponse } from 'next/server'
 
export async function GET(request: Request, { params }: { params: { Status: string, Class: string}}) {
  return NextResponse.json({ msg: 'Hello from server' })
}