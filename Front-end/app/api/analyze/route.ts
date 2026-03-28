import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Assuming Django backend runs on localhost:8000
    const backendResponse = await fetch('http://127.0.0.1:8000/api/analyze/', {
      method: 'POST',
      body: formData,
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to analyze resume in backend' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error proxying to Django:', error)
    return NextResponse.json(
      { error: 'Internal Server Error when contacting backend', details: String(error) },
      { status: 500 }
    )
  }
}
