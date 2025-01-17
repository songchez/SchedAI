"use client";

import { useState } from "react";

export default function TaskTester() {
  const [userId, setUserId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [taskDetails, setTaskDetails] = useState({ title: "", dueDate: "" });
  const [response, setResponse] = useState(null);

  const handleApiRequest = async (
    endpoint: string,
    method: string,
    body: any = null
  ) => {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("API Request Failed:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Task API Tester</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">User ID</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Task ID</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Task Details</h2>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          className="border rounded w-full p-2 mb-2"
          value={taskDetails.title}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, title: e.target.value })
          }
        />
        <label className="block text-sm font-medium mb-2">Due Date</label>
        <input
          type="datetime-local"
          className="border rounded w-full p-2"
          value={taskDetails.dueDate}
          onChange={(e) =>
            setTaskDetails({ ...taskDetails, dueDate: e.target.value })
          }
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleApiRequest(`/api/task`, "GET", { userId })}
        >
          Get Tasks
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() =>
            handleApiRequest(`/api/task`, "POST", {
              userId,
              title: taskDetails.title,
              dueDate: taskDetails.dueDate,
            })
          }
        >
          Add Task
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() =>
            handleApiRequest(`/api/task`, "DELETE", { userId, taskId })
          }
        >
          Delete Task
        </button>
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
