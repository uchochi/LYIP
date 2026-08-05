import { supabase } from '../lib/supabase';
import type { ForumTopic, ForumPost, ForumReaction } from '../types';

const USER_SELECT = 'user:users(name, username, avatar_url, avatar_color, role)';

// --- Forum Topics ---

export async function getTopics(tag?: string): Promise<ForumTopic[]> {
  let query = supabase
    .from('forum_topics')
    .select(`*, ${USER_SELECT}`)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getTopic(id: string): Promise<ForumTopic | undefined> {
  const { data, error } = await supabase
    .from('forum_topics')
    .select(`*, ${USER_SELECT}`)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data || undefined;
}

export async function createTopic(topic: { title: string; content: string; tags?: string[]; has_dataset_submit?: boolean }): Promise<ForumTopic> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not authenticated');

  const authorId = userData.user.id;

  const { data, error } = await supabase.from('forum_topics').insert({
    title: topic.title,
    content: topic.content,
    author_id: authorId,
    tags: topic.tags || [],
    has_dataset_submit: topic.has_dataset_submit || false,
  }).select(`*, ${USER_SELECT}`).single();

  if (error) throw error;
  return data;
}

export async function updateTopic(id: string, updates: Partial<Pick<ForumTopic, 'title' | 'content' | 'tags' | 'is_pinned' | 'is_archived' | 'is_locked'>>): Promise<ForumTopic> {
  const row: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('forum_topics').update(row).eq('id', id).select(`*, ${USER_SELECT}`).single();
  if (error) throw error;
  return data;
}

export async function deleteTopic(id: string): Promise<boolean> {
  const { error } = await supabase.from('forum_topics').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Forum Posts ---

export async function getPosts(topicId: string): Promise<ForumPost[]> {
  const { data, error } = await supabase
    .from('forum_posts')
    .select(`*, ${USER_SELECT}`)
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createPost(post: { topic_id: string; content: string; parent_id?: string | null; sticker_url?: string | null }): Promise<ForumPost> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase.from('forum_posts').insert({
    topic_id: post.topic_id,
    author_id: userData.user.id,
    content: post.content,
    parent_id: post.parent_id || null,
    sticker_url: post.sticker_url || null,
  }).select(`*, ${USER_SELECT}`).single();

  if (error) throw error;
  return data;
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase.from('forum_posts').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Reactions ---

export async function getReactions(postIds: string[]): Promise<Record<string, ForumReaction[]>> {
  if (postIds.length === 0) return {};
  const { data, error } = await supabase
    .from('forum_post_reactions')
    .select('*')
    .in('post_id', postIds);
  if (error) throw error;
  const map: Record<string, ForumReaction[]> = {};
  for (const r of data || []) {
    if (!map[r.post_id]) map[r.post_id] = [];
    map[r.post_id].push(r);
  }
  return map;
}

export async function toggleReaction(postId: string, emoji: string): Promise<void> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error('Not authenticated');

  const uid = userData.user.id;

  const { data: existing, error: selError } = await supabase
    .from('forum_post_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', uid)
    .eq('emoji', emoji)
    .maybeSingle();
  if (selError) throw selError;

  if (existing) {
    const { error } = await supabase.from('forum_post_reactions').delete().eq('id', existing.id);
    if (error) throw error;
  } else {
    // The UNIQUE(post_id,user_id,emoji) constraint protects against races.
    const { error } = await supabase.from('forum_post_reactions').insert({
      post_id: postId,
      user_id: uid,
      emoji,
    });
    if (error) throw error;
  }
}

// --- Community Stats ---

export async function getMemberCount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_member_count');
  if (error) return 115000;
  return data || 115000;
}

export async function getOnlineCount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_online_count');
  if (error) return 5000;
  return data || 5000;
}

export async function incrementTopicView(topicId: string): Promise<void> {
  const viewed = sessionStorage.getItem(`viewed_${topicId}`);
  if (viewed) return;
  sessionStorage.setItem(`viewed_${topicId}`, '1');
  await supabase.rpc('increment_topic_view_simple', { topic_id: topicId });
}

export async function updateUserLastSeen(): Promise<void> {
  await supabase.rpc('update_user_last_seen');
}

// --- Top Contributors ---

export interface TopContributor {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  avatar_color: string;
  post_count: number;
}

export async function getTopContributors(): Promise<TopContributor[]> {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('author_id, user:users(name, username, avatar_url, avatar_color)')
    .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !data) return [];

  const counts: Record<string, { count: number; user: Record<string, unknown> }> = {};
  for (const row of data) {
    if (!counts[row.author_id]) {
      counts[row.author_id] = { count: 0, user: (row as Record<string, unknown>).user as Record<string, unknown> || {} };
    }
    counts[row.author_id].count++;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12)
    .map(([id, info]) => ({
      id,
      name: (info.user.name as string) || '',
      username: (info.user.username as string) || '',
      avatar_url: (info.user.avatar_url as string) || '',
      avatar_color: (info.user.avatar_color as string) || '',
      post_count: info.count,
    }));
}

// --- Dataset Submissions ---

export interface DatasetSubmission {
  id: string;
  topic_id: string;
  user_id: string;
  title: string;
  content: string;
  url?: string;
  file_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getDatasetSubmissions(topicId: string): Promise<DatasetSubmission[]> {
  const { data, error } = await supabase
    .from('dataset_submissions')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createDatasetSubmission(submission: { topic_id: string; title: string; content: string; url?: string }): Promise<DatasetSubmission> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase.from('dataset_submissions').insert({
    topic_id: submission.topic_id,
    user_id: userData.user.id,
    title: submission.title,
    content: submission.content,
    url: submission.url || null,
  }).select('*').single();

  if (error) throw error;
  return data;
}

export async function updateSubmissionStatus(id: string, status: 'approved' | 'rejected', notes?: string): Promise<void> {
  const { error } = await supabase.from('dataset_submissions').update({ status, admin_notes: notes }).eq('id', id);
  if (error) throw error;
}

// --- Quiz ---

export async function saveQuizResponse(answers: object): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id || null;
  const { error } = await supabase.from('quiz_responses').insert({
    user_id: userId,
    answers,
  });
  if (error) {
    // Non-fatal — quiz still works via localStorage
    console.warn('Could not save quiz response:', error.message);
  }
}
