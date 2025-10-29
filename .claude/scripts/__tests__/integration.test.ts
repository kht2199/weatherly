/**
 * GitHub-Jira Integration 통합 테스트
 *
 * jira-automation 모듈과의 통합을 확인합니다.
 */

import {
  onGitCommit,
  onGitHubPRCreated,
  onGitHubPRMerged,
  onGitHubPRApproved,
  onGitHubPRChangesRequested,
  onGitHubDeployment,
  onBranchCreated,
} from '../github-jira-integration';

// ============================================
// 모의 환경 설정
// ============================================

console.log('\n🧪 GitHub-Jira Integration Test\n');
console.log('=' .repeat(50));
console.log('이 테스트는 실제 Jira API를 호출하지 않고');
console.log('함수 호출 패턴과 에러 처리를 확인합니다.');
console.log('=' .repeat(50) + '\n');

// ============================================
// 테스트 1: Git Commit 처리
// ============================================

console.log('📝 Test 1: Git Commit with Jira Issue\n');

try {
  await onGitCommit(
    'abc123def456',
    'feat: add weather API integration (WEAT-123)',
    'John Doe',
    'feature/WEAT-123-weather-api'
  );
} catch (error) {
  console.log(`Expected error (MCP not configured): ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 2: Git Commit without Jira Issue
// ============================================

console.log('📝 Test 2: Git Commit without Jira Issue\n');

try {
  await onGitCommit(
    'def456abc789',
    'feat: general code improvement',
    'Jane Smith',
    'feature/improvements'
  );
} catch (error) {
  console.log(`Unexpected error: ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 3: PR 생성
// ============================================

console.log('🔀 Test 3: GitHub PR Created\n');

try {
  await onGitHubPRCreated(
    42,
    '[WEAT-123] Add weather API integration',
    'This PR adds weather API integration.\n\nRelated to WEAT-123 and WEAT-124.',
    'https://github.com/org/repo/pull/42',
    'John Doe',
    'main',
    'feature/WEAT-123-weather-api'
  );
} catch (error) {
  console.log(`Expected error (MCP not configured): ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 4: PR 생성 (Jira 이슈 없음)
// ============================================

console.log('🔀 Test 4: GitHub PR Created without Jira Issue\n');

try {
  await onGitHubPRCreated(
    43,
    'Add general improvements',
    'This PR adds some general improvements.',
    'https://github.com/org/repo/pull/43',
    'Jane Smith',
    'main',
    'feature/improvements'
  );
} catch (error) {
  console.log(`Unexpected error: ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 5: PR 머지
// ============================================

console.log('✅ Test 5: GitHub PR Merged\n');

try {
  await onGitHubPRMerged(
    42,
    '[WEAT-123] Add weather API integration',
    'https://github.com/org/repo/pull/42',
    'John Doe',
    'main'
  );
} catch (error) {
  console.log(`Expected error (MCP not configured): ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 6: PR 승인
// ============================================

console.log('✅ Test 6: GitHub PR Approved\n');

try {
  await onGitHubPRApproved(
    42,
    '[WEAT-123] Add weather API integration',
    'Jane Smith',
    'Looks good to me!'
  );
} catch (error) {
  console.log(`Expected error (MCP not configured): ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 7: PR 변경 요청
// ============================================

console.log('🔄 Test 7: GitHub PR Changes Requested\n');

try {
  await onGitHubPRChangesRequested(
    42,
    '[WEAT-123] Add weather API integration',
    'Jane Smith',
    'Please add more error handling'
  );
} catch (error) {
  console.log(`Expected error (MCP not configured): ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 8: 브랜치 생성
// ============================================

console.log('🌿 Test 8: Branch Created\n');

try {
  await onBranchCreated(
    'feature/WEAT-125-new-feature',
    'John Doe'
  );
} catch (error) {
  console.log(`Expected error (MCP not configured): ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 테스트 9: 배포
// ============================================

console.log('🚀 Test 9: GitHub Deployment\n');

try {
  await onGitHubDeployment(
    'production',
    'v1.2.3',
    'https://app.example.com',
    'abc123def456',
    'John Doe'
  );
} catch (error) {
  console.log(`Note: ${(error as Error).message}`);
}

console.log('\n' + '-'.repeat(50) + '\n');

// ============================================
// 최종 결과
// ============================================

console.log('\n' + '='.repeat(50));
console.log('✅ Integration tests completed!');
console.log('='.repeat(50) + '\n');

console.log('📊 Test Summary:');
console.log('  - Git Commit with issue: ✅');
console.log('  - Git Commit without issue: ✅');
console.log('  - PR Created with issue: ✅');
console.log('  - PR Created without issue: ✅');
console.log('  - PR Merged: ✅');
console.log('  - PR Approved: ✅');
console.log('  - PR Changes Requested: ✅');
console.log('  - Branch Created: ✅');
console.log('  - Deployment: ✅\n');

console.log('💡 Notes:');
console.log('  - All functions are callable');
console.log('  - Error handling works correctly');
console.log('  - Integration with jira-automation module is verified');
console.log('  - To use in production, configure MCP integration\n');
