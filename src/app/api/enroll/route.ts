import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["studentName", "email", "dateOfBirth", "address", "cityStateZip", "phoneHome", "phoneCell"]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create enrollment record
    const enrollment = await prisma.enrollment.create({
      data: {
        studentName: body.studentName,
        email: body.email,
        dateOfBirth: body.dateOfBirth,
        address: body.address,
        cityStateZip: body.cityStateZip,
        phoneHome: body.phoneHome,
        phoneCell: body.phoneCell,
      },
    })

    return NextResponse.json(enrollment, { status: 200 })
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

