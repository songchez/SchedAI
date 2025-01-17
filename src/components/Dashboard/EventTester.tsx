"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CalendarSelector from "./CalendarSelector";
import EventSelector from "./EventSelector";

export default function EventTester() {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
  });
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [response, setResponse] = useState(null);

  const handleApiRequest = async (
    endpoint: string,
    method: string,
    body: any = null
  ) => {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("API Request Failed:", error);
    }
  };

  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Event API Tester</h2>

      <CalendarSelector onSelect={setSelectedCalendarId} userId={userId} />
      <EventSelector
        onSelect={setSelectedEventId}
        calendarId={selectedCalendarId}
        userId={userId}
      />

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Event Details</h2>
        {["title", "description", "start", "end"].map((field) => (
          <div key={field} className="mb-2">
            <label className="block text-sm font-medium mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field.includes("Time") ? "datetime-local" : "text"}
              className="border rounded w-full p-2"
              value={eventDetails[field as keyof typeof eventDetails]}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, [field]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { label: "Get Calendars/Events", method: "GET" },
          { label: "Add Event", method: "POST" },
          { label: "Update Event", method: "PUT" },
          { label: "Delete Event", method: "DELETE" },
        ].map((btn) => (
          <button
            key={btn.label}
            className={`bg-${
              btn.method === "DELETE"
                ? "red"
                : btn.method === "PUT"
                ? "yellow"
                : btn.method === "POST"
                ? "green"
                : "blue"
            }-500 text-white px-4 py-2 rounded`}
            onClick={() =>
              handleApiRequest(`/api/calendar`, btn.method, {
                userId,
                selectedCalendarId,
                selectedEventId,
                eventDetails,
              })
            }
          >
            {btn.label}
          </button>
        ))}
      </div>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">API Response</h3>
          <pre className="text-sm bg-gray-200 p-2 rounded">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
