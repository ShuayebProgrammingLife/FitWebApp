export default function Spinner ( {label} : { label:string}){
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 text-sm text-muted">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent"></span>
      {label}
    </div>
  )
}