# 🏠 짜로파파의 AI 연구소 허브 페이지 (Site)

아빠가 직접 써보고 정리하는 AI 협업 파이프라인 및 멀티채널 링크 허브 페이지입니다.

---

## ⚡ 빠른 실행 방법 (로컬)

1. **더블클릭 실행**: `start_site.bat` 파일을 더블클릭하면 로컬 서버가 기동되고 브라우저(`http://127.0.0.1:3000`)가 자동으로 열립니다.
2. **콘솔 명령 1개 실행**:
   ```bash
   node server.js
   ```
   실행 후 브라우저에서 `http://127.0.0.1:3000` 접속

---

## 🔗 새 글 발행 후 `Site/content/posts.json` 추가 방법 (3줄)

1. 발행 완료된 글의 제목, 채널, URL, 썸네일 이미지 경로를 확인합니다.
2. `Site/content/posts.json` 배열 최상단(`[`) 바로 아래에 새 글 객체(`{"title": "...", "channel": "...", "url": "...", "date": "...", "thumbnail": "..."}`)를 추가합니다.
3. 브라우저를 새로고침(F5)하면 빌드나 재시작 없이 즉시 메인 페이지에 최신 글 카드가 노출됩니다.

---

## 📁 폴더 및 파일 구조

```text
Site/
├── index.html              # 메인 허브 페이지 (모바일 우선, 따뜻한 손그림 스타일)
├── server.js               # 순수 Node.js 로컬 서버 (Zero-Dependency, 3000 포트)
├── start_site.bat          # 윈도우 원클릭 실행 배치 파일
├── vercel.json             # 추후 Vercel 배포용 정적 호스팅 설정
├── .gitignore              # .env 및 로컬 설정 제외 규칙
├── .env.example            # Supabase 환경변수 템플릿
├── content/
│   └── posts.json          # 최근 발행 글 4개 데이터 (동적 렌더링 소스)
└── assets/
    ├── css/style.css       # 크림톤 손그림 테마 및 반응형 스타일
    ├── js/main.js          # posts.json 자동 렌더링 스크립트
    ├── js/supabase.js      # 환경변수 감지 기반 Supabase 알림 신청 스텁
    └── images/             # 프로필, 템플릿, 발행 글 썸네일 PNG
```
