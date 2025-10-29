/**
 * GitHub와 Jira 통합 자동화
 *
 * Git 커밋, PR, 배포와 Jira 이슈를 자동으로 연동
 */

import {
  addJiraComment,
  transitionJiraIssue,
  onPRCreated,
  onPRMerged,
  onDeploymentComplete,
} from './jira-automation';

// ============================================
// Git Commit Hook Integration
// ============================================

/**
 * Git 커밋 메시지에서 Jira 이슈 키 추출
 *
 * @example
 * "feat: add login feature (PROJ-123)" → ["PROJ-123"]
 * "[PROJ-456] fix: resolve bug" → ["PROJ-456"]
 */
export function extractJiraIssuesFromCommit(commitMessage: string): string[] {
  // Jira 이슈 키 패턴: [A-Z]+-[0-9]+
  const jiraIssuePattern = /([A-Z]+-\d+)/g;
  const matches = commitMessage.match(jiraIssuePattern);
  return matches || [];
}

/**
 * Git 커밋 시 Jira 자동 업데이트
 *
 * Git hook (post-commit)에서 호출
 */
export async function onGitCommit(
  commitHash: string,
  commitMessage: string,
  author: string,
  branch: string
): Promise<void> {
  console.log(`📝 Git Commit: ${commitHash.substring(0, 7)} - ${commitMessage}`);

  const jiraIssues = extractJiraIssuesFromCommit(commitMessage);

  if (jiraIssues.length === 0) {
    console.log('ℹ️  Jira 이슈가 커밋 메시지에 없습니다.');
    return;
  }

  for (const issueKey of jiraIssues) {
    try {
      await addJiraComment(
        issueKey,
        `
## 📝 새로운 커밋

**Branch:** \`${branch}\`
**Commit:** \`${commitHash.substring(0, 7)}\`
**Author:** ${author}
**Message:** ${commitMessage}

[View Commit](https://github.com/org/repo/commit/${commitHash})
        `.trim()
      );

      console.log(`✅ Jira 업데이트 완료: ${issueKey}`);
    } catch (error) {
      console.error(`❌ Jira 업데이트 실패: ${issueKey}`, error);
    }
  }
}

// ============================================
// GitHub PR Integration
// ============================================

/**
 * PR 제목에서 Jira 이슈 키 추출
 *
 * @example
 * "[PROJ-123] Add login feature" → "PROJ-123"
 * "PROJ-456: Fix bug" → "PROJ-456"
 */
export function extractJiraIssueFromPRTitle(prTitle: string): string | null {
  const match = prTitle.match(/([A-Z]+-\d+)/);
  return match ? match[1] : null;
}

/**
 * PR 설명에서 Jira 이슈 추출
 */
export function extractJiraIssuesFromPRDescription(prDescription: string): string[] {
  const jiraIssuePattern = /([A-Z]+-\d+)/g;
  const matches = prDescription.match(jiraIssuePattern);
  return matches || [];
}

/**
 * GitHub PR 생성 시 자동화
 *
 * GitHub Actions에서 호출
 */
export async function onGitHubPRCreated(
  prNumber: number,
  prTitle: string,
  prDescription: string,
  prUrl: string,
  author: string,
  baseBranch: string,
  headBranch: string
): Promise<void> {
  console.log(`🔀 PR 생성: #${prNumber} - ${prTitle}`);

  // 1. PR 제목에서 Jira 이슈 추출
  const issueFromTitle = extractJiraIssueFromPRTitle(prTitle);

  // 2. PR 설명에서 Jira 이슈 추출
  const issuesFromDescription = extractJiraIssuesFromPRDescription(prDescription);

  // 3. 모든 이슈 수집 (중복 제거)
  const allIssues = Array.from(new Set([
    ...(issueFromTitle ? [issueFromTitle] : []),
    ...issuesFromDescription
  ]));

  if (allIssues.length === 0) {
    console.log('⚠️ PR에 연결된 Jira 이슈가 없습니다.');
    return;
  }

  // 4. 각 이슈에 PR 정보 업데이트
  for (const issueKey of allIssues) {
    try {
      await onPRCreated(issueKey, prNumber, prUrl, prTitle);
      console.log(`✅ Jira 업데이트 완료: ${issueKey}`);
    } catch (error) {
      console.error(`❌ Jira 업데이트 실패: ${issueKey}`, error);
    }
  }
}

/**
 * GitHub PR 머지 시 자동화
 */
export async function onGitHubPRMerged(
  prNumber: number,
  prTitle: string,
  prUrl: string,
  mergedBy: string,
  baseBranch: string
): Promise<void> {
  console.log(`✅ PR 머지: #${prNumber} - ${prTitle}`);

  const issueFromTitle = extractJiraIssueFromPRTitle(prTitle);

  if (!issueFromTitle) {
    console.log('⚠️ PR 제목에 Jira 이슈가 없습니다.');
    return;
  }

  try {
    await onPRMerged(issueFromTitle, prNumber, prUrl);

    // main/master 브랜치에 머지된 경우 자동으로 Testing 상태로 변경
    if (baseBranch === 'main' || baseBranch === 'master') {
      await transitionJiraIssue(issueFromTitle, 'Testing');
    }

    console.log(`✅ Jira 업데이트 완료: ${issueFromTitle}`);
  } catch (error) {
    console.error(`❌ Jira 업데이트 실패: ${issueFromTitle}`, error);
  }
}

/**
 * GitHub PR 리뷰 승인 시 자동화
 */
export async function onGitHubPRApproved(
  prNumber: number,
  prTitle: string,
  reviewer: string,
  comment?: string
): Promise<void> {
  console.log(`✅ PR 승인: #${prNumber} by ${reviewer}`);

  const issueFromTitle = extractJiraIssueFromPRTitle(prTitle);

  if (!issueFromTitle) {
    return;
  }

  try {
    await addJiraComment(
      issueFromTitle,
      `
## ✅ PR 승인됨

**PR:** #${prNumber}
**Reviewer:** ${reviewer}
${comment ? `**Comment:** ${comment}` : ''}

코드 리뷰가 승인되었습니다. 머지 가능합니다.
      `.trim()
    );

    console.log(`✅ Jira 업데이트 완료: ${issueFromTitle}`);
  } catch (error) {
    console.error(`❌ Jira 업데이트 실패: ${issueFromTitle}`, error);
  }
}

/**
 * GitHub PR 변경 요청 시 자동화
 */
export async function onGitHubPRChangesRequested(
  prNumber: number,
  prTitle: string,
  reviewer: string,
  comment: string
): Promise<void> {
  console.log(`🔄 PR 변경 요청: #${prNumber} by ${reviewer}`);

  const issueFromTitle = extractJiraIssueFromPRTitle(prTitle);

  if (!issueFromTitle) {
    return;
  }

  try {
    await addJiraComment(
      issueFromTitle,
      `
## 🔄 PR 변경 요청됨

**PR:** #${prNumber}
**Reviewer:** ${reviewer}
**Comment:** ${comment}

코드 리뷰에서 변경이 요청되었습니다. 피드백을 반영해주세요.
      `.trim()
    );

    console.log(`✅ Jira 업데이트 완료: ${issueFromTitle}`);
  } catch (error) {
    console.error(`❌ Jira 업데이트 실패: ${issueFromTitle}`, error);
  }
}

// ============================================
// Deployment Integration
// ============================================

/**
 * 배포 완료 시 자동화
 *
 * CI/CD 파이프라인에서 호출
 */
export async function onGitHubDeployment(
  environment: 'dev' | 'staging' | 'production',
  version: string,
  deploymentUrl: string,
  commitHash: string,
  deployedBy: string
): Promise<void> {
  console.log(`🚀 배포 완료: ${environment} - ${version}`);

  // 1. 최근 커밋에서 Jira 이슈 추출
  const jiraIssues = await getJiraIssuesFromRecentCommits(commitHash, 10);

  if (jiraIssues.length === 0) {
    console.log('ℹ️  최근 커밋에 Jira 이슈가 없습니다.');
    return;
  }

  // 2. 각 이슈에 배포 정보 업데이트
  for (const issueKey of jiraIssues) {
    try {
      await onDeploymentComplete(issueKey, environment, version, deploymentUrl);
      console.log(`✅ Jira 업데이트 완료: ${issueKey}`);
    } catch (error) {
      console.error(`❌ Jira 업데이트 실패: ${issueKey}`, error);
    }
  }
}

/**
 * 최근 커밋에서 Jira 이슈 추출
 */
async function getJiraIssuesFromRecentCommits(
  commitHash: string,
  count: number
): Promise<string[]> {
  // 실제 구현에서는 Git 히스토리를 조회
  // 여기서는 예시로 빈 배열 반환
  // const commits = await execAsync(`git log -${count} --format=%s ${commitHash}`);
  // const issues = new Set<string>();
  // commits.split('\n').forEach(message => {
  //   extractJiraIssuesFromCommit(message).forEach(issue => issues.add(issue));
  // });
  // return Array.from(issues);

  return [];
}

// ============================================
// Branch Naming Convention
// ============================================

/**
 * 브랜치 이름에서 Jira 이슈 추출
 *
 * @example
 * "feature/PROJ-123-login-feature" → "PROJ-123"
 * "bugfix/PROJ-456-fix-bug" → "PROJ-456"
 */
export function extractJiraIssueFromBranch(branchName: string): string | null {
  const match = branchName.match(/([A-Z]+-\d+)/);
  return match ? match[1] : null;
}

/**
 * 브랜치 생성 시 자동으로 Jira 이슈 업데이트
 */
export async function onBranchCreated(
  branchName: string,
  author: string
): Promise<void> {
  console.log(`🌿 브랜치 생성: ${branchName}`);

  const issueKey = extractJiraIssueFromBranch(branchName);

  if (!issueKey) {
    console.log('ℹ️  브랜치 이름에 Jira 이슈가 없습니다.');
    return;
  }

  try {
    await addJiraComment(
      issueKey,
      `
## 🌿 브랜치 생성

**Branch:** \`${branchName}\`
**Created by:** ${author}

개발 작업이 시작되었습니다.
      `.trim()
    );

    // 상태를 In Progress로 변경
    await transitionJiraIssue(issueKey, 'In Progress');

    console.log(`✅ Jira 업데이트 완료: ${issueKey}`);
  } catch (error) {
    console.error(`❌ Jira 업데이트 실패: ${issueKey}`, error);
  }
}

// ============================================
// GitHub Actions Integration Examples
// ============================================

/**
 * GitHub Actions workflow 예시
 */
export const githubActionsExample = `
# .github/workflows/jira-integration.yml
name: Jira Integration

on:
  pull_request:
    types: [opened, closed]
  pull_request_review:
    types: [submitted]
  push:
    branches: [main, develop]

jobs:
  sync-jira:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: PR Created
        if: github.event.action == 'opened' && github.event.pull_request
        run: |
          node .claude/scripts/github-jira-cli.js pr-created \\
            --pr-number=\${{ github.event.pull_request.number }} \\
            --pr-title="\${{ github.event.pull_request.title }}" \\
            --pr-url="\${{ github.event.pull_request.html_url }}"

      - name: PR Merged
        if: github.event.action == 'closed' && github.event.pull_request.merged == true
        run: |
          node .claude/scripts/github-jira-cli.js pr-merged \\
            --pr-number=\${{ github.event.pull_request.number }} \\
            --pr-title="\${{ github.event.pull_request.title }}" \\
            --pr-url="\${{ github.event.pull_request.html_url }}"

      - name: PR Reviewed
        if: github.event.review
        run: |
          node .claude/scripts/github-jira-cli.js pr-reviewed \\
            --pr-number=\${{ github.event.pull_request.number }} \\
            --pr-title="\${{ github.event.pull_request.title }}" \\
            --reviewer="\${{ github.event.review.user.login }}" \\
            --state="\${{ github.event.review.state }}"

      - name: Deployment
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: |
          VERSION=\$(node -p "require('./package.json').version")
          node .claude/scripts/github-jira-cli.js deployment \\
            --environment="production" \\
            --version="v\$VERSION" \\
            --commit-hash="\${{ github.sha }}"
`;

/**
 * Git Hooks 설정 예시
 */
export const gitHooksExample = `
# .git/hooks/post-commit
#!/bin/bash

# Git 커밋 정보 수집
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)
AUTHOR=$(git log -1 --pretty=%an)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Jira 자동화 스크립트 실행
node .claude/scripts/github-jira-cli.js commit \\
  --hash="$COMMIT_HASH" \\
  --message="$COMMIT_MESSAGE" \\
  --author="$AUTHOR" \\
  --branch="$BRANCH"
`;

// ============================================
// Exports
// ============================================

export {
  extractJiraIssuesFromCommit,
  onGitCommit,
  extractJiraIssueFromPRTitle,
  extractJiraIssuesFromPRDescription,
  onGitHubPRCreated,
  onGitHubPRMerged,
  onGitHubPRApproved,
  onGitHubPRChangesRequested,
  onGitHubDeployment,
  extractJiraIssueFromBranch,
  onBranchCreated,
};
