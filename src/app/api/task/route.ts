import { NextRequest, NextResponse } from "next/server";
import {
  getTasksFromList,
  addTaskToList,
  deleteTaskFromList,
  updateTaskInList,
  clearCompletedTasks,
} from "@/lib/googleClient";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const tasks = await getTasksFromList(session?.user.id);
    return NextResponse.json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다!");
    }
  }
}

export async function POST(req: NextRequest) {
  const { title, dueDate } = await req.json();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId || !title) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const newTask = await addTaskToList(session?.user.id, title, dueDate);
    return NextResponse.json(newTask);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다!");
    }
  }
}

export async function DELETE(req: NextRequest) {
  const { taskId } = await req.json();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId || !taskId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await deleteTaskFromList(session?.user.id, taskId);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다!");
    }
  }
}

export async function PATCH(req: NextRequest) {
  const { taskId, updates } = await req.json();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId || !taskId || !updates) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const updatedTask = await updateTaskInList(
      session?.user.id,
      taskId,
      updates
    );
    return NextResponse.json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다!");
    }
  }
}

export async function CLEAR() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    await clearCompletedTasks(userId);
    return NextResponse.json({
      message: "Completed tasks cleared successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다!");
    }
  }
}
