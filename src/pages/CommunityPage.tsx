import { MessageCircle, Code2, Users, BookOpen } from 'lucide-react';

const channels = [
  { icon: MessageCircle, title: 'Discord Server', desc: 'Join 12,000+ curators and AI enthusiasts chatting about datasets, sharing tips, and getting help in real-time.', action: 'Join Discord' },
  { icon: Code2, title: 'GitHub Discussions', desc: 'Ask questions, share ideas, and collaborate on open source data tools and pipelines with the community.', action: 'Visit GitHub' },
  { icon: Users, title: 'Meetups & Events', desc: 'Local and virtual meetups in 15+ cities. Connect with fellow dataset builders in person.', action: 'View Events' },
  { icon: BookOpen, title: 'Community Blog', desc: 'Tutorials, case studies, and stories written by community members using Loseyourip.', action: 'Read Stories' },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main">Community</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-text-muted">
          Connect with thousands of curators, developers, and AI enthusiasts building datasets with Loseyourip.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {channels.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <c.icon size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-main">{c.title}</h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{c.desc}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary">{c.action} &rarr;</span>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-border bg-surface p-10 text-center">
        <h2 className="text-2xl font-bold text-text-main">Join the conversation</h2>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          Whether you are just getting started or curating at scale, there is a place for you.
        </p>
        <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 mt-6 font-semibold text-white no-underline transition-colors hover:bg-primary-dark">
          <MessageCircle size={16} /> Join our Discord
        </a>
      </div>
    </div>
  );
}
