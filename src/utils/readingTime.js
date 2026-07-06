const calculateReadingTime = (content) => {
  if (!content || typeof content !== 'string') return 1;

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export { calculateReadingTime };
