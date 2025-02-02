"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Button,
} from "@heroui/react";
import Link from "next/link";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ isOpen, onOpenChange }: PaymentModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              토큰이 부족합니다. 계정을 업그레이드 하고 무제한으로 사용해보세요!
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* 무료 플랜 카드 */}
                <Card
                  className="border border-gray-200 dark:border-primary-500 rounded-lg shadow-md p-4 hover:border-primary-500 dark:hover:border-primary-100"
                  isPressable
                >
                  <CardBody>
                    <h3 className="text-xl font-bold mb-2">Free</h3>
                    <p className="text-2xl font-bold mb-4">
                      $0 <span className="text-sm">KRW/월</span>
                    </p>
                    <ul className="list-image-none pl-6 text-sm mb-6">
                      <li>✅ 최대 5개의 대화 스레드</li>
                      <li>✅ 일일 요청 토큰 100개</li>
                      <li>✅ Gemini 2.0 Flash, GPT-4o Mini</li>
                      <li>✅ 대시보드 기능 사용가능</li>
                      <br />
                    </ul>
                    <Button
                      color="primary"
                      className="w-full dark:text-primary-400"
                      onPress={onClose}
                    >
                      Free 플랜 선택
                    </Button>
                  </CardBody>
                </Card>
                {/* 프리미엄 플랜 카드 */}
                <Card
                  className="border border-gray-200 dark:border-primary-500 rounded-lg shadow-md p-4 hover:border-primary-500 dark:hover:border-primary-100"
                  isPressable
                >
                  <CardBody>
                    <h3 className="text-xl font-bold mb-2">Premium</h3>
                    <p className="text-2xl font-bold mb-4">
                      $29,000{" "}
                      <span className="text-small font-thin">KRW/월</span>
                    </p>
                    <ul className="list-image-none pl-6 text-sm mb-6">
                      <li>✅ 무제한 대화 스레드</li>
                      <li>✅ 무제한 일일 요청 토큰</li>
                      <li>✅ 다양한 최신 LLM모델 사용가능</li>
                      <li>✅ 대시보드 기능 사용가능</li>
                      <li>✅ 추가기능 얼리엑세스</li>
                    </ul>
                    <Link href="/checkout" passHref>
                      <Button
                        color="success"
                        className="w-full font-bold"
                        onPress={onClose}
                      >
                        Premium 플랜 선택
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                닫기
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
