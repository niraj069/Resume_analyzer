import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { session_id: string } }
) {
  try {
    const backendResponse = await fetch(`http://127.0.0.1:8000/api/sessions/${params.session_id}/`, {
      method: 'GET',
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch session details from backend' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error proxying to Django:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
