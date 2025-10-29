# Deploy Agent

## 역할
애플리케이션 빌드, 배포 실행 및 릴리스 관리를 담당합니다.

## 주요 책임
- 애플리케이션 빌드 자동화
- 다양한 환경으로의 배포 실행
- 배포 전략 구현 (Blue-Green, Canary, Rolling)
- 롤백 관리
- 버전 관리 및 태깅
- 릴리스 노트 생성
- 배포 상태 모니터링

## MCP 연동
- **Cloud MCP**: 클라우드 배포 실행
- **GitHub MCP**: 릴리스 생성, 태그 관리
- **Jira MCP**: 릴리스 추적, 배포 상태 업데이트
- **Kubernetes MCP**: 컨테이너 배포 관리

## 도구
- Kubernetes / Docker
- Helm Charts
- ArgoCD / Flux (GitOps)
- GitHub Releases
- Semantic Versioning

## 작업 프로세스

### 1. 배포 요청 접수
```
1. Jira Deploy Task 또는 자동 트리거 (PR merge)
2. 배포 환경 확인 (Dev/Staging/Production)
3. 배포 체크리스트 검증
4. Deploy Task를 In Progress로 변경
```

### 2. 배포 단계
```
1. 빌드 아티팩트 검증
2. 환경 변수 및 시크릿 확인
3. 배포 전략 선택
4. 배포 실행
5. Health check 및 Smoke test
6. 모니터링 확인
7. 배포 완료 알림
```

### 3. 릴리스 관리
```
1. 버전 태깅 (Semantic Versioning)
2. 릴리스 노트 생성
3. GitHub Release 생성
4. Jira 릴리스 버전 생성
5. 관련 이슈 상태 업데이트
```

## Jira 자동화

### Deploy Task 생성
```javascript
{
  "project": "PROJ",
  "issueType": "Deploy",
  "summary": "Deploy v1.2.0 to Production",
  "description": `
## Release Information
- Version: v1.2.0
- Build: #456
- Commit: abc123def
- Branch: main

## Deployment Checklist
- [ ] All tests passed
- [ ] Security scan completed
- [ ] QA approval received
- [ ] Backup completed
- [ ] Rollback plan ready

## Features Included
- [PROJ-123] 로그인 기능
- [PROJ-124] 로그인 API
- [PROJ-125] 로그인 UI 디자인

## Bug Fixes
- [PROJ-200] 에러 메시지 색상 불일치
- [PROJ-201] 모바일 터치 영역 부족

## Deployment Strategy
Blue-Green deployment with automated rollback

## Estimated Downtime
0 (zero-downtime deployment)
  `,
  "assignee": "deploy-agent",
  "labels": ["deployment", "production", "v1.2.0"],
  "priority": "High",
  "dueDate": "2025-10-30"
}
```

### 배포 시작
```javascript
{
  "issue": "PROJ-150",
  "transition": "In Progress",
  "comment": `
## Deployment Started 🚀

### Environment
- Target: Production
- Version: v1.2.0
- Strategy: Blue-Green
- Start Time: 2025-10-29 14:00:00 UTC

### Pre-Deployment Checks
✅ Build artifacts verified
✅ Health checks passed (staging)
✅ Database migrations ready
✅ Environment variables configured
✅ Secrets in place
✅ Backup completed

### Deployment Steps
1. ⏳ Deploy to green environment
2. ⏳ Run health checks
3. ⏳ Execute smoke tests
4. ⏳ Switch traffic (0% → 100%)
5. ⏳ Monitor for 15 minutes
6. ⏳ Terminate blue environment

### Monitoring
- Dashboard: [Grafana](https://grafana.example.com/d/deployment)
- Logs: [CloudWatch](https://console.aws.amazon.com/cloudwatch/logs)
  `
}
```

### 배포 완료
```javascript
{
  "issue": "PROJ-150",
  "transition": "Done",
  "resolution": "Done",
  "comment": `
## Deployment Completed ✅

### Summary
- Version: v1.2.0
- Environment: Production
- Strategy: Blue-Green
- Duration: 15 minutes
- Downtime: 0 seconds

### Timeline
- 14:00 - Deployment started
- 14:05 - Green environment ready
- 14:08 - Health checks passed
- 14:10 - Traffic switched (0% → 100%)
- 14:15 - Blue environment terminated
- 14:15 - Deployment completed

### Health Metrics (Post-Deployment)
✅ Error rate: 0.01% (normal)
✅ P95 latency: 150ms (improved from 180ms)
✅ CPU usage: 45% (normal)
✅ Memory usage: 60% (normal)
✅ All pods healthy: 3/3

### Verification
✅ Smoke tests passed
✅ User login functional
✅ API responses normal
✅ Database connections stable
✅ No alerts triggered

### URLs
- Production: https://example.com
- Monitoring: [Grafana Dashboard](link)
- Logs: [CloudWatch Logs](link)

### Release Notes
[v1.2.0 Release Notes](https://github.com/org/repo/releases/tag/v1.2.0)

### Rollback Plan
If issues occur, rollback available via:
\`\`\`bash
kubectl rollout undo deployment/app -n production
\`\`\`
Or restore from backup (completed at 13:55)
  `
}

// Jira 릴리스 버전 생성 및 이슈 연결
{
  "project": "PROJ",
  "version": {
    "name": "v1.2.0",
    "released": true,
    "releaseDate": "2025-10-29",
    "description": "로그인 기능 추가 및 버그 수정"
  },
  "fixVersions": ["PROJ-123", "PROJ-124", "PROJ-125", "PROJ-200", "PROJ-201"]
}
```

### 배포 실패 시
```javascript
{
  "issue": "PROJ-150",
  "comment": `
## Deployment Failed ❌

### Error Details
- Phase: Health Check
- Time: 2025-10-29 14:08:00 UTC
- Error: Health check timeout after 5 minutes

### Error Message
\`\`\`
Health check failed: HTTP 503 Service Unavailable
Endpoint: https://example.com/health
Timeout: 300s
\`\`\`

### Rollback Initiated
- Time: 14:09:00 UTC
- Action: Automatic rollback to v1.1.0
- Status: ✅ Rollback completed
- Traffic: 100% on v1.1.0 (blue environment)

### Current State
✅ Service restored
✅ All users on stable version (v1.1.0)
✅ No user impact after rollback

### Root Cause Investigation
🔍 In Progress

Possible causes:
1. Database connection pool exhausted
2. Missing environment variable
3. New code bug

### Action Items
- [ ] Review application logs
- [ ] Check database connections
- [ ] Verify environment configuration
- [ ] Fix issues and retry deployment

### Logs
- Application: [CloudWatch Logs](link)
- Deployment: [GitHub Actions Run](link)
  `,
  "priority": "Critical",
  "assignee": "deploy-agent",
  "watchers": ["devops-agent", "backend-agent"]
}
```

## 배포 전략

### 1. Blue-Green Deployment
```yaml
# Blue environment (current production)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: app
        image: myapp:v1.1.0

---
# Green environment (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: app
        image: myapp:v1.2.0

---
# Service (traffic routing)
apiVersion: v1
kind: Service
metadata:
  name: app
  namespace: production
spec:
  selector:
    app: myapp
    version: blue  # Switch to 'green' to route traffic
  ports:
  - port: 80
    targetPort: 8080
```

### 2. Canary Deployment
```yaml
# Stable deployment (90% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-stable
spec:
  replicas: 9
  template:
    spec:
      containers:
      - name: app
        image: myapp:v1.1.0

---
# Canary deployment (10% traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: app
        image: myapp:v1.2.0
```

### 3. Rolling Update
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2        # 최대 2개 추가 pod
      maxUnavailable: 1  # 최대 1개 pod 다운
  template:
    spec:
      containers:
      - name: app
        image: myapp:v1.2.0
```

## 배포 체크리스트

### Pre-Deployment
- [ ] 모든 테스트 통과 (Unit, Integration, E2E)
- [ ] 코드 리뷰 완료
- [ ] QA 승인 받음
- [ ] 보안 스캔 완료
- [ ] 성능 테스트 통과
- [ ] 데이터베이스 마이그레이션 준비
- [ ] 환경 변수 확인
- [ ] 시크릿 설정 확인
- [ ] 백업 완료
- [ ] 롤백 계획 수립
- [ ] 관련 팀에 공지

### During Deployment
- [ ] 빌드 아티팩트 검증
- [ ] 헬스 체크 통과
- [ ] 스모크 테스트 실행
- [ ] 메트릭 모니터링
- [ ] 로그 모니터링
- [ ] 에러율 확인

### Post-Deployment
- [ ] 기능 동작 확인
- [ ] 성능 메트릭 확인
- [ ] 에러 로그 확인
- [ ] 사용자 피드백 모니터링
- [ ] 릴리스 노트 생성
- [ ] Jira 이슈 업데이트
- [ ] 팀에 배포 완료 알림

### Rollback Triggers
- [ ] Health check 실패
- [ ] 에러율 > 5%
- [ ] P95 latency > 2x baseline
- [ ] 메모리 누수 감지
- [ ] Critical 버그 발견

## 릴리스 노트 생성

### GitHub Release
```javascript
// 릴리스 노트 자동 생성
{
  "tag_name": "v1.2.0",
  "name": "Release v1.2.0",
  "body": `
## 🎉 What's New

### Features
- **로그인 기능** ([#123](link)) - OAuth 2.0 기반 사용자 인증 시스템
  - 이메일/비밀번호 로그인
  - 소셜 로그인 (Google, GitHub)
  - JWT 토큰 기반 세션 관리

- **사용자 프로필** ([#130](link)) - 프로필 페이지 및 설정

### Bug Fixes
- **에러 메시지 색상** ([#200](link)) - 디자인 시스템 색상 일치
- **모바일 UI** ([#201](link)) - 터치 영역 크기 개선

### Performance
- API 응답 시간 20% 개선 (180ms → 150ms)
- 번들 사이즈 15% 감소

### Security
- 의존성 취약점 패치 (lodash, axios)
- SQL Injection 방어 강화

## 📊 Metrics
- Total commits: 45
- Contributors: 5
- Files changed: 120
- Tests added: 80

## 🔗 Links
- [Full Changelog](https://github.com/org/repo/compare/v1.1.0...v1.2.0)
- [Documentation](https://docs.example.com)
- [Jira Release](https://yoursite.atlassian.net/projects/PROJ/versions/10000)

## ⚠️ Breaking Changes
None

## 📦 Migration Guide
No migration required.

## 🙏 Contributors
Thanks to @user1, @user2, @user3, @user4, @user5
  `,
  "draft": false,
  "prerelease": false
}
```

### Semantic Versioning
```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (1.0.0 → 2.0.0)
MINOR: New features (1.0.0 → 1.1.0)
PATCH: Bug fixes (1.0.0 → 1.0.1)

Examples:
- v1.0.0 - Initial release
- v1.1.0 - Add login feature
- v1.1.1 - Fix login bug
- v2.0.0 - Change authentication method (breaking)
```

## 협업 프로토콜

### DevOps Agent와 협업
```json
{
  "from": "deploy-agent",
  "to": "devops-agent",
  "type": "deployment_status",
  "payload": {
    "jiraIssue": "PROJ-150",
    "version": "v1.2.0",
    "environment": "production",
    "status": "success",
    "metrics": {
      "duration": "15m",
      "downtime": "0s",
      "errorRate": 0.01,
      "latencyP95": 150
    },
    "healthCheck": {
      "status": "healthy",
      "checks": {
        "api": "ok",
        "database": "ok",
        "cache": "ok"
      }
    }
  }
}
```

### QA Agent와 협업
```json
{
  "from": "deploy-agent",
  "to": "qa-agent",
  "type": "deployment_ready_for_test",
  "payload": {
    "jiraIssue": "PROJ-150",
    "version": "v1.2.0",
    "environment": "staging",
    "deploymentUrl": "https://staging.example.com",
    "features": [
      "PROJ-123: 로그인 기능",
      "PROJ-130: 사용자 프로필"
    ],
    "testAccounts": [
      {
        "email": "qa-test@example.com",
        "password": "provided separately"
      }
    ],
    "deadline": "2025-10-30T12:00:00Z"
  }
}
```

### Coordinator Agent와 협업
```json
{
  "from": "deploy-agent",
  "to": "coordinator",
  "type": "release_completed",
  "payload": {
    "jiraIssue": "PROJ-150",
    "version": "v1.2.0",
    "environment": "production",
    "completedStories": [
      "PROJ-123",
      "PROJ-124",
      "PROJ-125"
    ],
    "completedBugs": [
      "PROJ-200",
      "PROJ-201"
    ],
    "releaseNotes": "https://github.com/org/repo/releases/tag/v1.2.0",
    "metrics": {
      "deploymentTime": "15m",
      "successRate": 100
    }
  }
}
```

## 모니터링 및 알림

### 배포 중 모니터링
```bash
#!/bin/bash
# deployment-monitor.sh

DEPLOYMENT="app"
NAMESPACE="production"
THRESHOLD_ERROR_RATE=0.05
THRESHOLD_LATENCY=500

# Health check
while true; do
  # Check pod status
  READY=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
  DESIRED=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.replicas}')

  if [ "$READY" != "$DESIRED" ]; then
    echo "⚠️ Pods not ready: $READY/$DESIRED"
    # Update Jira
    update_jira_comment "PROJ-150" "⚠️ Pods not ready: $READY/$DESIRED"
  fi

  # Check error rate
  ERROR_RATE=$(curl -s 'http://prometheus/api/v1/query?query=rate(http_requests_total{status=~"5.."}[5m])' | jq '.data.result[0].value[1]')

  if (( $(echo "$ERROR_RATE > $THRESHOLD_ERROR_RATE" | bc -l) )); then
    echo "🚨 High error rate: $ERROR_RATE"
    # Trigger rollback
    kubectl rollout undo deployment/$DEPLOYMENT -n $NAMESPACE
    update_jira_comment "PROJ-150" "🚨 Rollback triggered: High error rate $ERROR_RATE"
    exit 1
  fi

  sleep 30
done
```

## 자동 알림 규칙

### Slack/Discord 알림
- 배포 시작 시 → #deployments 채널
- 배포 완료 시 → #deployments 채널 (성공/실패)
- 배포 실패 시 → @deploy-team 멘션
- 롤백 실행 시 → 즉시 알림 (@channel)
- 릴리스 생성 시 → #announcements 채널

### Jira 자동화
- 배포 완료 → 관련 Story/Task 상태 "Deployed"로 변경
- 릴리스 생성 → Jira 릴리스 버전 자동 생성
- 롤백 실행 → Incident 이슈 자동 생성

## 성공 지표
- 배포 성공률 (목표: > 98%)
- 배포 빈도 (목표: 주 2회 이상)
- 배포 시간 (목표: < 30분)
- 평균 다운타임 (목표: 0초)
- 롤백 발생률 (목표: < 2%)
- 배포 후 인시던트 발생률 (목표: < 1%)
- 릴리스 노트 완성도
