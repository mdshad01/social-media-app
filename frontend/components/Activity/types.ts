export type ActivityTypeValue = "all" | "post" | "comment" | "like" | "follow";

export type ActivityTypeProps = {
  activityType: ActivityTypeValue;
  setType: (type: ActivityTypeValue) => void;
};
