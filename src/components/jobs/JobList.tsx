import type { Job } from '../../types';
import JobCard from './JobCard';
import { Briefcase } from 'lucide-react';

interface Props {
  jobs: Job[];
}

export default function JobList({ jobs }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-lighter mb-4">
          <Briefcase size={28} className="text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-main">No jobs found</h3>
        <p className="mt-1 text-sm text-text-muted">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
