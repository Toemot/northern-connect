import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/types/database";

interface EventCardProps {
  event: Event & { organization_name?: string };
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_datetime);
  const day = startDate.toLocaleDateString("en-CA", { day: "numeric" });
  const month = startDate.toLocaleDateString("en-CA", { month: "short" });

  return (
    <article className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Date block */}
      <div
        className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 py-2"
        aria-label={`${month} ${day}`}
      >
        <span className="text-xs font-bold uppercase text-brand-500">{month}</span>
        <span className="text-2xl font-bold leading-tight text-brand-700">{day}</span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900">{event.title}</h2>
          {event.is_free && <Badge variant="green" className="shrink-0">Free</Badge>}
        </div>

        {event.organization_name && (
          <p className="mt-0.5 text-sm text-gray-500">{event.organization_name}</p>
        )}

        <p className="mt-1 text-sm text-gray-600">
          {formatDate(event.start_datetime)} · {formatTime(event.start_datetime)}
          {event.end_datetime && ` – ${formatTime(event.end_datetime)}`}
        </p>

        {event.location_name && (
          <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5 text-gray-400" aria-hidden />
            {event.location_name}
          </p>
        )}

        {event.recurrence !== "one_time" && (
          <Badge variant="blue" className="mt-2 capitalize">
            {event.recurrence}
          </Badge>
        )}
      </div>
    </article>
  );
}
