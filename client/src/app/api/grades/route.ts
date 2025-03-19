import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { grades } from "./data";

export async function GET() {
  try {
    return NextResponse.json(
      {
        message: "Success",
        data: grades,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { message: "Failed to fetch grades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || body.order === undefined || !body.status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new grade with auto-generated ID
    const newGrade: Grade = {
      gradeId: `grade-${body.order}`,
      name: body.name,
      description: body.description || "",
      order: body.order,
      status: body.status,
    };

    // Add to our mock database
    grades.push(newGrade);

    return NextResponse.json(
      {
        message: "The grade was successfully created",
        data: newGrade,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating grade:", error);
    return NextResponse.json(
      { message: "Failed to create grade" },
      { status: 500 }
    );
  }
}
