export interface DatasetCategory {
  slug: string;
  label: string;
  emoji: string;
  blurb: string;
}

/**
 * The category list shown in the submission selector.
 * The `other` slug reveals a free-text "custom category" input.
 */
export const DATASET_CATEGORIES: DatasetCategory[] = [
  { slug: 'jokes-comedy-memes', label: 'Jokes / Comedy / Memes', emoji: '😂', blurb: 'Humor, jokes, meme captions' },
  { slug: 'health-fitness', label: 'Health & Fitness', emoji: '💪', blurb: 'Wellness, workouts, nutrition' },
  { slug: 'tech-innovation', label: 'Tech & Innovation', emoji: '🚀', blurb: 'Technology, AI, engineering' },
  { slug: 'education-learning', label: 'Education & Learning', emoji: '📚', blurb: 'Tutorials, courses, academic' },
  { slug: 'business-finance', label: 'Business & Finance', emoji: '💼', blurb: 'Markets, startups, money' },
  { slug: 'entertainment', label: 'Entertainment', emoji: '🎬', blurb: 'Movies, music, pop culture' },
  { slug: 'science', label: 'Science', emoji: '🔬', blurb: 'Research, facts, discoveries' },
  { slug: 'history-culture', label: 'History & Culture', emoji: '🏛️', blurb: 'Heritage, traditions, events' },
  { slug: 'lifestyle', label: 'Lifestyle', emoji: '🌿', blurb: 'Daily life, travel, food' },
  { slug: 'sports', label: 'Sports', emoji: '⚽', blurb: 'Games, athletes, scores' },
  { slug: 'other', label: 'Other', emoji: '✨', blurb: 'Type your own category' },
];

export const OTHER_SLUG = 'other';

export function categoryLabel(slug: string, custom?: string | null): string {
  if (slug === OTHER_SLUG) return custom?.trim() || 'Other';
  return DATASET_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
}

export function categoryEmoji(slug: string): string {
  return DATASET_CATEGORIES.find((c) => c.slug === slug)?.emoji || '📦';
}
