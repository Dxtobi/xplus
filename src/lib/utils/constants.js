export const platforms = [
  { 
    name: 'YouTube', 
    domain: 'youtube.com', 
    icon: 'mdi:youtube', 
    color: '#ff0000' // Official brand color for recognition
  },
  { 
    name: 'Instagram', 
    domain: 'instagram.com', 
    icon: 'mdi:instagram',
    color: '#e1306c' // Official brand color
  },
  { 
    name: 'TikTok', 
    domain: 'tiktok.com', 
    icon: 'ic:baseline-tiktok',
    color: '#00f2ea' // A mix of the brand's cyan/pink
  },
  { 
    name: 'Twitter/X', 
    domain: 'twitter.com', 
    icon: 'pajamas:twitter', // Using the classic bird for better recognition
    color: '#1da1f2' // Official brand color
  },
  { 
    name: 'Facebook', 
    domain: 'facebook.com', 
    icon: 'mdi:facebook',
    color: '#1877f2' // Official brand color
  },
  { 
    name: 'LinkedIn', 
    domain: 'linkedin.com', 
    icon: 'mdi:linkedin',
    color: '#0a66c2' // Official brand color
  },
  { 
    name: 'Website', 
    domain: '', 
    icon: 'mdi:web',
    color: '#22c55e' // Primary app green
  },
  { 
    name: 'Other', 
    domain: '', 
    icon: 'mdi:link-variant',
    color: '#a3a3a3' // Neutral color
  }
];


export const actionTypes = [
  { 
    value: 'clicks', 
    label: 'Clicks', 
    icon: 'mdi:cursor-default-click-outline',
    color: '#22c55e', // Tailwind green-500
    cost:5
  },
  { 
    value: 'likes', 
    label: 'Likes', 
    icon: 'mdi:heart-outline',
    color: '#ef4444',
    cost:5
  },
  { 
    value: 'follows', 
    label: 'Follows', 
    icon: 'mdi:account-plus-outline',
    color: '#3b82f6' ,
    cost:15
  },
  { 
    value: 'views', 
    label: 'Views', 
    icon: 'mdi:eye-outline',
    color: '#8b5cf6' ,
    cost:5
  },
  { 
    value: 'comments', 
    label: 'Comments', 
    icon: 'mdi:message-outline',
    color: '#f97316',
     cost:15
  },
  { 
    value: 'shares', 
    label: 'Shares', 
    icon: 'mdi:share-outline',
    color: '#14b8a6',
     cost:15
  }
];

export const APP_PERCENTAGE_PER_DEPOSIT = 0.05
export const MIN_WITHDRAWAL = 5000;