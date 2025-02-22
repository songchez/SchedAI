export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-semibold mb-6">ShedAI 개인정보 처리방침</h1>
      <p className="text-sm text-gray-500 mb-4">최종 시행일: 2025년 2월 12일</p>

      {/* 제1조 (개인정보의 처리 목적) */}
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
            대화내용을 저장하여 서비스 개선 및 AI 학습 목적으로 활용하며, 필요
            시 개인식별정보는 익명화 처리됩니다.
          </li>
          <li>
            <strong>결제 처리:</strong> 결제 관련 정보를 안전하게 저장하여 유료
            서비스 결제 처리 및 고객 지원 업무에 사용합니다.
          </li>
        </ul>
      </section>

      {/* 제2조 (수집하는 개인정보 항목) */}
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

      {/* 제3조 (개인정보의 처리 및 보유 기간) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제3조 (개인정보의 처리 및 보유 기간)
        </h2>
        <ul className="list-disc pl-5">
          <li>
            회원 탈퇴 시, 별도의 요청 없이 개인정보를 지체 없이 파기하되, 관련
            법령에 따라 보관이 의무화된 정보(예: 결제 정보 등)는 해당 기간 동안
            보관합니다.
          </li>
          <li>
            Google 계정 정보 및 로그인 데이터: 회원 탈퇴 후 5년 보관(전자상거래
            등 관련 법령 준수)
          </li>
          <li>
            대화내용: AI 학습 및 서비스 개선 목적으로 내부 정책에 따라 일정 기간
            보관 후 안전하게 파기
          </li>
          <li>결제 정보: 관련 법령에 따라 정해진 기간 동안 보관 후 파기</li>
        </ul>
      </section>

      {/* 제4조 (개인정보의 파기 절차 및 방법) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제4조 (개인정보의 파기 절차 및 방법)
        </h2>
        <ul className="list-disc pl-5">
          <li>전자적 파일: 복구 불가능한 방식으로 완전 삭제</li>
          <li>종이 문서: 분쇄 또는 소각</li>
        </ul>
      </section>

      {/* 제5조 (개인정보의 제3자 제공 및 위탁) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제5조 (개인정보의 제3자 제공 및 위탁)
        </h2>
        <ul className="list-disc pl-5">
          <li>
            회사는 원칙적으로 고객의 사전 동의 없이 개인정보를 제3자에게
            제공하지 않습니다.
          </li>
          <li>
            단, 결제 처리 및 고객 지원 등 서비스 제공을 위해 신뢰할 수 있는
            제3자에게 위탁할 수 있으며, 위탁 시 위탁받는 자, 위탁 업무의 내용,
            보유 및 이용 기간 등을 사전에 고지하고 동의를 받습니다.
          </li>
          <li>
            해외 클라우드 서버 사용 등 국외 이전에 관한 사항은 별도로 고지하며,
            필요한 경우 별도의 동의를 받습니다.
          </li>
        </ul>
      </section>

      {/* 제6조 (정보주체의 권리 및 행사 방법) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제6조 (정보주체의 권리 및 행사 방법)
        </h2>
        <ul className="list-disc pl-5">
          <li>
            정보주체는 개인정보의 열람, 정정, 삭제, 처리 정지, 동의 철회 등을
            언제든지 요청할 수 있습니다.
          </li>
          <li>
            요청 방법: 고객센터(이메일: tama4840@gmail.com)를 통해 요청할 수
            있으며, 회사는 요청 접수 후 지체 없이 필요한 조치를 취합니다.
          </li>
          <li>요청 처리 절차 및 기간은 회사의 내부 규정에 따릅니다.</li>
        </ul>
      </section>

      {/* 제7조 (개인정보 보호를 위한 안전성 확보 조치) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제7조 (개인정보 보호를 위한 안전성 확보 조치)
        </h2>
        <ul className="list-disc pl-5">
          <li>기술적 조치: 데이터 암호화, 접근 제한, 보안 시스템 구축 등</li>
          <li>관리적 조치: 정기적인 직원 교육, 보안 점검, 내부 규정 마련 등</li>
          <li>물리적 조치: 서버 및 문서 보안 강화, 접근 통제 등</li>
        </ul>
      </section>

      {/* 제8조 (개인정보 처리방침의 변경) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제8조 (개인정보 처리방침의 변경)
        </h2>
        <p>
          회사는 개인정보 처리방침을 관련 법령의 변경, 회사의 내부 정책 또는
          서비스 내용 변경에 따라 수정할 수 있으며, 변경 시에는 홈페이지
          공지사항 또는 이메일 등을 통해 사전 고지합니다.
        </p>
      </section>

      {/* 제9조 (개인정보 보호책임자) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          제9조 (개인정보 보호책임자)
        </h2>
        <ul className="list-disc pl-5">
          <li>개인정보 보호책임자: [담당자명 또는 부서]</li>
          <li>연락처: 이메일 tama4840@gmail.com</li>
        </ul>
      </section>

      <footer className="text-sm text-gray-600">
        <p>본 개인정보 처리방침은 2025년 2월 12일부터 시행됩니다.</p>
      </footer>
    </div>
  );
}
