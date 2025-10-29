# Atlassian MCP 기능 가이드

Atlassian MCP 서버에서 제공하는 모든 기능과 사용 예시를 정리한 문서입니다.

## 📋 목차

- [기본 정보](#기본-정보)
- [Confluence 기능](#confluence-기능)
- [Jira 기능](#jira-기능)
- [통합 검색](#통합-검색)
- [일반적인 워크플로우](#일반적인-워크플로우)

---

## 기본 정보

### `atlassianUserInfo`
현재 사용자 정보 조회

**사용 예시:**
```
현재 Atlassian 사용자 정보를 확인해줘
```

### `getAccessibleAtlassianResources`
접근 가능한 Atlassian 리소스(Cloud ID) 조회

**반환 정보:**
- Cloud ID (UUID)
- 사이트 URL
- 사이트 이름
- 권한 범위 (scopes)

**사용 예시:**
```
접근 가능한 Atlassian 리소스를 조회해줘
```

---

## Confluence 기능

### 📁 스페이스 & 페이지 관리

#### `getConfluenceSpaces`
Confluence 스페이스 목록 조회

**파라미터:**
- `cloudId` (필수)
- `keys` - 특정 스페이스 키로 필터
- `status` - current/archived
- `type` - global/collaboration/knowledge_base/personal
- `limit` - 최대 250개

**사용 예시:**
```
Confluence 스페이스 목록을 조회해줘
```

#### `getConfluencePage`
특정 페이지 상세 조회 (Markdown 형식으로 반환)

**파라미터:**
- `cloudId` (필수)
- `pageId` (필수) - URL에서 추출 가능

**사용 예시:**
```
Confluence 페이지 123456789의 내용을 조회해줘
```

#### `getPagesInConfluenceSpace`
스페이스 내 모든 페이지 조회

**파라미터:**
- `cloudId` (필수)
- `spaceId` (필수) - 스페이스의 숫자 ID
- `title` - 제목으로 필터
- `status` - current/archived/deleted/trashed
- `sort` - id/-id/created-date/modified-date/title

**사용 예시:**
```
WEAT 스페이스의 모든 페이지를 조회해줘
```

#### `getConfluencePageDescendants`
페이지의 하위 페이지 조회

**파라미터:**
- `cloudId` (필수)
- `pageId` (필수)
- `depth` - 조회할 하위 깊이

#### `createConfluencePage`
새 페이지 생성 (Markdown 지원)

**파라미터:**
- `cloudId` (필수)
- `spaceId` (필수)
- `body` (필수) - Markdown 형식
- `title` - 페이지 제목
- `parentId` - 부모 페이지 ID
- `subtype` - "live"로 설정 시 Live Doc 생성
- `isPrivate` - 비공개 페이지 여부

**사용 예시:**
```
Confluence에 "API 문서"라는 제목으로 새 페이지를 생성해줘
```

#### `updateConfluencePage`
기존 페이지 수정 (Markdown 지원)

**파라미터:**
- `cloudId` (필수)
- `pageId` (필수)
- `body` (필수) - Markdown 형식
- `title` - 새 제목
- `versionMessage` - 변경 메시지
- `status` - current/draft

**사용 예시:**
```
Confluence 페이지 123456789의 내용을 업데이트해줘
```

### 💬 코멘트

#### `getConfluencePageFooterComments`
페이지 하단 코멘트 조회

**파라미터:**
- `cloudId` (필수)
- `pageId` (필수)
- `status` - current/archived/trashed/deleted
- `sort` - id/-id/created-date/-created-date

#### `getConfluencePageInlineComments`
인라인 코멘트 조회

**파라미터:**
- `cloudId` (필수)
- `pageId` (필수)
- `resolutionStatus` - resolved/open/dangling/reopened

#### `createConfluenceFooterComment`
하단 코멘트 생성

**파라미터:**
- `cloudId` (필수)
- `body` (필수) - Markdown 형식
- `pageId` - 페이지 ID
- `parentCommentId` - 답글인 경우

**사용 예시:**
```
Confluence 페이지에 "확인했습니다"라는 코멘트를 추가해줘
```

#### `createConfluenceInlineComment`
인라인 코멘트 생성 (특정 텍스트에 코멘트)

**파라미터:**
- `cloudId` (필수)
- `body` (필수) - Markdown 형식
- `pageId` (필수)
- `inlineCommentProperties` - 하이라이트할 텍스트 정보

### 🔍 검색

#### `searchConfluenceUsingCql`
CQL(Confluence Query Language)을 사용한 검색

**파라미터:**
- `cloudId` (필수)
- `cql` (필수) - 예: "title ~ 'meeting' AND type = page"
- `limit` - 최대 250개

**사용 예시:**
```
CQL을 사용해서 제목에 "API"가 포함된 페이지를 검색해줘
```

---

## Jira 기능

### 🎫 이슈 관리

#### `getJiraIssue`
특정 이슈 상세 조회

**파라미터:**
- `cloudId` (필수)
- `issueIdOrKey` (필수) - 예: "WEAT-1" 또는 "10000"
- `fields` - 조회할 필드 배열
- `expand` - 추가 정보

**사용 예시:**
```
WEAT-1 이슈의 상세 정보를 조회해줘
```

#### `createJiraIssue`
새 이슈 생성

**파라미터:**
- `cloudId` (필수)
- `projectKey` (필수) - 예: "WEAT"
- `issueTypeName` (필수) - 예: "작업", "버그", "에픽"
- `summary` (필수) - 이슈 제목
- `description` - Markdown 형식
- `assignee_account_id` - 담당자 Account ID
- `parent` - 하위 작업인 경우 부모 이슈 키

**사용 예시:**
```
WEAT 프로젝트에 "날씨 API 연동"이라는 작업을 생성해줘
```

#### `editJiraIssue`
기존 이슈 수정

**파라미터:**
- `cloudId` (필수)
- `issueIdOrKey` (필수)
- `fields` (필수) - 수정할 필드들

**사용 예시:**
```
WEAT-1 이슈의 설명을 업데이트해줘
```

#### `searchJiraIssuesUsingJql`
JQL(Jira Query Language)을 사용한 이슈 검색

**파라미터:**
- `cloudId` (필수)
- `jql` (필수) - 예: "project = WEAT AND status = 'To Do'"
- `fields` - 조회할 필드 배열 (기본: summary, description, status 등)
- `maxResults` - 최대 100개
- `nextPageToken` - 페이지네이션 토큰

**사용 예시:**
```
WEAT 프로젝트의 미완료 이슈를 모두 조회해줘
```

**자주 사용하는 JQL 예시:**
```jql
# 특정 프로젝트의 모든 이슈
project = WEAT ORDER BY created DESC

# 여러 프로젝트 조회
project IN (WEAT, AO) ORDER BY created DESC

# 미완료 이슈
project = WEAT AND status != Done

# 최근 일주일 생성된 이슈
project = WEAT AND created >= -7d

# 담당자별 이슈
project = WEAT AND assignee = currentUser()

# 우선순위별 이슈
project = WEAT AND priority = High

# 특정 상태의 이슈
status IN ("해야 할 일", "진행 중")
```

#### `addCommentToJiraIssue`
이슈에 코멘트 추가

**파라미터:**
- `cloudId` (필수)
- `issueIdOrKey` (필수)
- `commentBody` (필수) - Markdown 형식
- `commentVisibility` - 그룹/역할 제한 가능

**사용 예시:**
```
WEAT-1 이슈에 "진행 중입니다"라는 코멘트를 추가해줘
```

#### `getJiraIssueRemoteIssueLinks`
이슈의 원격 링크 조회 (Confluence 링크 등)

**파라미터:**
- `cloudId` (필수)
- `issueIdOrKey` (필수)
- `globalId` - 특정 링크만 조회

### 🔄 이슈 상태 전환

#### `getTransitionsForJiraIssue`
사용 가능한 상태 전환 조회

**파라미터:**
- `cloudId` (필수)
- `issueIdOrKey` (필수)

**사용 예시:**
```
WEAT-1 이슈에 가능한 상태 전환을 조회해줘
```

#### `transitionJiraIssue`
이슈 상태 전환

**파라미터:**
- `cloudId` (필수)
- `issueIdOrKey` (필수)
- `transition` (필수) - { "id": "전환ID" }
- `fields` - 전환 시 업데이트할 필드

**사용 예시:**
```
WEAT-1 이슈를 "진행 중" 상태로 변경해줘
```

### 📁 프로젝트 & 메타데이터

#### `getVisibleJiraProjects`
접근 가능한 프로젝트 목록 조회

**파라미터:**
- `cloudId` (필수)
- `action` - view/browse/edit/create (기본: create)
- `searchString` - 프로젝트명 검색
- `expandIssueTypes` - 이슈 타입 포함 여부 (기본: true)

**사용 예시:**
```
접근 가능한 Jira 프로젝트 목록을 조회해줘
```

#### `getJiraProjectIssueTypesMetadata`
프로젝트의 이슈 타입 메타데이터 조회

**파라미터:**
- `cloudId` (필수)
- `projectIdOrKey` (필수)

**사용 예시:**
```
WEAT 프로젝트에서 사용 가능한 이슈 타입을 조회해줘
```

#### `getJiraIssueTypeMetaWithFields`
이슈 타입의 필드 메타데이터 조회

**파라미터:**
- `cloudId` (필수)
- `projectIdOrKey` (필수)
- `issueTypeId` (필수)

**사용 예시:**
```
WEAT 프로젝트의 "작업" 이슈 타입에 필요한 필드를 조회해줘
```

### 👥 사용자

#### `lookupJiraAccountId`
사용자 이름/이메일로 Account ID 조회

**파라미터:**
- `cloudId` (필수)
- `searchString` (필수) - 이름 또는 이메일

**사용 예시:**
```
htkim@example.com 사용자의 Account ID를 조회해줘
```

---

## 통합 검색

### `search`
Rovo Search를 통한 Jira + Confluence 통합 검색

**파라미터:**
- `query` (필수) - 자연어 검색어

**사용 예시:**
```
"날씨 API"와 관련된 모든 Jira 이슈와 Confluence 페이지를 검색해줘
```

**특징:**
- JQL이나 CQL 대신 자연어 검색 가능
- Jira와 Confluence를 동시에 검색
- 가장 간단하고 직관적인 검색 방법

### `fetch`
ARI(Atlassian Resource Identifier)로 컨텐츠 조회

**파라미터:**
- `id` (필수) - ARI 형식의 ID
  - 예: "ari:cloud:jira:cloudId:issue/10107"
  - 예: "ari:cloud:confluence:cloudId:page/123456789"

**사용 예시:**
```
ARI를 사용해서 특정 리소스를 조회해줘
```

---

## 일반적인 워크플로우

### 🎯 워크플로우 1: 새 이슈 생성 및 작업

```bash
1. getVisibleJiraProjects
   → 프로젝트 확인

2. getJiraProjectIssueTypesMetadata
   → 사용 가능한 이슈 타입 확인

3. createJiraIssue
   → 새 이슈 생성

4. addCommentToJiraIssue
   → 진행 상황 업데이트

5. getTransitionsForJiraIssue
   → 가능한 상태 전환 확인

6. transitionJiraIssue
   → 상태를 "진행 중"으로 변경

7. transitionJiraIssue
   → 완료 후 "완료" 상태로 변경
```

### 📝 워크플로우 2: Confluence 문서 작성

```bash
1. getConfluenceSpaces
   → 스페이스 확인

2. createConfluencePage
   → 새 페이지 생성

3. createConfluenceFooterComment
   → 검토 요청 코멘트 추가

4. updateConfluencePage
   → 피드백 반영하여 페이지 수정
```

### 🔍 워크플로우 3: 검색 및 조회

```bash
# 방법 1: 통합 검색 (추천)
search
→ 자연어로 Jira + Confluence 검색

# 방법 2: 개별 검색
searchJiraIssuesUsingJql
→ JQL로 Jira 이슈 검색

searchConfluenceUsingCql
→ CQL로 Confluence 페이지 검색
```

### 🔗 워크플로우 4: Jira-Confluence 연동

```bash
1. createJiraIssue
   → Jira 이슈 생성

2. createConfluencePage
   → 관련 Confluence 문서 생성

3. getJiraIssueRemoteIssueLinks
   → 연결된 Confluence 페이지 확인

4. addCommentToJiraIssue
   → Confluence 링크를 코멘트로 추가
```

---

## 💡 유용한 팁

### JQL 검색 팁
- 무제한 쿼리는 허용되지 않으므로 항상 프로젝트나 날짜 필터 추가
- `maxResults`를 설정하여 결과 개수 제한 (최대 100개)
- 정렬은 `ORDER BY created DESC` 형식 사용

### Markdown 지원
- Confluence 페이지와 Jira 이슈 설명 모두 Markdown 형식 지원
- 코드 블록, 링크, 이미지 등 표준 Markdown 문법 사용 가능

### Cloud ID 확인
- URL에서 추출 가능하거나 `getAccessibleAtlassianResources` 사용
- 프로젝트 설정에 미리 저장해두면 편리 (`.mcp.json`)

### 페이지/이슈 ID 찾기
- URL에서 숫자 부분 추출
- 예: `https://yoursite.atlassian.net/wiki/spaces/SPACE/pages/123456789/...`
  → pageId는 `123456789`

---

## 📚 참고 링크

- [Atlassian MCP 공식 문서](https://mcp.atlassian.com/docs)
- [JQL 문법 가이드](https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
- [CQL 문법 가이드](https://support.atlassian.com/confluence-cloud/docs/use-the-confluence-query-language/)

---

**최종 업데이트:** 2025-10-29
**프로젝트:** Weatherly
