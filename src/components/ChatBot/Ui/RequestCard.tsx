import { Card, Button } from "@nextui-org/react";

interface RequestCardProps {
  requestData: {
    id: string;
    type: string;
    method: string;
    details: Record<string, any>;
  };
  onApprove: () => void;
  onCancel: () => void;
}

/**
 * 생성된 요청을 승인/취소하는 카드
 */
export default function RequestCard({
  requestData,
  onApprove,
  onCancel,
}: RequestCardProps) {
  const { type, method, details } = requestData;

  return (
    <Card className="p-4 my-4">
      <p>요청 내용 확인</p>
      <p>유형: {type}</p>
      <p>메소드: {method}</p>
      <p>세부 정보: {JSON.stringify(details, null, 2)}</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button onPress={onCancel}>취소</Button>
        <Button color="primary" onPress={onApprove}>
          승인
        </Button>
      </div>
    </Card>
  );
}
