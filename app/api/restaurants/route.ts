import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const cuisine = searchParams.get('cuisine')
    const isOpen = searchParams.get('isOpen')
    const search = searchParams.get('search')

    const where: any = {
      isActive: true,
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (cuisine) {
      where.cuisine = { contains: cuisine, mode: 'insensitive' }
    }

    if (isOpen === 'true') {
      where.isOpen = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
      ]
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    })

    return NextResponse.json({ restaurants })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
