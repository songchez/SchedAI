import { NextRequest, NextResponse } from "next/server";
import {
  getTasksFromList,
  addTaskToList,
  deleteTaskFromList,
} from "@/lib/googleClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const tasks = await getTasksFromList(userId);
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId, title, dueDate } = await req.json();

  if (!userId || !title) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const newTask = await addTaskToList(userId, title, dueDate);
    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, taskId } = await req.json();

  if (!userId || !taskId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await deleteTaskFromList(userId, taskId);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
