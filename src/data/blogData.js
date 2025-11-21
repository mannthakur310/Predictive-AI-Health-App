export const blogPosts = [
  {
    id: 'hands-only-cpr',
    type: 'video',
    title: 'Hands-Only CPR Instruction',
    excerpt: 'Learn the two simple steps to save a life with Hands-Only CPR. No mouth-to-mouth required. Essential emergency skill everyone should know.',
    videoId: 'M4ACYp75mjU',
    thumbnail: 'https://img.youtube.com/vi/M4ACYp75mjU/maxresdefault.jpg',
    tags: ['Emergency Care', 'First Aid'],
    updatedAt: '2024-11-15T10:00:00.000Z',
    channel: 'American Heart Association',
  },
  {
    id: 'mayo-clinic-nutrition',
    type: 'video',
    title: 'Mayo Clinic: Healthy Eating Basics',
    excerpt: 'Discover essential nutrition tips from Mayo Clinic experts. Learn about balanced meals, portion control, and making healthy food choices.',
    videoId: 'yBEww8MlrEg',
    thumbnail: 'https://img.youtube.com/vi/yBEww8MlrEg/maxresdefault.jpg',
    tags: ['Nutrition', 'Wellness'],
    updatedAt: '2024-12-01T14:30:00.000Z',
    channel: 'Mayo Clinic',
  },
  {
    id: 'heart-health-exercise',
    type: 'video',
    title: 'Heart-Healthy Exercise Routine',
    excerpt: 'Cardiovascular exercises to strengthen your heart and improve circulation. Safe workout routines for all fitness levels from Cleveland Clinic.',
    videoId: 'JIXkf_i3kG0',
    thumbnail: 'https://img.youtube.com/vi/JIXkf_i3kG0/maxresdefault.jpg',
    tags: ['Exercise', 'Cardiovascular'],
    updatedAt: '2024-11-20T09:15:00.000Z',
    channel: 'Cleveland Clinic',
  },
  {
    id: 'stress-management-techniques',
    type: 'video',
    title: 'Stress Management Techniques',
    excerpt: 'Practical techniques to reduce stress and anxiety. Learn breathing exercises, mindfulness practices, and lifestyle changes for better mental wellness.',
    videoId: 'CUaLqoYOUc8',
    thumbnail: 'https://img.youtube.com/vi/CUaLqoYOUc8/maxresdefault.jpg',
    tags: ['Mental Health', 'Wellness'],
    updatedAt: '2024-11-28T16:45:00.000Z',
    channel: 'Mayo Clinic',
  },
  {
    id: 'sleep-improvement-tips',
    type: 'video',
    title: 'Tips for Better Sleep',
    excerpt: 'Evidence-based strategies for improving sleep quality. Learn about sleep hygiene, creating the right environment, and establishing healthy sleep patterns.',
    videoId: 'mpwBpNhal_M',
    thumbnail: 'https://img.youtube.com/vi/mpwBpNhal_M/maxresdefault.jpg',
    tags: ['Sleep', 'Health'],
    updatedAt: '2024-11-25T11:20:00.000Z',
    channel: 'Cleveland Clinic',
  },
  {
    id: 'diabetes-prevention-guide',
    type: 'video',
    title: 'Type 2 Diabetes Prevention',
    excerpt: 'Important information about preventing Type 2 diabetes through diet, exercise, and lifestyle modifications. Learn about early warning signs and risk factors.',
    videoId: 'V-1bOCr2XK8',
    thumbnail: 'https://img.youtube.com/vi/V-1bOCr2XK8/maxresdefault.jpg',
    tags: ['Diabetes', 'Prevention'],
    updatedAt: '2024-12-05T08:00:00.000Z',
    channel: 'Mayo Clinic Health System',
  },
];

export const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
};

export const getYouTubeWatchUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};
