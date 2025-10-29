# 🚀 Quick Start Guide - Multi-Agent System

## 📦 생성된 파일

### 1. Agent 설정 파일 (`.claude/agents/`)
```
✅ coordinator.md      - 프로젝트 조율 및 관리
✅ frontend.md         - UI/UX 개발
✅ backend.md          - API 및 서버 로직
✅ design.md           - UI/UX 디자인
✅ qa.md               - 품질 보증 및 테스트
✅ security.md         - 보안 검증
✅ devops.md           - 인프라 관리
✅ deploy.md           - 배포 실행
✅ documentation.md    - 문서화
```

### 2. 통신 프로토콜 (`.claude/agents/`)
```
✅ communication-protocol.md  - Agent 간 통신 표준
```

### 3. 자동화 스크립트 (`.claude/scripts/`)
```
✅ jira-automation.ts           - Jira 워크플로우 자동화
✅ github-jira-integration.ts   - GitHub-Jira 통합
✅ types.ts                     - TypeScript 타입 정의
```

### 4. 문서 (`.claude/agents/`)
```
✅ README.md       - 전체 시스템 가이드
✅ QUICKSTART.md   - 빠른 시작 가이드 (이 파일)
```

---

## ⚡ 5분 만에 시작하기

### Step 1: 환경 설정 (2분)

`.env` 파일 생성:
```bash
cat > .env << 'EOF'
# Jira Configuration
JIRA_BASE_URL=https://yoursite.atlassian.net
JIRA_CLOUD_ID=your-cloud-id
JIRA_PROJECT_KEY=PROJ
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token

# GitHub Configuration
GITHUB_TOKEN=your-github-token
GITHUB_REPO=org/repo
EOF
```

**Jira API Token 발급:**
1. https://id.atlassian.com/manage-profile/security/api-tokens
2. "Create API token" 클릭
3. 토큰을 `.env`에 추가

**Jira Cloud ID 확인:**
```bash
curl -u your-email@example.com:your-api-token \
  https://api.atlassian.com/oauth/token/accessible-resources
```

### Step 2: MCP 설정 (1분)

`.claude/settings.local.json` 업데이트:
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-atlassian"],
      "env": {
        "ATLASSIAN_USERNAME": "your-email@example.com",
        "ATLASSIAN_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Step 3: 의존성 설치 (1분)

```bash
npm install
# 또는
pnpm install
```

### Step 4: 첫 번째 Epic 생성 (1분)

```typescript
// test-agent.ts
import { createJiraIssue } from './.claude/scripts/jira-automation';

async function main() {
  const epic = await createJiraIssue({
    issueType: 'Epic',
    summary: '[Epic] Multi-Agent System 테스트',
    description: 'Agent 시스템 정상 작동 확인',
    priority: 'High',
    labels: ['test', 'agent'],
  });

  console.log(`✅ Epic 생성 완료: ${epic.issueKey}`);
  console.log(`🔗 https://yoursite.atlassian.net/browse/${epic.issueKey}`);
}

main();
```

실행:
```bash
npx ts-node test-agent.ts
```

---

## 🎯 주요 사용 사례

### 사례 1: 새 기능 개발

```typescript
// 1. Coordinator가 Epic 생성
const epic = await createJiraIssue({
  issueType: 'Epic',
  summary: '[Epic] 사용자 인증 시스템',
  description: 'OAuth 2.0 기반 사용자 인증',
});

// 2. Frontend Story 생성
const frontendStory = await createJiraIssue({
  issueType: 'Story',
  summary: '로그인 UI 구현',
  parent: epic.issueKey,
  assignee: 'frontend',
});

// 3. Backend Task 생성
const backendTask = await createJiraIssue({
  issueType: 'Task',
  summary: '로그인 API 구현',
  parent: epic.issueKey,
  assignee: 'backend',
});

// 4. Agent 작업 시작
await onAgentTaskStart('frontend', frontendStory.issueKey);
await onAgentTaskStart('backend', backendTask.issueKey);
```

### 사례 2: PR 생성 및 Jira 연동

```bash
# 1. 브랜치 생성 (Jira 이슈 자동 업데이트)
git checkout -b feature/PROJ-123-login-ui

# 2. 커밋 (Jira 이슈에 자동 기록)
git commit -m "feat: add login form (PROJ-123)"

# 3. PR 생성
gh pr create --title "[PROJ-123] 로그인 UI 구현"

# → GitHub Actions가 자동으로 Jira 업데이트
# → Jira 상태: Code Review
# → PR 링크 Jira에 추가
```

### 사례 3: 버그 발견 및 리포팅

```typescript
// QA Agent가 버그 발견 시
const bug = await onBugFound({
  title: '로그인 실패 시 에러 메시지 색상 불일치',
  description: '디자인 명세와 다른 색상 사용',
  severity: 'Minor',
  foundInIssue: 'PROJ-123',
  environment: 'staging',
  stepsToReproduce: [
    '로그인 페이지 접속',
    '잘못된 비밀번호 입력',
    '로그인 버튼 클릭',
  ],
  expectedResult: '에러 메시지 색상: #FF3B30',
  actualResult: '에러 메시지 색상: #FF0000',
});

console.log(`🐛 Bug 생성: ${bug.issueKey}`);
// → Frontend Agent에 자동 할당
// → 원본 이슈(PROJ-123)와 자동 연결
```

### 사례 4: 배포 및 릴리스

```bash
# 1. 빌드 및 배포 (Deploy Agent)
npm run build
kubectl apply -f k8s/

# 2. Jira 자동 업데이트
node .claude/scripts/github-jira-cli.js deployment \
  --environment="production" \
  --version="v1.2.0" \
  --commit-hash="abc123"

# → 관련 이슈 상태: Done
# → Jira 릴리스 버전 생성
# → 릴리스 노트 자동 생성
```

---

## 🔥 고급 기능

### 1. Agent 간 통신

```typescript
import { AgentMessage } from './.claude/scripts/types';

// Frontend → Design: 디자인 리뷰 요청
const message: AgentMessage = {
  id: 'msg_' + Date.now(),
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  from: 'frontend',
  to: 'design',
  type: 'review_request',
  priority: 'high',
  payload: {
    jiraIssue: 'PROJ-123',
    reviewType: 'design',
    artifacts: [
      {
        type: 'deployment',
        url: 'https://preview-123.example.com',
      },
    ],
    checkpoints: ['색상 일치', '간격 정확성'],
  },
  context: {
    jiraIssue: 'PROJ-123',
  },
};

// Jira에 메시지 로깅
await logAgentMessageToJira(message);
```

### 2. 보안 취약점 자동 리포팅

```typescript
// Security Agent가 취약점 발견 시
const vulnerability = await onSecurityVulnerabilityFound({
  title: '[Critical] SQL Injection in login endpoint',
  description: 'Unsanitized user input in SQL query',
  severity: 'Critical',
  cve: 'CVE-2024-12345',
  cvss: 9.8,
  affectedComponent: 'src/auth/login.ts:45',
  remediation: 'Use parameterized queries',
  references: [
    'https://owasp.org/www-community/attacks/SQL_Injection',
  ],
});

console.log(`🔒 Vulnerability 생성: ${vulnerability.issueKey}`);
// → Backend Agent에 자동 할당
// → 24시간 내 수정 필요 (Due date 자동 설정)
```

### 3. GitHub Actions 자동화

`.github/workflows/jira-integration.yml`:
```yaml
name: Jira Integration

on:
  pull_request:
    types: [opened, closed]
  push:
    branches: [main]

jobs:
  sync-jira:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm install

      - name: Sync to Jira
        env:
          JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
          JIRA_EMAIL: ${{ secrets.JIRA_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
        run: node .claude/scripts/github-jira-cli.js ${{ github.event_name }}
```

---

## 📊 성공 지표

각 Agent별 KPI를 추적하여 성과를 측정하세요:

### Coordinator Agent
- Epic 완료율: 목표 > 90%
- Story 사이클 타임: 목표 < 5일
- 블로커 해결 시간: 목표 < 2시간

### Frontend/Backend Agent
- Story/Task 완료율: 목표 > 95%
- 코드 리뷰 사이클 타임: 목표 < 24시간
- 테스트 커버리지: 목표 > 80%

### QA Agent
- 버그 발견율: 조기 발견 중요
- 테스트 커버리지: 목표 > 80%
- 프로덕션 버그: 목표 < 1/주

### Security Agent
- 취약점 발견율: 조기 발견 중요
- 취약점 수정 시간 (MTTR): 목표 < 24시간
- Critical 취약점: 목표 = 0

### DevOps/Deploy Agent
- 배포 성공률: 목표 > 98%
- 배포 시간: 목표 < 30분
- 시스템 가동률: 목표 > 99.9%

---

## 🆘 문제 해결

### "Jira API 인증 실패"
```bash
# API 토큰 확인
echo $JIRA_API_TOKEN

# 연결 테스트
curl -u $JIRA_EMAIL:$JIRA_API_TOKEN \
  $JIRA_BASE_URL/rest/api/3/myself
```

### "PR이 Jira에 연동되지 않음"
```bash
# PR 제목에 Jira 이슈 포함 확인
# ✅ [PROJ-123] Add feature
# ❌ Add feature

# GitHub Actions Secrets 확인
# Settings > Secrets > JIRA_API_TOKEN
```

### "Agent 메시지가 Jira에 기록되지 않음"
```typescript
// context.jiraIssue 필드 확인
const message: AgentMessage = {
  // ...
  context: {
    jiraIssue: 'PROJ-123',  // 필수!
  },
};
```

---

## 📚 다음 단계

1. **상세 문서 읽기**
   - [README.md](./README.md) - 전체 시스템 가이드
   - [communication-protocol.md](./communication-protocol.md) - 통신 프로토콜

2. **Agent별 설정 확인**
   - [coordinator.md](./coordinator.md)
   - [frontend.md](./frontend.md)
   - [backend.md](./backend.md)
   - ... (기타 Agent)

3. **실전 적용**
   - 실제 프로젝트에 적용
   - 팀원과 함께 워크플로우 정립
   - 자동화 스크립트 커스터마이징

4. **피드백 및 개선**
   - Agent 성과 지표 추적
   - 병목 구간 파악 및 개선
   - 새로운 자동화 기회 발굴

---

## 🎉 축하합니다!

Multi-Agent System이 성공적으로 설정되었습니다!

질문이나 피드백은 이슈를 등록하거나 팀에 문의해주세요.

**Happy Coding with Agents! 🤖✨**

---

**Last Updated:** 2025-10-29
**Version:** 1.0.0
