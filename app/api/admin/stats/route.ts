import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalOrders, totalRevenue, totalRestaurants, totalUsers] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          where: {
            paymentStatus: 'COMPLETED',
          },
          _sum: {
            total: true,
          },
        }),
        prisma.restaurant.count(),
        prisma.user.count(),
      ])

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalRestaurants,
      totalUsers,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
