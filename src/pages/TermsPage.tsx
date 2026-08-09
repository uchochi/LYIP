const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using the Loseyourip platform, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. We may update these terms; continued use constitutes acceptance of changes.' },
  { title: 'Description of Service', content: 'Loseyourip provides a dataset curation platform for building high-quality training data for artificial intelligence. Our services include dataset cleaning, language alignment, structuring, labelling, and human quality review.' },
  { title: 'Account Registration', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.' },
  { title: 'Acceptable Use', content: 'You may not submit harmful, illegal, or misleading data; to circumvent our review process; to misrepresent dataset quality; or to violate any applicable laws. We reserve the right to suspend access for violations.' },
  { title: 'Submission and Review', content: 'Submitted datasets are reviewed by our team against our quality standards. Reviewers may request revisions or reject a submission. Approved datasets may be used in AI training corpora as described in the curator agreement.' },
  { title: 'Pricing and Payment', content: 'Curators are paid per approved dataset at the rate shown for each task (e.g. $50–$100 per dataset). Payment is processed after quality review and approval. All payouts are subject to applicable law.' },
  { title: 'Intellectual Property', content: 'Loseyourip retains all rights to its platform and technology. You retain ownership of the datasets you submit and grant Loseyourip a license to use approved datasets for AI training as described in the curator agreement.' },
  { title: 'Disclaimer of Warranties', content: 'Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. Datasets are reviewed for quality but we do not guarantee fitness for any particular purpose.' },
  { title: 'Limitation of Liability', content: 'Loseyourip shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.' },
  { title: 'Termination', content: 'Either party may terminate this agreement at any time. Upon termination, your access to our services will cease. We may retain your data as required by law or for legitimate business purposes.' },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-text-main">Terms of Service</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: July 1, 2026</p>
      <p className="mt-6 text-text-muted leading-relaxed">
        These Terms of Service govern your use of the Loseyourip platform and services. Please read them carefully before using our platform.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-text-main">{s.title}</h2>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{s.content}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 border-t border-border pt-6 text-sm text-text-muted">
        Questions about these terms? Contact us at <span className="text-primary">legal@loseyourip.com</span>
      </p>
    </div>
  );
}
