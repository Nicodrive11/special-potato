// src/components/StatusBanner.tsx
interface StatusBannerProps {
  status: string;
}

export default function StatusBanner({ status }: StatusBannerProps) {
  if (!status) return null;

  const isSuccess = status.includes('✅');
  
  return (
    <div className={`mt-2 p-3 border rounded-md text-sm ${
      isSuccess 
        ? 'bg-green-100 border-green-400 text-green-700' 
        : 'bg-yellow-100 border-yellow-400 text-yellow-700'
    }`}>
      {status}
    </div>
  );
}