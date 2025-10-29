/**
 * GitHub-Jira Integration 테스트 스크립트
 *
 * 주요 메서드들의 동작을 확인합니다.
 */

import {
  extractJiraIssuesFromCommit,
  extractJiraIssueFromPRTitle,
  extractJiraIssuesFromPRDescription,
  extractJiraIssueFromBranch,
} from '../github-jira-integration';

// ============================================
// 테스트 헬퍼
// ============================================

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

function assertArrayEquals(actual: string[], expected: string[], message: string): void {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();

  if (actualSorted.length !== expectedSorted.length ||
      !actualSorted.every((val, idx) => val === expectedSorted[idx])) {
    console.error(`❌ FAIL: ${message}`);
    console.error(`  Expected: [${expectedSorted.join(', ')}]`);
    console.error(`  Actual:   [${actualSorted.join(', ')}]`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

function assertNull(value: any, message: string): void {
  if (value !== null) {
    console.error(`❌ FAIL: ${message}`);
    console.error(`  Expected: null`);
    console.error(`  Actual:   ${value}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

// ============================================
// extractJiraIssuesFromCommit 테스트
// ============================================

console.log('\n📝 Testing extractJiraIssuesFromCommit...\n');

// 테스트 1: 괄호 안에 이슈 키가 있는 경우
const test1 = extractJiraIssuesFromCommit('feat: add login feature (PROJ-123)');
assertArrayEquals(test1, ['PROJ-123'], 'Should extract issue from parentheses');

// 테스트 2: 대괄호 안에 이슈 키가 있는 경우
const test2 = extractJiraIssuesFromCommit('[PROJ-456] fix: resolve bug');
assertArrayEquals(test2, ['PROJ-456'], 'Should extract issue from brackets');

// 테스트 3: 여러 이슈 키가 있는 경우
const test3 = extractJiraIssuesFromCommit('feat: implement features (PROJ-123, PROJ-456, WEAT-789)');
assertArrayEquals(test3, ['PROJ-123', 'PROJ-456', 'WEAT-789'], 'Should extract multiple issues');

// 테스트 4: 이슈 키가 없는 경우
const test4 = extractJiraIssuesFromCommit('feat: add new feature without issue');
assertArrayEquals(test4, [], 'Should return empty array when no issue');

// 테스트 5: 다양한 프로젝트 키
const test5 = extractJiraIssuesFromCommit('fix: bug fixes ABC-1 XYZ-999 WEATHER-42');
assertArrayEquals(test5, ['ABC-1', 'XYZ-999', 'WEATHER-42'], 'Should extract various project keys');

// 테스트 6: 소문자는 매치되지 않아야 함
const test6 = extractJiraIssuesFromCommit('feat: test proj-123 PROJ-456');
assertArrayEquals(test6, ['PROJ-456'], 'Should not match lowercase project keys');

// ============================================
// extractJiraIssueFromPRTitle 테스트
// ============================================

console.log('\n🔀 Testing extractJiraIssueFromPRTitle...\n');

// 테스트 1: 대괄호 안에 이슈 키
const pr1 = extractJiraIssueFromPRTitle('[PROJ-123] Add login feature');
assert(pr1 === 'PROJ-123', 'Should extract issue from brackets in PR title');

// 테스트 2: 콜론 뒤에 이슈 키
const pr2 = extractJiraIssueFromPRTitle('PROJ-456: Fix authentication bug');
assert(pr2 === 'PROJ-456', 'Should extract issue with colon format');

// 테스트 3: 이슈 키가 중간에 있는 경우
const pr3 = extractJiraIssueFromPRTitle('Feature: PROJ-789 Implement new API');
assert(pr3 === 'PROJ-789', 'Should extract issue from middle of title');

// 테스트 4: 이슈 키가 없는 경우
const pr4 = extractJiraIssueFromPRTitle('Add new feature without issue');
assertNull(pr4, 'Should return null when no issue in PR title');

// 테스트 5: 여러 이슈가 있는 경우 (첫 번째만 반환)
const pr5 = extractJiraIssueFromPRTitle('PROJ-111 and PROJ-222 combined fix');
assert(pr5 === 'PROJ-111', 'Should return first issue when multiple exist');

// ============================================
// extractJiraIssuesFromPRDescription 테스트
// ============================================

console.log('\n📄 Testing extractJiraIssuesFromPRDescription...\n');

// 테스트 1: 단일 이슈
const desc1 = extractJiraIssuesFromPRDescription('This PR fixes PROJ-123');
assertArrayEquals(desc1, ['PROJ-123'], 'Should extract issue from description');

// 테스트 2: 여러 이슈
const desc2 = extractJiraIssuesFromPRDescription(`
## Summary
This PR addresses PROJ-123 and PROJ-456.

## Related Issues
- WEAT-789
- WEAT-800
`);
assertArrayEquals(desc2, ['PROJ-123', 'PROJ-456', 'WEAT-789', 'WEAT-800'], 'Should extract multiple issues from description');

// 테스트 3: 이슈가 없는 경우
const desc3 = extractJiraIssuesFromPRDescription('This is a general improvement without specific issues');
assertArrayEquals(desc3, [], 'Should return empty array when no issues');

// 테스트 4: 중복된 이슈 (정규식은 중복도 반환함)
const desc4 = extractJiraIssuesFromPRDescription('PROJ-123 fixes the bug mentioned in PROJ-123');
assertArrayEquals(desc4, ['PROJ-123', 'PROJ-123'], 'Should return duplicates as regex matches');

// ============================================
// extractJiraIssueFromBranch 테스트
// ============================================

console.log('\n🌿 Testing extractJiraIssueFromBranch...\n');

// 테스트 1: feature 브랜치
const branch1 = extractJiraIssueFromBranch('feature/PROJ-123-login-feature');
assert(branch1 === 'PROJ-123', 'Should extract issue from feature branch');

// 테스트 2: bugfix 브랜치
const branch2 = extractJiraIssueFromBranch('bugfix/PROJ-456-fix-auth-bug');
assert(branch2 === 'PROJ-456', 'Should extract issue from bugfix branch');

// 테스트 3: 이슈 키가 앞에 있는 경우
const branch3 = extractJiraIssueFromBranch('WEAT-789/implement-api');
assert(branch3 === 'WEAT-789', 'Should extract issue from beginning of branch name');

// 테스트 4: 이슈 키가 없는 경우
const branch4 = extractJiraIssueFromBranch('feature/add-new-feature');
assertNull(branch4, 'Should return null when no issue in branch name');

// 테스트 5: main/develop 브랜치
const branch5 = extractJiraIssueFromBranch('main');
assertNull(branch5, 'Should return null for main branch');

const branch6 = extractJiraIssueFromBranch('develop');
assertNull(branch6, 'Should return null for develop branch');

// ============================================
// Edge Cases 테스트
// ============================================

console.log('\n⚠️  Testing Edge Cases...\n');

// Edge Case 1: 빈 문자열
const edge1 = extractJiraIssuesFromCommit('');
assertArrayEquals(edge1, [], 'Should handle empty string');

// Edge Case 2: 특수 문자가 포함된 커밋 메시지
const edge2 = extractJiraIssuesFromCommit('feat: add feature (PROJ-123) & fix bug [PROJ-456]');
assertArrayEquals(edge2, ['PROJ-123', 'PROJ-456'], 'Should handle special characters');

// Edge Case 3: 숫자만 있는 경우 (이슈 키 아님)
const edge3 = extractJiraIssuesFromCommit('feat: version 123 update');
assertArrayEquals(edge3, [], 'Should not match numbers only');

// Edge Case 4: 프로젝트 키만 있는 경우 (숫자 없음)
const edge4 = extractJiraIssuesFromCommit('feat: PROJ update');
assertArrayEquals(edge4, [], 'Should not match project key without number');

// Edge Case 5: 하이픈이 여러 개인 경우
const edge5 = extractJiraIssuesFromCommit('feat: PROJ-123-456 test');
assertArrayEquals(edge5, ['PROJ-123'], 'Should extract first valid pattern');

// Edge Case 6: 긴 프로젝트 키
const edge6 = extractJiraIssuesFromCommit('feat: VERYLONGPROJECTKEY-999');
assertArrayEquals(edge6, ['VERYLONGPROJECTKEY-999'], 'Should handle long project keys');

// Edge Case 7: 작은 숫자와 큰 숫자
const edge7 = extractJiraIssuesFromCommit('feat: PROJ-1 PROJ-999999');
assertArrayEquals(edge7, ['PROJ-1', 'PROJ-999999'], 'Should handle various number lengths');

// ============================================
// 최종 결과
// ============================================

console.log('\n' + '='.repeat(50));
console.log('✅ All tests passed!');
console.log('='.repeat(50) + '\n');

console.log('📊 Test Summary:');
console.log('  - extractJiraIssuesFromCommit: 6 tests');
console.log('  - extractJiraIssueFromPRTitle: 5 tests');
console.log('  - extractJiraIssuesFromPRDescription: 4 tests');
console.log('  - extractJiraIssueFromBranch: 6 tests');
console.log('  - Edge Cases: 7 tests');
console.log('  - Total: 28 tests\n');
