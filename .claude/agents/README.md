# Multi-Agent System with Jira Integration

## 📋 목차
- [개요](#개요)
- [Agent 소개](#agent-소개)
- [설치 및 설정](#설치-및-설정)
- [사용 방법](#사용-방법)
- [통신 프로토콜](#통신-프로토콜)
- [Jira 자동화](#jira-자동화)
- [GitHub 통합](#github-통합)
- [모범 사례](#모범-사례)
- [문제 해결](#문제-해결)

---

## 개요

이 Multi-Agent 시스템은 소프트웨어 개발 프로세스를 자동화하고 최적화하기 위해 설계되었습니다. 각 Agent는 특정 영역(프론트엔드, 백엔드, QA 등)을 담당하며, Jira와 긴밀하게 통합되어 작업을 추적하고 관리합니다.

### 주요 기능
- ✅ 자동화된 작업 할당 및 추적
- ✅ Agent 간 실시간 통신
- ✅ Jira 이슈 자동 생성 및 업데이트
- ✅ GitHub PR과 Jira 자동 연동
- ✅ 배포 자동화 및 릴리스 관리
- ✅ 보안 및 품질 검증 자동화

### 아키텍처
```
┌─────────────────────────────────────────────────────────────┐
│                     Coordinator Agent                       │
│            (요구사항 분석, 작업 배분, 진행 관리)                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│   Frontend   │ │  Backend   │ │   Design   │
│    Agent     │ │   Agent    │ │   Agent    │
└──────────────┘ └────────────┘ └────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│      QA      │ │  Security  │ │  DevOps    │
│    Agent     │ │   Agent    │ │   Agent    │
└──────────────┘ └────────────┘ └────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼──────┐              ┌────────▼─────┐
│    Deploy    │              │ Documentation│
│    Agent     │              │    Agent     │
└──────────────┘              └──────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │     Jira     │
                 │   (MCP 연동)  │
                 └──────────────┘
```

---

## Agent 소개

### 1. Coordinator Agent
**역할:** 프로젝트 전체 조율 및 관리

**주요 기능:**
- Epic/Story/Task 생성
- Agent 간 업무 배분
- 진행 상황 모니터링
- 블로커 해결

**사용 시나리오:**
```typescript
// 사용자 요구사항 → Epic 생성
coordinator.analyzeRequirement("사용자 인증 시스템 구축");
// → Epic: PROJ-100 생성
// → Story 분해 및 Agent 할당
```

### 2. Frontend Agent
**역할:** UI/UX 개발

**주요 기능:**
- React/Vue 컴포넌트 개발
- 반응형 디자인 구현
- 프론트엔드 테스트
- 성능 최적화

**사용 시나리오:**
```typescript
// Story 할당 → 개발 → PR 생성 → QA 요청
frontend.implementStory("PROJ-123");
// → UI 컴포넌트 개발
// → 단위 테스트 작성
// → PR 생성 및 Jira 업데이트
```

### 3. Backend Agent
**역할:** 서버 로직 및 API 개발

**주요 기능:**
- REST/GraphQL API 개발
- 데이터베이스 설계
- 비즈니스 로직 구현
- API 문서 생성

**사용 시나리오:**
```typescript
// API 개발 → 보안 리뷰 → 배포
backend.implementAPI("PROJ-124");
// → API 엔드포인트 개발
// → Security Agent에 리뷰 요청
// → API 문서 자동 생성
```

### 4. Design Agent
**역할:** UI/UX 디자인

**주요 기능:**
- Figma 디자인 작성
- 디자인 시스템 관리
- 디자인 QA
- 접근성 검토

**사용 시나리오:**
```typescript
// 디자인 → 리뷰 → Frontend 전달
design.createDesign("PROJ-125");
// → Figma 디자인 파일 생성
// → 디자인 토큰 추출
// → Frontend Agent에 전달
```

### 5. QA Agent
**역할:** 품질 보증 및 테스트

**주요 기능:**
- 테스트 케이스 작성
- 자동화 테스트 실행
- 버그 리포팅
- 회귀 테스트

**사용 시나리오:**
```typescript
// 테스트 → 버그 발견 → 리포트
qa.testFeature("PROJ-123");
// → E2E 테스트 실행
// → 버그 발견 시 Jira 이슈 생성
// → 재테스트 및 승인
```

### 6. Security Agent
**역할:** 보안 검증

**주요 기능:**
- 보안 취약점 스캔
- 코드 보안 리뷰
- 의존성 점검
- 보안 가이드라인 검증

**사용 시나리오:**
```typescript
// 보안 스캔 → 취약점 발견 → 수정 요청
security.scanCode("PROJ-124");
// → SAST/DAST 스캔
// → 취약점 이슈 생성
// → 수정 후 재검증
```

### 7. DevOps Agent
**역할:** 인프라 관리

**주요 기능:**
- CI/CD 파이프라인 관리
- 인프라 프로비저닝
- 모니터링 설정
- 인시던트 대응

**사용 시나리오:**
```typescript
// 인프라 구축 → 모니터링 → 운영
devops.provisionInfrastructure("PROJ-140");
// → Terraform으로 리소스 생성
// → 모니터링 설정
// → 알림 규칙 구성
```

### 8. Deploy Agent
**역할:** 배포 실행

**주요 기능:**
- 애플리케이션 빌드
- 다양한 배포 전략
- 롤백 관리
- 릴리스 노트 생성

**사용 시나리오:**
```typescript
// 빌드 → 배포 → 검증
deploy.deployToProduction("v1.2.0");
// → Blue-Green 배포
// → Health check
// → Jira 릴리스 버전 생성
```

### 9. Documentation Agent
**역할:** 문서화

**주요 기능:**
- API 문서 생성
- 기술 문서 작성
- README 관리
- 지식 베이스 구축

**사용 시나리오:**
```typescript
// API 개발 완료 → 문서 자동 생성
documentation.generateAPIDocs("PROJ-124");
// → OpenAPI 명세 생성
// → Swagger UI 배포
// → Confluence 가이드 작성
```

---

## 설치 및 설정

### 1. 환경 변수 설정

`.env` 파일 생성:
```bash
# Jira Configuration
JIRA_BASE_URL=https://yoursite.atlassian.net
JIRA_CLOUD_ID=your-cloud-id
JIRA_PROJECT_KEY=PROJ
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token

# Agent Account IDs (Jira 사용자)
JIRA_COORDINATOR_ACCOUNT_ID=account-id-1
JIRA_FRONTEND_ACCOUNT_ID=account-id-2
JIRA_BACKEND_ACCOUNT_ID=account-id-3
# ... (각 Agent별 account ID)

# GitHub Configuration
GITHUB_TOKEN=your-github-token
GITHUB_REPO=org/repo

# Slack/Discord (선택)
SLACK_WEBHOOK_URL=your-slack-webhook
DISCORD_WEBHOOK_URL=your-discord-webhook
```

### 2. MCP (Model Context Protocol) 설정

`.claude/settings.local.json`:
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

### 3. 의존성 설치

```bash
npm install
# 또는
pnpm install
```

### 4. Jira 프로젝트 설정

Jira에서 다음 이슈 타입 생성:
- Epic
- Story
- Task
- Bug
- Vulnerability (보안 취약점)
- Infrastructure (인프라 작업)
- Documentation (문서화)
- Deploy (배포)

워크플로우 상태:
- To Do
- In Progress
- Code Review
- Testing
- Done
- Blocked

---

## 사용 방법

### 기본 워크플로우

#### 1. Epic 생성 (Coordinator)
```typescript
import { createJiraIssue } from './.claude/scripts/jira-automation';

// Epic 생성
const epic = await createJiraIssue({
  issueType: 'Epic',
  summary: '[Epic] 사용자 인증 시스템',
  description: 'OAuth 2.0 기반 사용자 인증 시스템 구축',
  priority: 'High',
  labels: ['authentication', 'security'],
});

console.log(`Epic 생성: ${epic.issueKey}`);
// → PROJ-100
```

#### 2. Story 분해 및 Agent 할당
```typescript
// Frontend Story
const frontendStory = await createJiraIssue({
  issueType: 'Story',
  summary: '로그인 UI 구현',
  parent: 'PROJ-100',
  assignee: 'frontend',
  labels: ['ui', 'frontend'],
  priority: 'High',
});

// Backend Task
const backendTask = await createJiraIssue({
  issueType: 'Task',
  summary: '로그인 API 구현',
  parent: 'PROJ-100',
  assignee: 'backend',
  labels: ['api', 'backend'],
  priority: 'High',
});
```

#### 3. Agent 작업 시작
```typescript
import { onAgentTaskStart } from './.claude/scripts/jira-automation';

// Frontend Agent 작업 시작
await onAgentTaskStart('frontend', 'PROJ-123');
// → Jira 상태: In Progress
// → 작업 시간 로깅 시작
```

#### 4. PR 생성 및 Jira 연동
```typescript
import { onGitHubPRCreated } from './.claude/scripts/github-jira-integration';

// PR 생성 시 자동 호출 (GitHub Actions)
await onGitHubPRCreated(
  123, // PR number
  '[PROJ-123] 로그인 UI 구현',
  'PR description...',
  'https://github.com/org/repo/pull/123',
  'developer',
  'main',
  'feature/PROJ-123-login-ui'
);
// → Jira에 PR 링크 추가
// → 상태: Code Review
```

#### 5. QA 테스트
```typescript
import { onBugFound } from './.claude/scripts/jira-automation';

// 버그 발견 시
const bug = await onBugFound({
  title: '로그인 실패 시 에러 메시지 색상 불일치',
  description: '에러 메시지 색상이 디자인과 다릅니다.',
  severity: 'Minor',
  foundInIssue: 'PROJ-123',
  environment: 'staging',
  stepsToReproduce: [
    '로그인 페이지 접속',
    '잘못된 비밀번호 입력',
    '에러 메시지 확인'
  ],
  expectedResult: '에러 메시지 색상: #FF3B30',
  actualResult: '에러 메시지 색상: #FF0000',
});
// → 자동으로 Bug 이슈 생성
```

#### 6. 배포
```typescript
import { onGitHubDeployment } from './.claude/scripts/github-jira-integration';

// 배포 완료 시
await onGitHubDeployment(
  'production',
  'v1.2.0',
  'https://example.com',
  'abc123def',
  'deploy-agent'
);
// → 관련 이슈 상태: Done
// → 릴리스 노트 생성
```

---

## 통신 프로토콜

Agent 간 통신은 표준화된 메시지 형식을 사용합니다.

자세한 내용은 [communication-protocol.md](./communication-protocol.md)를 참조하세요.

### 메시지 예시

#### 작업 할당
```json
{
  "id": "msg_abc123",
  "from": "coordinator",
  "to": "frontend",
  "type": "task_assignment",
  "priority": "high",
  "payload": {
    "jiraIssue": "PROJ-123",
    "title": "로그인 UI 구현",
    "acceptanceCriteria": [
      "이메일/비밀번호 입력 폼",
      "로그인 버튼",
      "에러 메시지 표시"
    ]
  },
  "context": {
    "jiraIssue": "PROJ-123"
  }
}
```

#### 리뷰 요청
```json
{
  "from": "frontend",
  "to": "design",
  "type": "review_request",
  "payload": {
    "jiraIssue": "PROJ-123",
    "reviewType": "design",
    "artifacts": [
      {
        "type": "deployment",
        "url": "https://preview-123.example.com"
      }
    ],
    "checkpoints": [
      "색상 일치 확인",
      "간격 정확성 확인"
    ]
  }
}
```

---

## Jira 자동화

### 자동으로 처리되는 작업

#### 1. 커밋 시
- Jira 이슈에 커밋 정보 자동 추가
- 작업 시간 자동 로깅

#### 2. PR 생성 시
- Jira 이슈에 PR 링크 추가
- 상태를 "Code Review"로 변경
- 리뷰어에게 알림

#### 3. PR 머지 시
- Jira 이슈에 머지 정보 추가
- 상태를 "Testing"으로 변경
- QA Agent에 알림

#### 4. 배포 시
- Jira 이슈에 배포 정보 추가
- Production 배포 시 상태를 "Done"으로 변경
- 릴리스 버전 생성

#### 5. 버그/취약점 발견 시
- 자동으로 Bug/Vulnerability 이슈 생성
- 관련 이슈와 연결
- 담당 Agent에 할당

### 수동으로 호출할 수 있는 함수

```typescript
import {
  createJiraIssue,
  transitionJiraIssue,
  addJiraComment,
  logWorkTime,
  linkJiraIssues,
  onAgentTaskStart,
  onAgentTaskComplete,
  onBugFound,
  onSecurityVulnerabilityFound,
} from './.claude/scripts/jira-automation';

// 이슈 생성
await createJiraIssue({...});

// 상태 변경
await transitionJiraIssue('PROJ-123', 'In Progress');

// 코멘트 추가
await addJiraComment('PROJ-123', 'Progress update...');

// 작업 시간 로깅
await logWorkTime('PROJ-123', '2h', 'UI development');

// 이슈 연결
await linkJiraIssues('PROJ-123', 'PROJ-124', 'depends on');
```

---

## GitHub 통합

### GitHub Actions 설정

`.github/workflows/jira-integration.yml`:
```yaml
name: Jira Integration

on:
  pull_request:
    types: [opened, closed]
  pull_request_review:
    types: [submitted]
  push:
    branches: [main]

jobs:
  sync-jira:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Sync PR to Jira
        if: github.event.pull_request
        env:
          JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
          JIRA_EMAIL: ${{ secrets.JIRA_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
        run: |
          node .claude/scripts/github-jira-cli.js pr-created \
            --pr-number=${{ github.event.pull_request.number }} \
            --pr-title="${{ github.event.pull_request.title }}" \
            --pr-url="${{ github.event.pull_request.html_url }}"
```

### Git Hooks 설정

`.git/hooks/post-commit`:
```bash
#!/bin/bash

COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)
AUTHOR=$(git log -1 --pretty=%an)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

node .claude/scripts/github-jira-cli.js commit \
  --hash="$COMMIT_HASH" \
  --message="$COMMIT_MESSAGE" \
  --author="$AUTHOR" \
  --branch="$BRANCH"
```

실행 권한 부여:
```bash
chmod +x .git/hooks/post-commit
```

---

## 모범 사례

### 1. 커밋 메시지 규칙
```
<type>: <description> (<jira-issue>)

예:
feat: add login feature (PROJ-123)
fix: resolve bug in login (PROJ-200)
docs: update API documentation (PROJ-160)
```

Types:
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드/설정 변경

### 2. 브랜치 이름 규칙
```
<type>/<jira-issue>-<description>

예:
feature/PROJ-123-login-feature
bugfix/PROJ-200-fix-login-bug
hotfix/PROJ-250-critical-security-fix
```

### 3. PR 제목 규칙
```
[<jira-issue>] <description>

예:
[PROJ-123] Add login feature
[PROJ-200] Fix login bug
```

### 4. Agent 협업 규칙
- 작업 시작 전 의존성 확인
- 블로커 발생 시 즉시 Coordinator에 보고
- 리뷰 요청 시 명확한 체크포인트 제시
- 작업 완료 시 상세한 summary 제공

### 5. Jira 이슈 관리
- Epic은 큰 기능 단위로 생성
- Story는 사용자 관점의 기능
- Task는 기술적 구현 단위
- Bug는 발견 즉시 생성
- 모든 이슈에 명확한 acceptance criteria 작성

---

## 문제 해결

### 1. Jira 연동이 안 됨
**증상:** Jira API 호출 실패

**해결:**
```bash
# 1. 환경 변수 확인
echo $JIRA_API_TOKEN

# 2. Jira Cloud ID 확인
curl -u $JIRA_EMAIL:$JIRA_API_TOKEN \
  https://api.atlassian.com/oauth/token/accessible-resources

# 3. MCP 설정 확인
cat .claude/settings.local.json
```

### 2. GitHub Actions가 Jira를 업데이트하지 않음
**증상:** PR 생성해도 Jira에 반영 안 됨

**해결:**
```yaml
# GitHub Secrets 확인
# Settings > Secrets and variables > Actions
JIRA_BASE_URL
JIRA_EMAIL
JIRA_API_TOKEN

# Workflow 로그 확인
# Actions > Jira Integration > 최신 실행
```

### 3. Agent 간 통신 실패
**증상:** 메시지가 전달되지 않음

**해결:**
```typescript
// 메시지 검증
import { validateMessage } from './.claude/scripts/communication-protocol';

const message = {...};
if (!validateMessage(message)) {
  console.error('Invalid message format');
}

// 로그 확인
// 모든 메시지는 Jira 코멘트로 기록됨
```

### 4. 작업 시간 로깅이 안 됨
**증상:** Worklog가 Jira에 추가되지 않음

**해결:**
```typescript
// 수동으로 작업 시간 로깅
import { logWorkTime } from './.claude/scripts/jira-automation';

await logWorkTime('PROJ-123', '2h', 'UI development');

// Jira 이슈 확인
// Issue > Work Log 탭에서 확인
```

### 5. 릴리스 버전 생성 실패
**증상:** 배포 시 릴리스 버전이 생성되지 않음

**해결:**
```typescript
// 수동으로 버전 생성
import { createJiraVersion } from './.claude/scripts/jira-automation';

await createJiraVersion('v1.2.0', '2025-10-30', 'Login feature release');

// Jira Project Settings > Releases에서 확인
```

---

## 참고 자료

### 문서
- [Agent별 상세 문서](./)
  - [coordinator.md](./coordinator.md)
  - [frontend.md](./frontend.md)
  - [backend.md](./backend.md)
  - [design.md](./design.md)
  - [qa.md](./qa.md)
  - [security.md](./security.md)
  - [devops.md](./devops.md)
  - [deploy.md](./deploy.md)
  - [documentation.md](./documentation.md)

- [통신 프로토콜](./communication-protocol.md)

### 스크립트
- [jira-automation.ts](../.claude/scripts/jira-automation.ts)
- [github-jira-integration.ts](../.claude/scripts/github-jira-integration.ts)
- [types.ts](../.claude/scripts/types.ts)

### 외부 링크
- [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

## 라이선스
MIT License

---

## 기여
기여를 환영합니다! PR을 생성하거나 이슈를 등록해주세요.

---

**Last Updated:** 2025-10-29
**Version:** 1.0.0
