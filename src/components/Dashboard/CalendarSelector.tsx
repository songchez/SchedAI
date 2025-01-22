// "use client";

// import { CircularProgress, Select, SelectItem } from "@heroui/react";
// import { useEffect, useState } from "react";

// interface CalendarSelectorProps {
//   onSelect: (calendarId: string) => void;
// }

// export default function CalendarSelector({ onSelect }: CalendarSelectorProps) {
//   const [calendars, setCalendars] = useState<{ id: string; summary: string }[]>(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCalendars = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // userId는 route.ts에서 처리
//         const res = await fetch(`/api/calendar`);
//         const data = await res.json();
//         setCalendars(data);
//       } catch (err) {
//         console.error("Failed to fetch calendars:", err);
//         setError("Failed to fetch calendars.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCalendars();
//   }, []);

//   if (loading) return <CircularProgress />;
//   if (error) return <p className="text-sm text-red-500">{error}</p>;

//   return (
//     <div>
//       <Select
//         label="Select Calendar"
//         onChange={(e) => onSelect(e.target.value)}
//       >
//         {calendars.map((calendar) => (
//           <SelectItem key={calendar.id} value={calendar.id}>
//             {calendar.summary}
//           </SelectItem>
//         ))}
//       </Select>
//     </div>
//   );
// }
