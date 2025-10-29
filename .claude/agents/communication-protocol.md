# Agent Communication Protocol

## 개요
Multi-Agent 시스템에서 Agent 간 효율적이고 명확한 통신을 위한 표준 프로토콜입니다.

## 통신 원칙

### 1. 명확성 (Clarity)
- 메시지는 명확하고 구체적이어야 함
- 애매한 표현 지양
- 필요한 모든 컨텍스트 포함

### 2. 추적성 (Traceability)
- 모든 메시지는 Jira 이슈와 연결
- 메시지 이력 보존
- 의사결정 과정 기록

### 3. 비동기성 (Asynchronous)
- Agent는 비동기적으로 작업
- 블로킹 작업 지양
- 타임아웃 설정

### 4. 신뢰성 (Reliability)
- 메시지 전달 보장
- 실패 시 재시도
- 에러 핸들링

## 메시지 구조

### 기본 메시지 포맷
```typescript
interface AgentMessage {
  // 메타데이터
  id: string;                    // 고유 메시지 ID (UUID)
  timestamp: string;             // ISO 8601 timestamp
  version: string;               // 프로토콜 버전 (예: "1.0.0")

  // 송수신자
  from: AgentType;               // 발신 Agent
  to: AgentType | AgentType[];   // 수신 Agent (단일 또는 다중)

  // 메시지 내용
  type: MessageType;             // 메시지 유형
  priority: Priority;            // 우선순위
  payload: any;                  // 메시지 데이터

  // 컨텍스트
  context: {
    jiraIssue?: string;          // 관련 Jira 이슈
    parentMessageId?: string;    // 응답인 경우 원본 메시지 ID
    threadId?: string;           // 대화 스레드 ID
    environment?: Environment;   // 환경 (dev/staging/prod)
  };

  // 옵션
  options?: {
    requiresResponse?: boolean;  // 응답 필요 여부
    responseDeadline?: string;   // 응답 기한
    retryable?: boolean;         // 재시도 가능 여부
    ttl?: number;                // 메시지 유효 시간 (초)
  };
}

// Agent 유형
type AgentType =
  | 'coordinator'
  | 'frontend'
  | 'backend'
  | 'design'
  | 'qa'
  | 'security'
  | 'devops'
  | 'deploy'
  | 'documentation';

// 메시지 유형
type MessageType =
  // 작업 관련
  | 'task_assignment'
  | 'task_status'
  | 'task_completion'
  | 'task_blocked'

  // 리뷰 관련
  | 'review_request'
  | 'review_completed'
  | 'review_feedback'

  // 정보 공유
  | 'information'
  | 'notification'
  | 'alert'
  | 'question'

  // 협업
  | 'collaboration_request'
  | 'resource_ready'
  | 'dependency_update';

// 우선순위
type Priority = 'critical' | 'high' | 'medium' | 'low';

// 환경
type Environment = 'dev' | 'staging' | 'production';
```

## 메시지 유형별 명세

### 1. 작업 할당 (task_assignment)
Coordinator가 다른 Agent에게 작업을 할당할 때 사용

```typescript
interface TaskAssignmentPayload {
  jiraIssue: string;              // Jira 이슈 키
  title: string;                  // 작업 제목
  description: string;            // 작업 설명
  acceptanceCriteria: string[];   // 인수 기준
  deadline?: string;              // 마감일
  dependencies?: string[];        // 의존성 이슈
  resources?: {                   // 필요 리소스
    documents?: string[];
    apis?: string[];
    credentials?: string[];
  };
  estimatedEffort?: string;       // 예상 작업 시간
}
```

**예시:**
```json
{
  "id": "msg_abc123",
  "timestamp": "2025-10-29T09:00:00Z",
  "version": "1.0.0",
  "from": "coordinator",
  "to": "frontend",
  "type": "task_assignment",
  "priority": "high",
  "payload": {
    "jiraIssue": "PROJ-123",
    "title": "로그인 UI 구현",
    "description": "사용자 로그인 화면 UI 컴포넌트 개발",
    "acceptanceCriteria": [
      "이메일/비밀번호 입력 폼",
      "로그인 버튼",
      "에러 메시지 표시",
      "반응형 디자인"
    ],
    "deadline": "2025-11-05T23:59:59Z",
    "dependencies": ["PROJ-125"],
    "resources": {
      "documents": ["https://figma.com/file/design-123"],
      "apis": ["/api/auth/login"]
    },
    "estimatedEffort": "8h"
  },
  "context": {
    "jiraIssue": "PROJ-123",
    "environment": "dev"
  },
  "options": {
    "requiresResponse": true,
    "responseDeadline": "2025-10-29T18:00:00Z"
  }
}
```

### 2. 작업 상태 업데이트 (task_status)
Agent가 작업 진행 상황을 보고할 때 사용

```typescript
interface TaskStatusPayload {
  jiraIssue: string;
  status: 'in_progress' | 'blocked' | 'review' | 'completed';
  progress: number;               // 0-100
  summary: string;                // 진행 상황 요약
  blockers?: Array<{              // 블로커 (status가 blocked인 경우)
    description: string;
    blockingIssue?: string;
    resolution?: string;
  }>;
  nextSteps?: string[];           // 다음 단계
  estimatedCompletion?: string;   // 예상 완료일
  metrics?: {                     // 메트릭 (선택)
    testsWritten?: number;
    codeCoverage?: number;
    linesOfCode?: number;
  };
}
```

**예시:**
```json
{
  "id": "msg_def456",
  "timestamp": "2025-10-29T12:00:00Z",
  "version": "1.0.0",
  "from": "frontend",
  "to": "coordinator",
  "type": "task_status",
  "priority": "medium",
  "payload": {
    "jiraIssue": "PROJ-123",
    "status": "in_progress",
    "progress": 60,
    "summary": "로그인 폼 컴포넌트 구현 완료. 현재 단위 테스트 작성 중.",
    "nextSteps": [
      "단위 테스트 완료",
      "통합 테스트 작성",
      "PR 생성"
    ],
    "estimatedCompletion": "2025-10-30T18:00:00Z",
    "metrics": {
      "testsWritten": 15,
      "codeCoverage": 75
    }
  },
  "context": {
    "jiraIssue": "PROJ-123",
    "parentMessageId": "msg_abc123"
  }
}
```

### 3. 리뷰 요청 (review_request)
Agent가 다른 Agent에게 리뷰를 요청할 때 사용

```typescript
interface ReviewRequestPayload {
  jiraIssue: string;
  reviewType: 'code' | 'design' | 'security' | 'documentation';
  title: string;
  description: string;
  artifacts: Array<{              // 리뷰 대상
    type: 'pr' | 'design' | 'document' | 'deployment';
    url: string;
    description?: string;
  }>;
  checkpoints: string[];          // 리뷰 체크포인트
  deadline?: string;
  context?: string;               // 추가 컨텍스트
}
```

**예시:**
```json
{
  "id": "msg_ghi789",
  "timestamp": "2025-10-30T14:00:00Z",
  "version": "1.0.0",
  "from": "frontend",
  "to": "design",
  "type": "review_request",
  "priority": "high",
  "payload": {
    "jiraIssue": "PROJ-123",
    "reviewType": "design",
    "title": "로그인 UI 디자인 QA",
    "description": "로그인 화면 UI 구현 완료. 디자인 명세와 일치하는지 검토 필요.",
    "artifacts": [
      {
        "type": "deployment",
        "url": "https://preview-123.example.com/login",
        "description": "Preview environment"
      }
    ],
    "checkpoints": [
      "색상이 디자인 시스템과 일치하는가?",
      "간격이 정확한가?",
      "모바일 레이아웃이 올바른가?",
      "애니메이션이 자연스러운가?"
    ],
    "deadline": "2025-10-31T12:00:00Z",
    "context": "첫 배포이므로 꼼꼼한 검토 부탁드립니다."
  },
  "context": {
    "jiraIssue": "PROJ-123"
  },
  "options": {
    "requiresResponse": true,
    "responseDeadline": "2025-10-31T12:00:00Z"
  }
}
```

### 4. 리뷰 완료 (review_completed)
리뷰 결과를 전달할 때 사용

```typescript
interface ReviewCompletedPayload {
  jiraIssue: string;
  reviewType: 'code' | 'design' | 'security' | 'documentation';
  result: 'approved' | 'approved_with_comments' | 'changes_requested';
  summary: string;
  issues: Array<{                 // 발견된 이슈
    severity: 'critical' | 'major' | 'minor' | 'suggestion';
    description: string;
    location?: string;
    suggestion?: string;
    mustFix: boolean;
  }>;
  positives?: string[];           // 긍정적인 피드백
  metrics?: any;                  // 리뷰 메트릭
}
```

**예시:**
```json
{
  "id": "msg_jkl012",
  "timestamp": "2025-10-31T10:00:00Z",
  "version": "1.0.0",
  "from": "design",
  "to": "frontend",
  "type": "review_completed",
  "priority": "high",
  "payload": {
    "jiraIssue": "PROJ-123",
    "reviewType": "design",
    "result": "approved_with_comments",
    "summary": "전반적으로 디자인 명세를 잘 구현했습니다. 2가지 minor 이슈 수정 후 승인 가능.",
    "issues": [
      {
        "severity": "minor",
        "description": "버튼 padding이 디자인과 다름",
        "location": "LoginButton component",
        "suggestion": "padding: 12px → 16px로 변경",
        "mustFix": true
      },
      {
        "severity": "minor",
        "description": "에러 메시지 색상 불일치",
        "location": "ErrorMessage component",
        "suggestion": "color: #FF0000 → #FF3B30",
        "mustFix": true
      }
    ],
    "positives": [
      "반응형 레이아웃 완벽",
      "애니메이션 자연스러움",
      "접근성 고려 잘됨"
    ]
  },
  "context": {
    "jiraIssue": "PROJ-123",
    "parentMessageId": "msg_ghi789"
  }
}
```

### 5. 블로커 알림 (task_blocked)
작업이 블로킹되었을 때 사용

```typescript
interface TaskBlockedPayload {
  jiraIssue: string;
  blockers: Array<{
    type: 'dependency' | 'resource' | 'technical' | 'external';
    description: string;
    blockingIssue?: string;       // 블로킹하는 이슈
    blockingAgent?: AgentType;    // 블로킹 해결 담당 Agent
    impact: 'critical' | 'high' | 'medium' | 'low';
    proposedSolution?: string;
  }>;
  currentStatus: string;
  urgency: 'immediate' | 'urgent' | 'normal';
}
```

**예시:**
```json
{
  "id": "msg_mno345",
  "timestamp": "2025-10-29T15:00:00Z",
  "version": "1.0.0",
  "from": "frontend",
  "to": "coordinator",
  "type": "task_blocked",
  "priority": "critical",
  "payload": {
    "jiraIssue": "PROJ-123",
    "blockers": [
      {
        "type": "dependency",
        "description": "로그인 API 엔드포인트가 준비되지 않음",
        "blockingIssue": "PROJ-124",
        "blockingAgent": "backend",
        "impact": "critical",
        "proposedSolution": "Mock API를 사용하여 UI 개발을 진행하고, API 준비되면 통합"
      }
    ],
    "currentStatus": "UI 개발은 완료했으나 통합 테스트 불가능",
    "urgency": "urgent"
  },
  "context": {
    "jiraIssue": "PROJ-123"
  },
  "options": {
    "requiresResponse": true,
    "responseDeadline": "2025-10-29T18:00:00Z"
  }
}
```

### 6. 리소스 준비 완료 (resource_ready)
다른 Agent가 대기 중인 리소스가 준비되었을 때 사용

```typescript
interface ResourceReadyPayload {
  jiraIssue: string;
  resourceType: 'api' | 'design' | 'infrastructure' | 'documentation';
  resource: {
    name: string;
    description: string;
    url?: string;
    credentials?: string;         // 접근 정보 (보안 저장소 참조)
    documentation?: string;
  };
  readyFor: AgentType[];          // 사용 가능한 Agent들
  notes?: string;
}
```

**예시:**
```json
{
  "id": "msg_pqr678",
  "timestamp": "2025-10-29T16:00:00Z",
  "version": "1.0.0",
  "from": "backend",
  "to": ["frontend", "qa"],
  "type": "resource_ready",
  "priority": "high",
  "payload": {
    "jiraIssue": "PROJ-124",
    "resourceType": "api",
    "resource": {
      "name": "Login API",
      "description": "사용자 로그인 API 엔드포인트",
      "url": "https://dev-api.example.com/auth/login",
      "documentation": "https://api-docs.example.com/auth/login"
    },
    "readyFor": ["frontend", "qa"],
    "notes": "Dev 환경에 배포 완료. 테스트 계정: test@example.com / password123"
  },
  "context": {
    "jiraIssue": "PROJ-124",
    "environment": "dev"
  }
}
```

## 통신 패턴

### 1. Request-Response 패턴
동기적 응답이 필요한 경우

```typescript
// Request
const request: AgentMessage = {
  // ...
  options: {
    requiresResponse: true,
    responseDeadline: "2025-10-29T18:00:00Z"
  }
};

// Response
const response: AgentMessage = {
  // ...
  context: {
    parentMessageId: request.id,  // 원본 메시지 참조
    threadId: request.context.threadId
  }
};
```

### 2. Broadcast 패턴
여러 Agent에게 동시에 알림

```typescript
const broadcast: AgentMessage = {
  // ...
  to: ['frontend', 'backend', 'qa'],  // 다중 수신자
  type: 'notification',
  payload: {
    message: "Production 배포 완료",
    // ...
  }
};
```

### 3. Publish-Subscribe 패턴
이벤트 기반 통신

```typescript
// Publisher
const event: AgentMessage = {
  // ...
  type: 'notification',
  payload: {
    eventType: 'deployment_completed',
    version: 'v1.2.0',
    environment: 'production'
  }
};

// Subscribers (interested agents)
// - QA Agent: 배포 후 smoke test
// - Documentation Agent: 릴리스 노트 업데이트
// - Coordinator: 진행 상황 추적
```

### 4. Chain of Responsibility 패턴
단계적 처리가 필요한 경우

```typescript
// Step 1: Backend → Security (보안 리뷰)
// Step 2: Security → QA (테스트)
// Step 3: QA → Deploy (배포)
// Step 4: Deploy → Coordinator (완료 보고)
```

## 에러 핸들링

### 에러 메시지 포맷
```typescript
interface ErrorMessage extends AgentMessage {
  type: 'error';
  payload: {
    errorCode: string;
    errorMessage: string;
    originalMessage?: string;     // 에러 발생한 원본 메시지
    stackTrace?: string;
    recoverable: boolean;
    suggestedAction?: string;
  };
}
```

**예시:**
```json
{
  "id": "msg_error_001",
  "timestamp": "2025-10-29T17:00:00Z",
  "version": "1.0.0",
  "from": "backend",
  "to": "coordinator",
  "type": "error",
  "priority": "critical",
  "payload": {
    "errorCode": "API_DEPLOY_FAILED",
    "errorMessage": "배포 중 health check 실패",
    "originalMessage": "msg_deploy_123",
    "recoverable": true,
    "suggestedAction": "로그 확인 후 롤백 또는 재배포"
  },
  "context": {
    "jiraIssue": "PROJ-150"
  }
}
```

## 메시지 저장 및 추적

### Jira 연동
모든 중요 메시지는 Jira에 코멘트로 기록

```javascript
// Agent 메시지를 Jira 코멘트로 변환
function logMessageToJira(message: AgentMessage) {
  const comment = `
## Agent Communication 📨

**From:** ${message.from}
**To:** ${Array.isArray(message.to) ? message.to.join(', ') : message.to}
**Type:** ${message.type}
**Priority:** ${message.priority}
**Timestamp:** ${message.timestamp}

### Message
${formatPayload(message.payload)}

---
*Message ID: ${message.id}*
  `;

  addJiraComment(message.context.jiraIssue, comment);
}
```

### 메시지 로그
중앙 로그 저장소에 모든 메시지 기록

```typescript
// Message log entry
interface MessageLog {
  message: AgentMessage;
  delivered: boolean;
  deliveredAt?: string;
  responseReceived?: boolean;
  responseReceivedAt?: string;
  retryCount: number;
}
```

## 보안 고려사항

### 1. 민감 데이터 보호
```typescript
// Bad - 민감 정보를 메시지에 직접 포함
{
  payload: {
    password: "secret123",
    apiKey: "key_abc123"
  }
}

// Good - 보안 저장소 참조
{
  payload: {
    credentialsRef: "aws-secrets-manager://prod/db-credentials",
    apiKeyRef: "vault://api-keys/service-a"
  }
}
```

### 2. 메시지 서명 (선택)
중요한 메시지는 서명하여 무결성 보장

```typescript
interface SignedMessage extends AgentMessage {
  signature?: string;  // HMAC or digital signature
}
```

### 3. 접근 제어
Agent는 자신의 권한 범위 내에서만 메시지 수신

```typescript
// Agent별 접근 권한
const permissions = {
  frontend: ['read:design', 'write:ui', 'request:api'],
  backend: ['read:infrastructure', 'write:api', 'request:security-review'],
  security: ['read:all', 'write:security-issues'],
  // ...
};
```

## 성능 최적화

### 1. 메시지 배치 처리
여러 작은 메시지를 하나로 합침

```typescript
interface BatchMessage extends AgentMessage {
  type: 'batch';
  payload: {
    messages: AgentMessage[];
  };
}
```

### 2. 메시지 압축
큰 페이로드는 압축

```typescript
{
  payload: {
    compressed: true,
    encoding: 'gzip',
    data: '<compressed-data>'
  }
}
```

### 3. TTL 설정
오래된 메시지 자동 만료

```typescript
{
  options: {
    ttl: 3600  // 1시간 후 만료
  }
}
```

## 모니터링 및 메트릭

### 추적 메트릭
- 메시지 전송 성공률
- 평균 응답 시간
- 메시지 처리 시간
- 에러 발생률
- 재시도 횟수

### 대시보드
```typescript
interface AgentCommunicationMetrics {
  totalMessages: number;
  messagesByType: Record<MessageType, number>;
  messagesByPriority: Record<Priority, number>;
  averageResponseTime: number;
  errorRate: number;
  agentActivity: Record<AgentType, {
    sent: number;
    received: number;
    avgResponseTime: number;
  }>;
}
```

## 테스트

### 메시지 검증
```typescript
function validateMessage(message: AgentMessage): boolean {
  // Required fields
  if (!message.id || !message.from || !message.to || !message.type) {
    return false;
  }

  // Valid agent types
  const validAgents = ['coordinator', 'frontend', 'backend', ...];
  if (!validAgents.includes(message.from)) {
    return false;
  }

  // Valid message types
  const validTypes = ['task_assignment', 'task_status', ...];
  if (!validTypes.includes(message.type)) {
    return false;
  }

  return true;
}
```

### Mock 메시지
테스트용 메시지 생성

```typescript
function createMockMessage(
  from: AgentType,
  to: AgentType,
  type: MessageType,
  payload: any
): AgentMessage {
  return {
    id: `mock_${Date.now()}`,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    from,
    to,
    type,
    priority: 'medium',
    payload,
    context: {
      jiraIssue: 'MOCK-123'
    }
  };
}
```

## 버전 관리

프로토콜 버전: **1.0.0**

### 변경 이력
- **1.0.0** (2025-10-29) - 초기 버전
  - 기본 메시지 구조 정의
  - 핵심 메시지 유형 정의
  - 통신 패턴 정의

### 하위 호환성
- Minor 버전 변경: 하위 호환 보장
- Major 버전 변경: 하위 호환 보장 안 함

## 참고 자료
- [Jira API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Message Queuing Best Practices](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
