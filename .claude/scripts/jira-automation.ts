/**
 * Jira Workflow Automation Scripts
 *
 * Agent와 Jira 간 자동화를 위한 유틸리티 함수 모음
 */

import { AgentMessage, AgentType } from './types';

// ============================================
// Configuration
// ============================================

interface JiraConfig {
  baseUrl: string;
  cloudId: string;
  projectKey: string;
  email?: string;
  apiToken?: string;
}

const config: JiraConfig = {
  baseUrl: process.env.JIRA_BASE_URL || 'https://yoursite.atlassian.net',
  cloudId: process.env.JIRA_CLOUD_ID || '',
  projectKey: process.env.JIRA_PROJECT_KEY || 'PROJ',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
};

// ============================================
// Core Functions
// ============================================

/**
 * Jira 이슈 생성
 */
export async function createJiraIssue(params: {
  issueType: string;
  summary: string;
  description?: string;
  assignee?: AgentType;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  labels?: string[];
  parent?: string;
  dueDate?: string;
  customFields?: Record<string, any>;
}): Promise<{ issueKey: string; issueId: string }> {
  const { issueType, summary, description, assignee, priority, labels, parent, dueDate, customFields } = params;

  // Agent 이름을 Jira assignee로 매핑
  const assigneeAccountId = await getAgentJiraAccountId(assignee);

  const issueData = {
    fields: {
      project: { key: config.projectKey },
      issuetype: { name: issueType },
      summary,
      description: description ? {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: description }]
          }
        ]
      } : undefined,
      assignee: assigneeAccountId ? { accountId: assigneeAccountId } : undefined,
      priority: priority ? { name: priority } : undefined,
      labels: labels || [],
      parent: parent ? { key: parent } : undefined,
      duedate: dueDate,
      ...customFields,
    }
  };

  // MCP를 사용하여 Jira 이슈 생성
  const response = await createJiraIssueMCP(issueData);

  console.log(`✅ Jira 이슈 생성됨: ${response.key}`);

  return {
    issueKey: response.key,
    issueId: response.id,
  };
}

/**
 * Jira 이슈 상태 변경
 */
export async function transitionJiraIssue(
  issueKey: string,
  transition: 'In Progress' | 'Code Review' | 'Testing' | 'Done' | 'Blocked'
): Promise<void> {
  console.log(`🔄 Jira 이슈 상태 변경: ${issueKey} → ${transition}`);

  // MCP를 사용하여 상태 변경
  await transitionJiraIssueMCP(issueKey, transition);

  console.log(`✅ 상태 변경 완료: ${issueKey}`);
}

/**
 * Jira 이슈에 코멘트 추가
 */
export async function addJiraComment(
  issueKey: string,
  comment: string,
  visibility?: { type: 'role' | 'group'; value: string }
): Promise<void> {
  const commentData = {
    body: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: comment }]
        }
      ]
    },
    visibility,
  };

  await addJiraCommentMCP(issueKey, commentData);
  console.log(`💬 코멘트 추가됨: ${issueKey}`);
}

/**
 * Jira 이슈에 작업 시간 로깅
 */
export async function logWorkTime(
  issueKey: string,
  timeSpent: string,
  comment?: string
): Promise<void> {
  const worklog = {
    timeSpent,
    comment: comment || `Logged by Agent`,
    started: new Date().toISOString(),
  };

  await addWorklogMCP(issueKey, worklog);
  console.log(`⏱️  작업 시간 로깅: ${issueKey} - ${timeSpent}`);
}

/**
 * Jira 이슈 연결 (링크)
 */
export async function linkJiraIssues(
  inwardIssue: string,
  outwardIssue: string,
  linkType: 'blocks' | 'relates to' | 'duplicates' | 'depends on'
): Promise<void> {
  const linkData = {
    type: { name: linkType },
    inwardIssue: { key: inwardIssue },
    outwardIssue: { key: outwardIssue },
  };

  await linkJiraIssuesMCP(linkData);
  console.log(`🔗 이슈 연결: ${inwardIssue} ${linkType} ${outwardIssue}`);
}

/**
 * Jira 릴리스 버전 생성
 */
export async function createJiraVersion(
  version: string,
  releaseDate?: string,
  description?: string
): Promise<{ versionId: string }> {
  const versionData = {
    name: version,
    released: false,
    releaseDate,
    description,
    project: config.projectKey,
  };

  const response = await createJiraVersionMCP(versionData);
  console.log(`🏷️  릴리스 버전 생성: ${version}`);

  return { versionId: response.id };
}

/**
 * Jira 이슈에 fixVersion 설정
 */
export async function setFixVersion(
  issueKey: string,
  version: string
): Promise<void> {
  await updateJiraIssueMCP(issueKey, {
    fixVersions: [{ name: version }]
  });

  console.log(`🏷️  fixVersion 설정: ${issueKey} → ${version}`);
}

// ============================================
// Agent-Specific Automation
// ============================================

/**
 * Agent 작업 시작 시 자동화
 */
export async function onAgentTaskStart(
  agent: AgentType,
  issueKey: string
): Promise<void> {
  console.log(`🚀 ${agent} Agent 작업 시작: ${issueKey}`);

  // 1. 상태를 In Progress로 변경
  await transitionJiraIssue(issueKey, 'In Progress');

  // 2. Agent를 assignee로 설정
  const accountId = await getAgentJiraAccountId(agent);
  if (accountId) {
    await updateJiraIssueMCP(issueKey, {
      assignee: { accountId }
    });
  }

  // 3. 작업 시작 코멘트 추가
  await addJiraComment(
    issueKey,
    `🤖 ${agent} Agent가 작업을 시작했습니다.\n시작 시간: ${new Date().toISOString()}`
  );

  // 4. 작업 시간 로깅 시작
  await logWorkTime(issueKey, '0h', '작업 시작');
}

/**
 * Agent 작업 완료 시 자동화
 */
export async function onAgentTaskComplete(
  agent: AgentType,
  issueKey: string,
  summary: string,
  artifacts?: Array<{ type: string; url: string }>
): Promise<void> {
  console.log(`✅ ${agent} Agent 작업 완료: ${issueKey}`);

  // 1. 완료 코멘트 추가
  let comment = `## ✅ 작업 완료\n\n**Agent:** ${agent}\n**완료 시간:** ${new Date().toISOString()}\n\n### Summary\n${summary}`;

  if (artifacts && artifacts.length > 0) {
    comment += '\n\n### Artifacts\n';
    artifacts.forEach(artifact => {
      comment += `- [${artifact.type}](${artifact.url})\n`;
    });
  }

  await addJiraComment(issueKey, comment);

  // 2. 상태를 Done으로 변경
  await transitionJiraIssue(issueKey, 'Done');
}

/**
 * PR 생성 시 Jira 자동 업데이트
 */
export async function onPRCreated(
  issueKey: string,
  prNumber: number,
  prUrl: string,
  title: string
): Promise<void> {
  console.log(`🔀 PR 생성: ${issueKey} - PR #${prNumber}`);

  // 1. PR 링크를 Jira 이슈에 추가
  await addRemoteLinkMCP(issueKey, {
    url: prUrl,
    title: `PR #${prNumber}: ${title}`,
    relationship: 'Pull Request',
  });

  // 2. 상태를 Code Review로 변경
  await transitionJiraIssue(issueKey, 'Code Review');

  // 3. 코멘트 추가
  await addJiraComment(
    issueKey,
    `🔀 Pull Request가 생성되었습니다.\n\n[PR #${prNumber}: ${title}](${prUrl})\n\n코드 리뷰를 시작해주세요.`
  );
}

/**
 * PR 머지 시 Jira 자동 업데이트
 */
export async function onPRMerged(
  issueKey: string,
  prNumber: number,
  prUrl: string
): Promise<void> {
  console.log(`✅ PR 머지: ${issueKey} - PR #${prNumber}`);

  await addJiraComment(
    issueKey,
    `✅ Pull Request가 머지되었습니다.\n\n[PR #${prNumber}](${prUrl})\n\n배포 준비가 완료되었습니다.`
  );
}

/**
 * 배포 완료 시 Jira 자동 업데이트
 */
export async function onDeploymentComplete(
  issueKey: string,
  environment: 'dev' | 'staging' | 'production',
  version: string,
  deploymentUrl?: string
): Promise<void> {
  console.log(`🚀 배포 완료: ${issueKey} - ${environment} - ${version}`);

  let comment = `## 🚀 배포 완료\n\n**Environment:** ${environment}\n**Version:** ${version}\n**배포 시간:** ${new Date().toISOString()}`;

  if (deploymentUrl) {
    comment += `\n**URL:** ${deploymentUrl}`;
  }

  await addJiraComment(issueKey, comment);

  // Production 배포 시 상태를 Done으로 변경
  if (environment === 'production') {
    await transitionJiraIssue(issueKey, 'Done');
  }
}

/**
 * 버그 발견 시 자동 이슈 생성
 */
export async function onBugFound(params: {
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  foundInIssue?: string;
  environment: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  screenshots?: string[];
}): Promise<{ issueKey: string }> {
  const { title, description, severity, foundInIssue, environment, stepsToReproduce, expectedResult, actualResult, screenshots } = params;

  let bugDescription = `${description}\n\n`;
  bugDescription += `## Environment\n${environment}\n\n`;
  bugDescription += `## Steps to Reproduce\n${stepsToReproduce.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n`;
  bugDescription += `## Expected Result\n${expectedResult}\n\n`;
  bugDescription += `## Actual Result\n${actualResult}\n\n`;

  if (screenshots && screenshots.length > 0) {
    bugDescription += `## Screenshots\n${screenshots.map(url => `![Screenshot](${url})`).join('\n')}\n\n`;
  }

  const { issueKey, issueId } = await createJiraIssue({
    issueType: 'Bug',
    summary: title,
    description: bugDescription,
    priority: severity,
    labels: ['bug', 'auto-created'],
  });

  // 원본 이슈와 연결
  if (foundInIssue) {
    await linkJiraIssues(issueKey, foundInIssue, 'relates to');
  }

  console.log(`🐛 버그 이슈 생성: ${issueKey}`);

  return { issueKey };
}

/**
 * 보안 취약점 발견 시 자동 이슈 생성
 */
export async function onSecurityVulnerabilityFound(params: {
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cve?: string;
  cvss?: number;
  affectedComponent: string;
  remediation: string;
  references?: string[];
}): Promise<{ issueKey: string }> {
  const { title, description, severity, cve, cvss, affectedComponent, remediation, references } = params;

  let vulnDescription = `${description}\n\n`;
  vulnDescription += `## Vulnerability Details\n`;
  if (cve) vulnDescription += `**CVE:** ${cve}\n`;
  if (cvss) vulnDescription += `**CVSS Score:** ${cvss}\n`;
  vulnDescription += `**Affected Component:** ${affectedComponent}\n\n`;
  vulnDescription += `## Remediation\n${remediation}\n\n`;

  if (references && references.length > 0) {
    vulnDescription += `## References\n${references.map(ref => `- ${ref}`).join('\n')}\n\n`;
  }

  const { issueKey, issueId } = await createJiraIssue({
    issueType: 'Vulnerability',
    summary: title,
    description: vulnDescription,
    priority: severity,
    labels: ['security', 'vulnerability', 'auto-created'],
  });

  // Critical/High 취약점은 즉시 알림
  if (severity === 'Critical' || severity === 'High') {
    await addJiraComment(
      issueKey,
      `⚠️ **긴급:** ${severity} 보안 취약점이 발견되었습니다. 즉시 조치가 필요합니다.`
    );
  }

  console.log(`🔒 보안 취약점 이슈 생성: ${issueKey}`);

  return { issueKey };
}

/**
 * Agent 메시지를 Jira 코멘트로 로깅
 */
export async function logAgentMessageToJira(message: AgentMessage): Promise<void> {
  if (!message.context.jiraIssue) {
    console.warn('⚠️ Jira 이슈 정보가 없어 로깅을 건너뜁니다.');
    return;
  }

  const comment = formatAgentMessageForJira(message);
  await addJiraComment(message.context.jiraIssue, comment);
}

/**
 * Agent 메시지를 Jira 코멘트 형식으로 변환
 */
function formatAgentMessageForJira(message: AgentMessage): string {
  const toAgents = Array.isArray(message.to) ? message.to.join(', ') : message.to;

  let comment = `## 📨 Agent Communication\n\n`;
  comment += `**From:** ${message.from}\n`;
  comment += `**To:** ${toAgents}\n`;
  comment += `**Type:** ${message.type}\n`;
  comment += `**Priority:** ${message.priority}\n`;
  comment += `**Timestamp:** ${message.timestamp}\n\n`;
  comment += `### Message\n${JSON.stringify(message.payload, null, 2)}\n\n`;
  comment += `---\n*Message ID: ${message.id}*`;

  return comment;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Agent 이름을 Jira account ID로 매핑
 */
async function getAgentJiraAccountId(agent?: AgentType): Promise<string | null> {
  if (!agent) return null;

  // 실제 구현에서는 Agent별 Jira 계정 매핑 테이블 사용
  const agentAccountMap: Record<AgentType, string> = {
    coordinator: process.env.JIRA_COORDINATOR_ACCOUNT_ID || '',
    frontend: process.env.JIRA_FRONTEND_ACCOUNT_ID || '',
    backend: process.env.JIRA_BACKEND_ACCOUNT_ID || '',
    design: process.env.JIRA_DESIGN_ACCOUNT_ID || '',
    qa: process.env.JIRA_QA_ACCOUNT_ID || '',
    security: process.env.JIRA_SECURITY_ACCOUNT_ID || '',
    devops: process.env.JIRA_DEVOPS_ACCOUNT_ID || '',
    deploy: process.env.JIRA_DEPLOY_ACCOUNT_ID || '',
    documentation: process.env.JIRA_DOCUMENTATION_ACCOUNT_ID || '',
  };

  return agentAccountMap[agent] || null;
}

// ============================================
// MCP Integration (Placeholder)
// ============================================

/**
 * 아래 함수들은 실제로는 MCP (Atlassian MCP)를 사용하여 구현됩니다.
 * 여기서는 인터페이스만 정의합니다.
 */

async function createJiraIssueMCP(issueData: any): Promise<{ key: string; id: string }> {
  // MCP를 사용하여 실제 Jira 이슈 생성
  // return await mcp__atlassian__createJiraIssue(issueData);
  throw new Error('MCP integration required');
}

async function transitionJiraIssueMCP(issueKey: string, transition: string): Promise<void> {
  // MCP를 사용하여 이슈 상태 변경
  // return await mcp__atlassian__transitionJiraIssue(issueKey, transition);
  throw new Error('MCP integration required');
}

async function addJiraCommentMCP(issueKey: string, commentData: any): Promise<void> {
  // MCP를 사용하여 코멘트 추가
  // return await mcp__atlassian__addCommentToJiraIssue(issueKey, commentData);
  throw new Error('MCP integration required');
}

async function addWorklogMCP(issueKey: string, worklog: any): Promise<void> {
  // MCP를 사용하여 작업 시간 로깅
  throw new Error('MCP integration required');
}

async function linkJiraIssuesMCP(linkData: any): Promise<void> {
  // MCP를 사용하여 이슈 연결
  throw new Error('MCP integration required');
}

async function createJiraVersionMCP(versionData: any): Promise<{ id: string }> {
  // MCP를 사용하여 버전 생성
  throw new Error('MCP integration required');
}

async function updateJiraIssueMCP(issueKey: string, updateData: any): Promise<void> {
  // MCP를 사용하여 이슈 업데이트
  // return await mcp__atlassian__editJiraIssue(issueKey, updateData);
  throw new Error('MCP integration required');
}

async function addRemoteLinkMCP(issueKey: string, linkData: any): Promise<void> {
  // MCP를 사용하여 원격 링크 추가
  throw new Error('MCP integration required');
}

// ============================================
// Note: All functions are already exported inline above
// ============================================
