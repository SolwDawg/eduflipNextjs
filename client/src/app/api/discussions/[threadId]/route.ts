import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { discussionThreads, discussionPosts } from "../data";

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params;

    // Find the thread
    const thread = discussionThreads.find((t) => t.threadId === threadId);

    if (!thread) {
      return NextResponse.json(
        { message: "Discussion thread not found" },
        { status: 404 }
      );
    }

    // Increment view count (in a real app, would track unique views)
    thread.viewCount += 1;

    // Find the posts for this thread
    const posts = discussionPosts.filter((p) => p.threadId === threadId);

    return NextResponse.json(
      {
        message: "Success",
        data: { thread, posts },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching discussion thread:", error);
    return NextResponse.json(
      { message: "Failed to fetch discussion thread" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    // Verify authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = params;

    // Parse request body
    const body = await request.json();

    // Find the thread
    const threadIndex = discussionThreads.findIndex(
      (t) => t.threadId === threadId
    );

    if (threadIndex === -1) {
      return NextResponse.json(
        { message: "Discussion thread not found" },
        { status: 404 }
      );
    }

    // Check if user is the creator of the thread
    const thread = discussionThreads[threadIndex];
    if (thread.creatorId !== userId) {
      return NextResponse.json(
        {
          message: "Permission denied. You are not the creator of this thread.",
        },
        { status: 403 }
      );
    }

    // Update the thread
    const updatedThread = {
      ...thread,
      title: body.title || thread.title,
      content: body.content || thread.content,
      category: body.category || thread.category,
      tags: body.tags || thread.tags,
      updatedAt: new Date().toISOString(),
    };

    // Replace the thread in the array
    discussionThreads[threadIndex] = updatedThread;

    return NextResponse.json(
      {
        message: "Discussion thread updated successfully",
        data: updatedThread,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating discussion thread:", error);
    return NextResponse.json(
      { message: "Failed to update discussion thread" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    // Verify authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = params;

    // Find the thread
    const threadIndex = discussionThreads.findIndex(
      (t) => t.threadId === threadId
    );

    if (threadIndex === -1) {
      return NextResponse.json(
        { message: "Discussion thread not found" },
        { status: 404 }
      );
    }

    // Check if user is the creator of the thread
    const thread = discussionThreads[threadIndex];
    if (thread.creatorId !== userId) {
      return NextResponse.json(
        {
          message: "Permission denied. You are not the creator of this thread.",
        },
        { status: 403 }
      );
    }

    // Remove the thread from the array
    discussionThreads.splice(threadIndex, 1);

    // Remove associated posts
    const postsToRemoveIndices = discussionPosts
      .map((post, index) => (post.threadId === threadId ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => b - a); // Sort in descending order to remove from end first

    postsToRemoveIndices.forEach((index) => {
      discussionPosts.splice(index, 1);
    });

    return NextResponse.json(
      { message: "Discussion thread deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting discussion thread:", error);
    return NextResponse.json(
      { message: "Failed to delete discussion thread" },
      { status: 500 }
    );
  }
}
