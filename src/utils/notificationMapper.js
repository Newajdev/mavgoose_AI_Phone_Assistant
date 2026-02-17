import { formatDistanceToNowStrict } from "date-fns";

export const mapNotification = (n) => {
  return {
    id: n.id,
    title: n.title,
    description: n.message,
    type: n.category,
    unread: !n.is_read,
    time: formatDistanceToNowStrict(new Date(n.created_at), { addSuffix: true }),
    highPriority: false,
    store: n.store,
  };
};
