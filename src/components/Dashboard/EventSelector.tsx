"use client";

import { CircularProgress, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface EventSelectorProps {
  calendarId: string;
  onSelect: (eventId: string) => void;
}

export default function EventSelector({
  calendarId,
  onSelect,
}: EventSelectorProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!calendarId) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/calendar/events?calendarId=${calendarId}`
        );
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("이벤트가 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [calendarId]);

  if (loading) return <CircularProgress />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <Select label="Select Event" onChange={(e) => onSelect(e.target.value)}>
        {events.map((event) => (
          <SelectItem key={event.id} value={event.id}>
            {event.summary || "No Title"} -{" "}
            {new Date(
              event.start.dateTime || event.start.date
            ).toLocaleString()}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
