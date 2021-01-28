export interface Activity {
  activityCode: string;
  description: string;
  displayName?: string;
}

export const activities: Activity[] = [
  {
    activityCode: '091',
    description: 'Travel period to detached test centre and /or out station',
    displayName: 'Travel',
  },
  {
    activityCode: '094',
    description: ' Motorcycle maintenance/cleaning',
  },
  {
    activityCode: '096',
    description: ' Motorcycle changeover period',
  },
  {
    activityCode: '142',
    description: 'Personal development',
  },
];
