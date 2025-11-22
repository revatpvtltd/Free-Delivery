import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'PICKED_UP',
    'ON_THE_WAY',
    'DELIVERED',
    'CANCELLED',
  ]),
  message: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins, restaurant owners, or delivery partners can update order status
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const canUpdate =
      session.user.role === 'ADMIN' ||
      order.restaurant.ownerId === session.user.id ||
      (session.user.role === 'DELIVERY_PARTNER' && order.deliveryId)

    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        deliveredAt:
          validatedData.status === 'DELIVERED' ? new Date() : undefined,
      },
    })

    // Add tracking entry
    await prisma.orderTracking.create({
      data: {
        orderId: params.id,
        status: validatedData.status,
        message: validatedData.message || `Order status updated to ${validatedData.status}`,
      },
    })

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
