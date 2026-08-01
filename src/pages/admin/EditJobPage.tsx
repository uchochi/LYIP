import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import JobForm from '../../components/jobs/JobForm';
import type { Job } from '../../types';

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs, updateJob } = useJobs();
  const navigate = useNavigate();
  const job = jobs.find((j) => j.id === id);

  if (!job) return <Navigate to="/admin" replace />;

  const handleSubmit = async (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    await updateJob(id!, data);
    navigate('/admin');
  };

  return (
    <div className="w-full px-6 py-10">
      <h1 className="text-2xl font-bold text-text-main mb-2">Edit Job</h1>
      <p className="text-sm text-text-muted mb-8">Update the details for &ldquo;{job.title}&rdquo;</p>
      <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm">
        <JobForm initialData={job} onSubmit={handleSubmit} onCancel={() => navigate('/admin')} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
