"use client";

import { useEffect, useState } from "react";

interface EventSelectorProps {
  userId: string;
  calendarId: string;
  onSelect: (eventId: string) => void;
}

export default function EventSelector({
  userId,
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
          `/api/calendar/events?userId=${userId}&calendarId=${calendarId}`
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
  }, [calendarId, userId]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Event</label>
      <select
        className="border rounded w-full p-2"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Select Event --</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.summary || "No Title"} -{" "}
            {new Date(
              event.start.dateTime || event.start.date
            ).toLocaleString()}
          </option>
        ))}
      </select>
    </div>
  );
}
