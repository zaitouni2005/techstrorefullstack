export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
        <span className="text-2xl font-bold">!</span>
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        Cette page est en cours de développement. Elle permettra bientôt de gérer les{" "}
        {title.toLowerCase()}.
      </p>
    </div>
  );
}
