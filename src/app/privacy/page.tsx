export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ShedAI 개인정보 처리방침</h1>
      <p className="text-sm text-gray-500 mb-4">최종 시행일: 2025년 2월 12일</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제1조 (개인정보의 처리 목적)
        </h2>
        <p className="mb-2">
          서비스는 이용자에게 보다 편리하고 맞춤형 일정 관리 및 AI 비서 기능을
          제공하기 위해 아래의 목적으로 개인정보를 처리합니다.
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong>서비스 제공 및 운영:</strong> Google 계정 정보를 활용하여
            회원 식별, 서비스 가입 및 로그인 인증을 실시합니다.
          </li>
          <li>
            <strong>서비스 개선 및 분석:</strong> 이용자의 로그인 데이터 및
            웹사이트 사용 기록을 분석하여 서비스 품질 향상 및 사용자 경험 개선에
            활용합니다.
          </li>
          <li>
            <strong>AI 대화 기능 개선 및 학습:</strong> 고객과 AI 간의
            대화내용을 저장하여 서비스 개선 및 AI 학습 목적으로 활용합니다.
          </li>
          <li>
            <strong>결제 처리:</strong> 결제 관련 정보를 안전하게 저장하여 결제
            처리 및 고객 지원 업무에 사용합니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제2조 (수집하는 개인정보 항목)
        </h2>
        <ul className="list-disc pl-5">
          <li>Google 계정 정보 (이메일, 프로필 사진, 이름)</li>
          <li>Google Calendar 및 Task 정보 (연동된 일정 및 할일 정보)</li>
          <li>로그인 및 서비스 사용 데이터 (IP 주소, 이용 패턴 등)</li>
          <li>고객과 AI의 대화내용</li>
          <li>결제 관련 정보 (결제 카드 정보, 거래 기록 등)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제3조 (개인정보의 처리 및 보유 기간)
        </h2>
        <ul className="list-disc pl-5">
          <li>회원 탈퇴 시 개인정보를 지체 없이 파기</li>
          <li>Google 계정 정보, 로그인 데이터: 회원 탈퇴 후 5년 보관</li>
          <li>대화내용: AI 학습 목적 후 내부 정책에 따라 안전하게 파기</li>
          <li>결제 정보: 관련 법령에 따라 일정 기간 보관 후 파기</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제4조 (개인정보의 파기 절차 및 방법)
        </h2>
        <ul className="list-disc pl-5">
          <li>전자적 파일: 복구 불가능한 방식으로 완전 삭제</li>
          <li>종이 문서: 분쇄 또는 소각</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제5조 (개인정보의 제3자 제공 및 위탁)
        </h2>
        <ul className="list-disc pl-5">
          <li>고객의 동의 없이 개인정보를 제3자에게 제공하지 않음</li>
          <li>
            결제 처리 및 고객 지원을 위해 신뢰할 수 있는 제3자에게 위탁 가능
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제6조 (정보주체의 권리 및 행사 방법)
        </h2>
        <ul className="list-disc pl-5">
          <li>개인정보 열람, 정정, 삭제 요청 가능</li>
          <li>동의 철회 가능</li>
          <li>
            고객센터를 통해 요청 가능 (이메일: tama4840@gmail.com, 전화:
            010-8226-9616)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제7조 (개인정보 보호를 위한 안전성 확보 조치)
        </h2>
        <ul className="list-disc pl-5">
          <li>기술적 조치: 데이터 암호화, 접근 제한</li>
          <li>관리적 조치: 직원 교육 및 보안 점검</li>
          <li>물리적 조치: 서버 및 문서 보안 강화</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제8조 (개인정보 처리방침의 변경)
        </h2>
        <p>변경 필요 시 사전 고지 후 시행</p>
      </section>

      <footer className="text-sm text-gray-600">
        <p>본 개인정보 처리방침은 2025년 2월 12일부터 시행됩니다.</p>
      </footer>
    </div>
  );
}
