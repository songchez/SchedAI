"use client";

import { useState } from "react";
import { parseDate } from "@internationalized/date";
import { Button, DatePicker, Input } from "@nextui-org/react";
import CalendarSelector from "./CalendarSelector";
import EventSelector from "./EventSelector";

export default function CalendarEventHandler() {
  const [eventDetails, setEventDetails] = useState({
    summary: "",
    location: "",
    description: "",
    start: { date: "" },
    end: { date: "" },
  });
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [response, setResponse] = useState(null);

  // RequestBody : 요청을 보내는 body의 type 지정
  // CalendarEventHandleApiRequest : 캘린더 이벤트 API요청을 보내는 함수
  interface RequestBody {
    calendarId: string;
    eventId?: string;
    eventDetails: {
      summary: string;
      location?: string;
      description?: string;
      start: { date: string };
      end: { date: string };
    };
  }

  const CalendarEventHandleApiRequest = async (
    endpoint: string,
    method: string,
    body: RequestBody
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

  // 렌더부분 : 캘린더와 이벤트 셀렉터의 선택(CalendarSelector,EventSelector)이후 폼 입력.
  // 이벤트가 하나 이상 있을경우, Delete, Put 버튼 등장. userID는 route.ts에서 처리
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Event API Tester</h2>
      <div className="flex flex-col gap-3">
        <CalendarSelector onSelect={setSelectedCalendarId} />
        {selectedCalendarId && (
          <EventSelector
            onSelect={setSelectedEventId}
            calendarId={selectedCalendarId}
          />
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Event Details</h2>
        {["summary", "location", "description"].map((field) => (
          <div key={field} className="mb-2">
            <Input
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type="text"
              value={eventDetails[field as keyof typeof eventDetails] as string}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  [field]: e.target.value,
                })
              }
            />
          </div>
        ))}
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <DatePicker
            label="Start"
            selectorButtonPlacement="start"
            value={
              eventDetails.start.date
                ? parseDate(eventDetails.start.date)
                : null
            }
            onChange={(date) =>
              setEventDetails({
                ...eventDetails,
                start: { date: date ? date.toString().split("T")[0] : "" },
              })
            }
          />
          <DatePicker
            label="End"
            selectorButtonPlacement="end"
            value={
              eventDetails.end.date ? parseDate(eventDetails.end.date) : null
            }
            onChange={(date) =>
              setEventDetails({
                ...eventDetails,
                end: { date: date ? date.toString().split("T")[0] : "" },
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-4">
        {[
          { label: "Add Event", method: "POST" },
          { label: "Update Event", method: "PUT" },
          { label: "Delete Event", method: "DELETE" },
        ].map(({ label, method }) => (
          <Button
            key={label}
            className={`${
              method === "DELETE"
                ? `${selectedEventId ? "" : "hidden"} bg-red-500`
                : method === "POST"
                ? "bg-green-500"
                : `${selectedEventId ? "" : "hidden"} bg-blue-500`
            } text-white bg-opacity-60`}
            onPress={() =>
              CalendarEventHandleApiRequest(`/api/calendar`, method, {
                calendarId: selectedCalendarId,
                eventId: selectedEventId,
                eventDetails,
              })
            }
          >
            {label}
          </Button>
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
