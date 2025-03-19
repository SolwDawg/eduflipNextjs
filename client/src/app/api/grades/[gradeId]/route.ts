import { NextRequest, NextResponse } from "next/server";

// Access the mock database from the parent route
// In a real application, this would be a database query
// We're importing it from a module that would be shared with the parent route
import { auth } from "@clerk/nextjs/server";
import { grades } from "../data";

export async function PUT(
  request: NextRequest,
  { params }: { params: { gradeId: string } }
) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { gradeId } = params;

    // Parse request body
    const body = await request.json();

    // Find the grade index
    const gradeIndex = grades.findIndex((grade) => grade.gradeId === gradeId);

    // If grade doesn't exist
    if (gradeIndex === -1) {
      return NextResponse.json(
        { message: "The grade was not found" },
        { status: 404 }
      );
    }

    // Update the grade
    const updatedGrade = {
      ...grades[gradeIndex],
      name: body.name ?? grades[gradeIndex].name,
      description: body.description ?? grades[gradeIndex].description,
      order: body.order ?? grades[gradeIndex].order,
      status: body.status ?? grades[gradeIndex].status,
    };

    // Replace the grade in the array
    grades[gradeIndex] = updatedGrade;

    return NextResponse.json(
      {
        message: "The grade was updated",
        data: updatedGrade,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating grade:", error);
    return NextResponse.json(
      { message: "Failed to update grade" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { gradeId: string } }
) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { gradeId } = params;

    // Find the grade index
    const gradeIndex = grades.findIndex((grade) => grade.gradeId === gradeId);

    // If grade doesn't exist
    if (gradeIndex === -1) {
      return NextResponse.json(
        { message: "The grade was not found" },
        { status: 404 }
      );
    }

    // In a real app, check if courses are associated with this grade
    // This is a mock implementation
    const hasAssociatedCourses = false; // Replace with actual logic in a real app

    if (hasAssociatedCourses) {
      return NextResponse.json(
        { message: "Cannot delete grade with associated courses" },
        { status: 400 }
      );
    }

    // Remove the grade from the array
    grades.splice(gradeIndex, 1);

    return NextResponse.json(
      { message: "The grade was deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting grade:", error);
    return NextResponse.json(
      { message: "Failed to delete grade" },
      { status: 500 }
    );
  }
}
