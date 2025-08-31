export default function Alert({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm border border-red-200 fade-in">
      {msg}
    </div>
  );
}
