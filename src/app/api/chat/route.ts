import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { LanguageModelV1, streamText, ToolInvocation } from "ai";
import { z } from "zod";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

// Allow streaming responses up to 30 seconds
export const MAX_DURATION = 30;

// 모델 키 상수 정의
const MODEL_KEYS = {
  GEMINI: "gemini-2.0-flash-exp",
  GPT4_MINI: "gpt-4o-mini",
} as const;

// 모델 제공자 매핑 함수
const getModelWithProvider = (model: string): LanguageModelV1 => {
  const providers: Record<string, () => LanguageModelV1> = {
    [MODEL_KEYS.GEMINI]: () => google(model),
    [MODEL_KEYS.GPT4_MINI]: () => openai(model),
  };

  const provider = providers[model];
  if (!provider) throw new Error(`Unsupported model: ${model}`);
  return provider();
};

// POST 핸들러
export async function POST(req: Request): Promise<Response> {
  const { messages, model }: { messages: Message[]; model: string } =
    await req.json();

  // Calendar API와 TaskAPI를 호출하기 위한 BaseUrl 동적으로 가져옴
  const url = new URL(req.url);
  const baseURL = `${url.protocol}//${url.host}`;
  const cookie = req.headers.get("cookie");

  // 캘린더 가져오기
  const getCalendars = async () => {
    try {
      const res = await fetch(`${baseURL}/api/calendar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      return { calendars: data };
    } catch (err) {
      console.error("Failed to fetch calendars:", err);
    }
  };

  if (!messages || !model) {
    return new Response("Invalid request payload", { status: 400 });
  }

  const modelWithProvider = getModelWithProvider(model);
  const today = new Date();

  const result = streamText({
    model: modelWithProvider,
    system: `
        You are SchedAI
        And today is ${today}
      `,
    messages,
    tools: {
      // getWeather: {
      //   description: "Get the weather for a location",
      //   parameters: z.object({
      //     city: z.string().describe("The city to get the weather for"),
      //     unit: z
      //       .enum(["C", "F"])
      //       .describe("The unit to display the temperature in"),
      //   }),
      //   execute: async ({ city, unit }) => {
      //     try {
      //       const weather = {
      //         value: 24,
      //         description: "Sunny",
      //       };

      //       return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
      //     } catch (error) {
      //       console.error("Error fetching weather data:", error);
      //       return "An error occurred while fetching weather data.";
      //     }
      //   },
      // },
      //
      // .optional()을 객체형 그 자체에 넣으면 오류남, 가장 lower type에다가 추가해야함
      getCalendars: {
        description: "Get the Calendars of the user",
        parameters: z.object({}),
        execute: async () => {
          const { calendars } = await getCalendars();
          return `당신의 캘린더는 ${calendars
            .map((calendar: any) => `${calendar}와 `)
            .join("")}`;
        },
      },

      calendarTool: {
        description: "Manage calendar events and get calendarlist",
        parameters: z.object({
          method: z
            .enum(["POST", "PUT", "DELETE"])
            .describe("HTTP method for the calendar action"),
          body: z.object({
            eventId: z.string().optional(),
            eventDetails: z.object({
              summary: z.string().optional(),
              descrtption: z.string().optional(),
              start: z.object({ date: z.string().optional() }),
              end: z.object({ date: z.string().optional() }),
            }),
          }),
        }),
        execute: async ({ method, body }: any) => {
          try {
            const calendars = await getCalendars();
            console.log(calendars[0].id, body.eventDetails);
            let response;
            if (calendars[0].id && body.eventId) {
              response = await fetch(`${baseURL}/api/calendar`, {
                method,
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  calendarId: body.calendarId,
                  eventDetails: body.eventDetails,
                  eventId: body.eventId,
                }),
              });
            } else {
              response = await fetch(`${baseURL}/api/calendar`, {
                method,
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  calendarId: body.calendarId,
                  eventDetails: body.eventDetails,
                }),
              });
            }

            console.log(response.json);

            if (!response.ok) {
              throw new Error(`Calendar API error: ${response.statusText}`);
            }

            return await response.json();
          } catch (error) {
            console.error("Error managing calendar event:", error);
            return "An error occurred while managing the calendar event.";
          }
        },
      },
      taskTool: {
        description: "Manage tasks",
        parameters: z.object({
          method: z
            .enum(["GET", "POST", "PATCH", "DELETE"])
            .describe("HTTP method for the task action"),
          details: z.object({
            title: z.string(),
            dueDate: z.string(),
            notes: z.string(),
            taskId: z.string(),
          }),
        }),
        execute: async ({ method, details }: any) => {
          try {
            const response = await fetch(`${baseURL}/api/task`, {
              method,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(details),
            });

            if (!response.ok) {
              throw new Error(`Task API error: ${response.statusText}`);
            }

            return await response.json();
          } catch (error) {
            console.error("Error managing task:", error);
            return "An error occurred while managing the task.";
          }
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
