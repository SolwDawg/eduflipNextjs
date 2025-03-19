import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { discussionThreads, discussionPosts } from "../../data";
import { v4 as uuidv4 } from "uuid";

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

    // Get all posts for this thread
    const posts = discussionPosts.filter((p) => p.threadId === threadId);

    return NextResponse.json(
      {
        message: "Success",
        data: posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    // Get user info from Clerk (in a real app)
    const userData = {
      id: userId,
      name: body.userName || "Anonymous Student", // In a real app, get from Clerk
    };

    // Create new post
    const newPost: DiscussionPost = {
      postId: uuidv4(),
      threadId,
      userId: userData.id,
      userName: userData.name,
      content: body.content,
      images: body.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAnswer: false,
      reactions: {
        likes: 0,
        helpful: 0,
      },
    };

    // Add to our mock database
    discussionPosts.push(newPost);

    // Update the response count on the thread
    discussionThreads[threadIndex].responseCount += 1;

    return NextResponse.json(
      {
        message: "Post created successfully",
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  }
}
