export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100/20 to-indigo-100/20 blur-3xl dark:from-blue-900/10 dark:to-indigo-900/10" />
      <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-violet-100/20 to-purple-100/20 blur-3xl dark:from-violet-900/10 dark:to-purple-900/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-slate-100/10 to-gray-100/10 blur-3xl dark:from-slate-800/5 dark:to-gray-800/5" />
    </div>
  );
}