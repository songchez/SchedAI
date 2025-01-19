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
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
  DateValue,
} from "@internationalized/date";
import { useTaskApi } from "@/hooks/useTaskApi"; // <-- import your custom hook

interface TaskDetails {
  title: string;
  dueDate: DateValue | null;
  notes: string;
  taskId?: string;
}

export default function TaskTester() {
  const [taskId, setTaskId] = useState("");
  const [taskDetails, setTaskDetails] = useState<TaskDetails>({
    title: "",
    dueDate: null,
    notes: "",
  });

  // Import everything from the custom hook:
  const { tasks, response, loading, error, setTasks, TaskHandleApiRequest } =
    useTaskApi();

  // Utility to format the date to RFC3339
  function formatToRFC3339(dateValue: DateValue | null): string | null {
    if (!dateValue) return null;
    const localDate = dateValue.toDate(getLocalTimeZone());
    return localDate.toISOString();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="mb-4 text-xl font-semibold">Task API Tester</h2>

      <Card className="flex flex-col gap-4 mb-4">
        <CardBody className="gap-4">
          <h3 className="font-semibold">Task Details</h3>
          <Input
            label="Title"
            placeholder="Task Title"
            fullWidth
            value={taskDetails.title}
            onChange={(e) =>
              setTaskDetails((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <DatePicker
            label="Due Date"
            value={taskDetails.dueDate}
            onChange={(
              value: CalendarDate | CalendarDateTime | ZonedDateTime | null
            ) => setTaskDetails((prev) => ({ ...prev, dueDate: value }))}
          />
          <Textarea
            label="Notes"
            placeholder="Add additional notes"
            fullWidth
            value={taskDetails.notes}
            onChange={(e) =>
              setTaskDetails((prev) => ({ ...prev, notes: e.target.value }))
            }
          />

          {tasks.length > 0 && (
            <Select
              label="Select a Task"
              onChange={(e) => setTaskId(e.target.value)}
              value={taskId}
            >
              {tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </Select>
          )}
        </CardBody>
      </Card>

      {/* Buttons to trigger API calls */}
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
          color="danger"
          onPress={() =>
            TaskHandleApiRequest(`/api/task`, "DELETE", {
              taskId: taskId,
            })
          }
          disabled={loading || !taskId}
        >
          {loading ? <Spinner size="sm" /> : "Delete Task"}
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mt-4">
          <CardBody>
            <h3 className="font-semibold text-red-500">Error</h3>
            <p>{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Response Display */}
      {response && (
        <Card className="mt-4">
          <CardBody>
            <h3 className="font-semibold">API Response</h3>
            <pre className="text-sm p-2 rounded bg-gray-100">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
