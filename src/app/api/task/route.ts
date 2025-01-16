import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/auth";

// Google Tasks 클라이언트 생성
async function createTasksClient(userToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({ access_token: userToken });

  return google.tasks({ version: "v1", auth });
}

// POST: 작업 추가
export async function POST(req: Request) {
  try {
    const { title, dueDate } = await req.json();

    const userSession = await auth();
    if (!userSession) {
      throw new Error("User not authenticated");
    }

    const tasksClient = await createTasksClient(userSession.accessToken);

    const response = await tasksClient.tasks.insert({
      tasklist: "@default",
      requestBody: {
        title,
        due: dueDate || undefined, // 날짜가 선택되지 않았으면 undefined
      },
    });

    return NextResponse.json({ success: true, task: response.data });
  } catch (error) {
    console.error("Error adding task:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: 작업 조회
export async function GET(req: Request) {
  try {
    const userSession = await auth();
    if (!userSession) {
      throw new Error("User not authenticated");
    }

    const tasksClient = await createTasksClient(userSession.accessToken);

    const response = await tasksClient.tasks.list({
      tasklist: "@default",
    });

    return NextResponse.json({
      success: true,
      tasks: response.data.items || [],
    });
  } catch (error) {
    console.error("Error listing tasks:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: 작업 삭제
export async function DELETE(req: Request) {
  try {
    const { taskId } = await req.json();

    const userSession = await auth();
    if (!userSession) {
      throw new Error("User not authenticated");
    }

    const tasksClient = await createTasksClient(userSession.accessToken);

    await tasksClient.tasks.delete({
      tasklist: "@default",
      task: taskId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: 작업 업데이트
export async function PUT(req: Request) {
  try {
    const { taskId, title, dueDate } = await req.json();

    const userSession = await auth();
    if (!userSession) {
      throw new Error("User not authenticated");
    }

    const tasksClient = await createTasksClient(userSession.accessToken);

    const response = await tasksClient.tasks.update({
      tasklist: "@default",
      task: taskId,
      requestBody: {
        title,
        due: dueDate || undefined,
      },
    });

    return NextResponse.json({ success: true, task: response.data });
  } catch (error) {
    console.error("Error updating task:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
