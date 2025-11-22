import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { z } from 'zod'

const createOrderSchema = z.object({
  restaurantId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
      specialRequest: z.string().optional(),
    })
  ),
  deliveryAddress: z.string(),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
  specialInstructions: z.string().optional(),
  paymentMethod: z.enum(['CARD', 'CASH', 'WALLET']),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        restaurant: {
          select: {
            name: true,
            image: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Get restaurant details
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: validatedData.restaurantId },
    })

    if (!restaurant || !restaurant.isActive || !restaurant.isOpen) {
      return NextResponse.json(
        { error: 'Restaurant not available' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const deliveryFee = restaurant.deliveryFee
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + deliveryFee + tax

    // Check minimum order
    if (subtotal < restaurant.minOrder) {
      return NextResponse.json(
        { error: `Minimum order is ${restaurant.minOrder}` },
        { status: 400 }
      )
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        restaurantId: validatedData.restaurantId,
        orderNumber: generateOrderNumber(),
        subtotal,
        deliveryFee,
        tax,
        total,
        paymentMethod: validatedData.paymentMethod,
        deliveryAddress: validatedData.deliveryAddress,
        deliveryLat: validatedData.deliveryLat,
        deliveryLng: validatedData.deliveryLng,
        specialInstructions: validatedData.specialInstructions,
        items: {
          create: validatedData.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            specialRequest: item.specialRequest,
          })),
        },
        tracking: {
          create: {
            status: 'PENDING',
            message: 'Order placed',
          },
        },
      },
      include: {
        restaurant: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
