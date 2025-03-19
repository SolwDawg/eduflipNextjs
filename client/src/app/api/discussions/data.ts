// Mock database for discussions
export const discussionThreads: DiscussionThread[] = [
  {
    threadId: "thread-1",
    title: "How do I solve quadratic equations?",
    content:
      "I'm struggling with quadratic equations in my algebra class. Can someone explain the steps to solve them?",
    creatorId: "user-1",
    creatorName: "John Doe",
    category: "Mathematics",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Open",
    tags: ["Algebra", "Quadratic Equations", "Mathematics"],
    viewCount: 124,
    responseCount: 3,
  },
  {
    threadId: "thread-2",
    title: "Book recommendations for AP Literature?",
    content:
      "I'm taking AP Literature next semester and want to get ahead on reading. What books would you recommend?",
    creatorId: "user-2",
    creatorName: "Emma Wilson",
    category: "Literature",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Open",
    tags: ["AP Literature", "Books", "Reading"],
    viewCount: 87,
    responseCount: 5,
  },
  {
    threadId: "thread-3",
    title: "Chemistry lab safety tips",
    content:
      "We're starting chemistry labs next week. What are some important safety tips I should keep in mind?",
    creatorId: "user-3",
    creatorName: "Alex Chen",
    category: "Science",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Open",
    tags: ["Chemistry", "Lab Safety", "Science"],
    viewCount: 45,
    responseCount: 2,
  },
];

export const discussionPosts: DiscussionPost[] = [
  {
    postId: "post-1",
    threadId: "thread-1",
    userId: "user-4",
    userName: "Sarah Johnson",
    content:
      "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a for the equation ax² + bx + c = 0. First, identify the values of a, b, and c, then plug them into the formula.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isAnswer: true,
    reactions: {
      likes: 15,
      helpful: 8,
    },
  },
  {
    postId: "post-2",
    threadId: "thread-1",
    userId: "user-5",
    userName: "Michael Brown",
    content:
      "Another method is factoring. If you can rewrite ax² + bx + c as (px + q)(rx + s), then the solutions are x = -q/p and x = -s/r.",
    images: ["/images/factoring-example.jpg"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isAnswer: false,
    reactions: {
      likes: 7,
      helpful: 5,
    },
  },
  {
    postId: "post-3",
    threadId: "thread-2",
    userId: "user-6",
    userName: "James Wilson",
    content:
      "For AP Literature, I'd recommend reading classics like 'To Kill a Mockingbird', 'The Great Gatsby', and '1984'. These are commonly discussed in the exam.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isAnswer: false,
    reactions: {
      likes: 12,
      helpful: 10,
    },
  },
];

export const discussionComments: DiscussionComment[] = [
  {
    commentId: "comment-1",
    postId: "post-1",
    userId: "user-1",
    userName: "John Doe",
    content: "Thanks! This really helped me understand.",
    createdAt: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    commentId: "comment-2",
    postId: "post-3",
    userId: "user-2",
    userName: "Emma Wilson",
    content:
      "I've already read The Great Gatsby, but I'll check out the others. Thanks!",
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
