import React from 'react';
import IconBadge from './IconBadge';
import activityData from '../content/activities.json';

// Shows the same icon as the activity picked when the event was created, matched by the event's tag
export default function ActivityIcon({
    tag = "",
    size,
    className
}) {
    // const activity = (activityData.activities || []).find((item) => item.title === tag);
    const allTypes = [...(activityData.activities || []), activityData.others];
    const activity = allTypes.find((item) => item?.title === tag);

    return <IconBadge icon={activity?.icon} color={activity?.color} size={size} className={className} />;
}
