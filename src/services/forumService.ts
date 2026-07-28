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

export async function createTopic(topic: { title: string; content: string; tags?: string[] }): Promise<ForumTopic> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not authenticated');

  const authorId = userData.user.id;

  const { data, error } = await supabase.from('forum_topics').insert({
    title: topic.title,
    content: topic.content,
    author_id: authorId,
    tags: topic.tags || [],
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
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const existing = await supabase
    .from('forum_post_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userData.user.id)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing.data) {
    await supabase.from('forum_post_reactions').delete().eq('id', existing.data.id);
  } else {
    await supabase.from('forum_post_reactions').insert({
      post_id: postId,
      user_id: userData.user.id,
      emoji,
    });
  }
}

// --- Community Stats ---

export async function getMemberCount(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count || 0;
}
