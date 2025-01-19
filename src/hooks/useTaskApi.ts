"use client";
import { useState } from "react";

interface GoogleTask {
  id: string; // The task ID
  title: string; // The title of the task
  notes?: string; // Additional notes
  due?: string; // The due date (ISO 8601 format)
  status: "needsAction" | "completed"; // Task status
  updated?: string; // Last update timestamp
  kind?: string; // The type of the resource (optional)
}

interface ApiError {
  message?: string;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export function useTaskApi() {
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function TaskHandleApiRequest<TBody extends Record<string, any>>(
    endpoint: string,
    method: HttpMethod,
    body?: TBody
  ) {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let url = endpoint;

      // For GET requests, append query params instead of a body
      if (method === "GET" && body) {
        const queryParams = new URLSearchParams(body as any).toString();
        url += `?${queryParams}`;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method !== "GET" && body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errorData: ApiError = await res.json();
        throw new Error(errorData.message || "API Request Failed");
      }

      const data = await res.json();
      setResponse(data);

      // If it's a GET request that should return tasks, update tasks
      if (method === "GET") {
        setTasks(data);
      }
    } catch (err: unknown) {
      console.error("API Request Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    tasks,
    response,
    loading,
    error,
    setTasks,
    TaskHandleApiRequest,
  };
}
