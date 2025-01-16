import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI API 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 환경 변수에서 API 키 로드
});

export async function POST(request: Request) {
  try {
    // 요청 바디에서 메시지 데이터 가져오기
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format. 'messages' should be an array." },
        { status: 400 }
      );
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 사용할 모델
      messages: [
        {
          role: "system",
          content:
            "You act as a personal assistant for users, helping them manage their schedules. Your primary task is to interpret user requests and generate precise queries to interact with Google Calendar. Ensure the queries are formatted correctly for actions such as adding, modifying, deleting, or retrieving events. Maintain a clear and professional tone while ensuring user requirements are accurately represented in the queries.",
        }, // 시스템 초기 메시지
        ...messages, // 클라이언트에서 전달받은 사용자 메시지
      ],
    });

    // OpenAI 응답 반환
    return NextResponse.json({
      completion: completion.choices[0]?.message?.content || "No response",
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
