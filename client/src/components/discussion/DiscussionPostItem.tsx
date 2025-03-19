import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DiscussionPostItemProps {
  post: DiscussionPost;
  onClick: () => void;
}

const DiscussionPostItem: React.FC<DiscussionPostItemProps> = ({
  post,
  onClick,
}) => {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="discussion-post" onClick={onClick}>
      <div className="discussion-post__header">
        <div className="discussion-post__user">
          <Avatar className="discussion-post__avatar">
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback className="discussion-post__avatar-fallback">
              {post.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="discussion-post__username">{post.userName}</span>
        </div>
        <span className="discussion-post__date">{formattedDate}</span>
      </div>

      <div className="discussion-post__content">
        <h3 className="discussion-post__title">{post.title}</h3>
        <p className="discussion-post__text">{post.content}</p>
      </div>

      <div className="discussion-post__footer">
        <div className="discussion-post__replies">
          <MessageSquare className="discussion-post__replies-icon" />
          <span>
            {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPostItem;
