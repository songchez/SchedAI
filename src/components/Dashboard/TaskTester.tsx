"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
  Spinner,
  DatePicker,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  DateValue,
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
} from "@internationalized/date";

interface TaskDetails {
  title: string;
  dueDate: DateValue | null;
  notes: string;
}

export default function TaskTester() {
  const [taskId, setTaskId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState<TaskDetails>({
    title: "",
    dueDate: null,
    notes: "",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function formatToRFC3339(dateValue: DateValue | null): string | null {
    if (!dateValue) return null;

    const localDate = dateValue.toDate(getLocalTimeZone());
    return localDate.toISOString();
  }

  const TaskHandleApiRequest = async (
    endpoint: string,
    method: string,
    body: any = null
  ) => {
    setLoading(true);
    setError(null);

    try {
      let url = endpoint;

      if (method === "GET" && body) {
        const queryParams = new URLSearchParams(body).toString();
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
        const errorData = await res.json();
        throw new Error(errorData.message || "API Request Failed");
      }

      const data = await res.json();
      if (method === "GET") {
        setTasks(data);
      }
      setResponse(data);
    } catch (err: any) {
      console.error("API Request Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="mb-4">Task API Tester</h2>

      <Card className="flex flex-col gap-4 mb-4">
        <CardBody className="gap-4">
          <h3>Task Details</h3>
          <Input
            label="Title"
            placeholder="Task Title"
            fullWidth
            value={taskDetails.title}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, title: e.target.value })
            }
          />
          <DatePicker
            label="Due Date"
            value={taskDetails.dueDate}
            onChange={(
              value: CalendarDate | CalendarDateTime | ZonedDateTime | null
            ) => setTaskDetails({ ...taskDetails, dueDate: value })}
          />
          <Textarea
            label="Notes"
            placeholder="Add additional notes"
            fullWidth
            value={taskDetails.notes}
            onChange={(e) =>
              setTaskDetails({ ...taskDetails, notes: e.target.value })
            }
          />
          {tasks.length > 0 && (
            <Select
              label="Select a Task"
              onChange={(e) => setTaskId(e.target.value)}
              value={taskId}
            >
              {tasks.map((task: any) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </Select>
          )}
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Button
          color="primary"
          onPress={() => TaskHandleApiRequest(`/api/task`, "GET")}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Get Tasks"}
        </Button>
        <Button
          color="success"
          onPress={() =>
            TaskHandleApiRequest(`/api/task`, "POST", {
              title: taskDetails.title,
              dueDate: formatToRFC3339(taskDetails.dueDate),
              notes: taskDetails.notes,
            })
          }
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Add Task"}
        </Button>
        <Button
          color="warning"
          onPress={() =>
            TaskHandleApiRequest(`/api/task`, "PATCH", {
              taskId,
              updates: {
                title: taskDetails.title,
                due: formatToRFC3339(taskDetails.dueDate),
                notes: taskDetails.notes,
              },
            })
          }
          disabled={loading || !taskId}
        >
          {loading ? <Spinner size="sm" /> : "Update Task"}
        </Button>
        <Button
          onPress={() =>
            TaskHandleApiRequest(`/api/task`, "DELETE", { taskId })
          }
          disabled={loading || !taskId}
        >
          {loading ? <Spinner size="sm" /> : "Delete Task"}
        </Button>
      </div>

      {loading && (
        <div className="mt-4">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Card className="mt-4">
          <CardBody>
            <h3>Error</h3>
            <p>{error}</p>
          </CardBody>
        </Card>
      )}

      {response && (
        <Card className="mt-4">
          <CardBody>
            <h3>API Response</h3>
            <pre className="text-sm p-2 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
