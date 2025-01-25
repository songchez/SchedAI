# SchedAI

SchedAI는 Google Calendar와 ChatGPT를 연동하여 사용자가 채팅형 인터페이스로 일정을 관리하고 대화를 통해 효율적인 비서 역할을 수행할 수 있는 웹 애플리케이션입니다. 이 애플리케이션은 바쁜 직장인, 학생, 프리랜서를 위한 일정 관리 솔루션을 제공합니다.

SchedAI is an AI-powered scheduling solution designed to simplify and enhance personal and professional time management. By integrating with Google Calendar, SchedAI allows users to effortlessly add, modify, and view events using natural language commands.

Key Features
Smart Scheduling: AI learns your patterns to recommend optimized schedules.
Natural Language Interface: Easily manage schedules with commands like "Set a meeting next Friday at 3 PM."
Real-Time Sync: Instantly updates with Google Calendar for seamless access anywhere.
Personalized Experience: Tailored suggestions and automation based on user preferences.
Elegant Design: Modern glassmorphism UI with dark and light mode support.
SchedAI is your smart companion, offering more than just schedule management—it optimizes your time and boosts productivity. "Effortless scheduling, powered by AI."

## 프로젝트 개요

- **백엔드**: Next.js v14
- **스타일링**: Tailwind CSS 및 HeroUI
- **핵심 기능**:
  - Google 계정을 통한 사용자 로그인 및 인증
  - OpenAI API를 활용한 대화형 채팅 기능
  - Google Calendar 변경사항을 로그 형태로 확인 가능
  - AI 기반의 커스텀 기능을 제공하여 사용자의 선호도와 패턴에 맞춘 개인화된 일정 관리

## 기능 요구사항

### 1. 사용자 인증 및 관리

- Google OAuth 2.0을 통한 로그인
- 인증된 사용자에게 JWT 토큰 발급
- API 호출 시 발급된 토큰 사용
- 토큰 소진 시 결제 페이지로 리다이렉트

### 2. 대화형 채팅 인터페이스

- 자연어로 명령 입력 가능
- Google Calendar 이벤트 조회, 추가, 수정, 삭제
- 일정 리마인더 생성

### 3. Google Calendar 연동

- 사용자 이벤트 조회 및 관리
- 변경사항 로그 페이지 제공
- 필터 및 검색 기능 추가

### 4. AI 기반 메모리 및 학습

- 대화 내용 및 Google Calendar 데이터를 클라우드에 아카이브
- 개인화된 일정 추천 및 자동화 기능 제공

## 설치 방법

1. **레포지토리 클론**

   ```bash
   git clone https://github.com/yourusername/schedai.git
   cd schedai
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env.local` 파일을 생성하고 필요한 환경 변수를 추가합니다.

   ```plaintext
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **개발 서버 실행**

   ```bash
   npm run dev
   ```

5. **브라우저에서 열기**
   [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인합니다.

## 사용법

- Google 계정으로 로그인하여 애플리케이션에 접근합니다.
- 채팅창에 자연어로 명령을 입력하여 일정을 관리합니다.
- Google Calendar의 이벤트를 추가, 수정, 삭제할 수 있습니다.

## 기술 스택

- **프론트엔드**: Next.js, Tailwind CSS
- **백엔드**: OpenAI API, Google Calendar API, JWT
- **데이터베이스**: SQLite (개발 및 테스트), PostgreSQL (프로덕션)

## 기여

기여를 원하시는 분은 이 레포지토리를 포크한 후, 변경 사항을 커밋하고 풀 리퀘스트를 제출해 주세요.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
