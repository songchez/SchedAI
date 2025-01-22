// "use client";

// import { CircularProgress, Select, SelectItem } from "@heroui/react";
// import { useEffect, useState } from "react";

// interface CalendarEvent {
//   id: string;
//   summary?: string;
//   start: {
//     dateTime?: string;
//     date?: string;
//   };
// }

// interface EventSelectorProps {
//   calendarId: string;
//   onSelect: (eventId: string) => void;
// }

// export default function EventSelector({
//   calendarId,
//   onSelect,
// }: EventSelectorProps) {
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!calendarId) return;

//     const fetchEvents = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // 쿼리 파라미터 방식으로 calendarId를 전달합니다.
//         const res = await fetch(`/api/calendar?calendarId=${calendarId}`);

//         // 응답이 실패했는지 확인
//         if (!res.ok) {
//           const errorData = await res.json();
//           // 서버에서 { error: "..." } 형태로 내려보낸 경우 처리
//           setError(
//             errorData.error ?? "이벤트를 불러오는 중 오류가 발생했습니다."
//           );
//           return;
//         }

//         // 응답이 성공적인 경우 데이터 파싱
//         const data = await res.json();

//         // 서버에서 오류 메시지를 보냈는지(NextResponse.json({ error: ... })) 체크
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setEvents(data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch events:", err);
//         setError("이벤트를 불러오는 중 예기치 못한 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [calendarId]);

//   if (loading) return <CircularProgress />;
//   if (error) return <p className="text-sm text-red-500">{error}</p>;

//   return (
//     <Select label="Select Event" onChange={(e) => onSelect(e.target.value)}>
//       {events.map((event) => (
//         <SelectItem key={event.id} value={event.id}>
//           {event.summary || "No Title"}
//         </SelectItem>
//       ))}
//     </Select>
//   );
// }
