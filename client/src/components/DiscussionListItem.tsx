"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface DiscussionListItemProps {
  thread: DiscussionThread;
}

const DiscussionListItem: React.FC<DiscussionListItemProps> = ({ thread }) => {
  return (
    <Link href={`/discussions/${thread.threadId}`}>
      <div className="discussion-list-item">
        <div className="discussion-list-item__header">
          <h3 className="discussion-list-item__title">{thread.title}</h3>
          <span
            className={`discussion-list-item__status discussion-list-item__status--${thread.status.toLowerCase()}`}
          >
            {thread.status}
          </span>
        </div>

        <p className="discussion-list-item__excerpt">
          {thread.content.length > 150
            ? `${thread.content.substring(0, 150)}...`
            : thread.content}
        </p>

        <div className="discussion-list-item__meta">
          <div className="discussion-list-item__meta-left">
            <Badge variant="outline" className="discussion-list-item__category">
              {thread.category}
            </Badge>
            <div className="discussion-list-item__tags">
              {thread.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="discussion-list-item__tag"
                >
                  {tag}
                </Badge>
              ))}
              {thread.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="discussion-list-item__tag"
                >
                  +{thread.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="discussion-list-item__meta-right">
            <div className="discussion-list-item__stat">
              <Eye className="discussion-list-item__icon" />
              <span>{thread.viewCount}</span>
            </div>
            <div className="discussion-list-item__stat">
              <MessageSquare className="discussion-list-item__icon" />
              <span>{thread.responseCount}</span>
            </div>
            <div className="discussion-list-item__creator">
              <span className="discussion-list-item__creator-name">
                {thread.creatorName}
              </span>
              <span className="discussion-list-item__created-at">
                {formatDistanceToNow(new Date(thread.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DiscussionListItem;
