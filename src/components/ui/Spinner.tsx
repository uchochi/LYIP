export default function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className="border-4 border-surface-lighter border-t-primary rounded-full animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
