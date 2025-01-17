"use client";

import { CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface CalendarSelectorProps {
  userId: string;
  onSelect: (calendarId: string) => void;
}

export default function CalendarSelector({
  userId,
  onSelect,
}: CalendarSelectorProps) {
  const [calendars, setCalendars] = useState<{ id: string; summary: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendars = async () => {
      if (!userId) {
        setError("User ID is required to load calendars.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/calendar?userId=${userId}`);
        const data = await res.json();
        setCalendars(data);
      } catch (err) {
        console.error("Failed to fetch calendars:", err);
        setError("Failed to fetch calendars.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Calendar</label>

      <select
        className="border rounded w-full p-2"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Select Calendar --</option>
        {calendars.map((calendar) => (
          <option key={calendar.id} value={calendar.id}>
            {calendar.summary}
          </option>
        ))}
      </select>
    </div>
  );
}
