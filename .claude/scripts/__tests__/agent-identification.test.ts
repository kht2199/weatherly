/**
 * Agent Identification 테스트
 *
 * Agent별 식별 및 Jira 표시 기능을 검증합니다.
 */

import { AgentType, AGENT_METADATA } from '../types';

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

// ============================================
// AGENT_METADATA 테스트
// ============================================

console.log('\n🔍 Testing AGENT_METADATA...\n');

// 테스트 1: 모든 Agent가 metadata를 가지고 있는지
const agents: AgentType[] = [
  'coordinator',
  'frontend',
  'backend',
  'design',
  'qa',
  'security',
  'devops',
  'deploy',
  'documentation'
];

agents.forEach(agent => {
  const metadata = AGENT_METADATA[agent];
  assert(metadata !== undefined, `Metadata exists for ${agent}`);
  assert(metadata.name.length > 0, `${agent} has name`);
  assert(metadata.emoji.length > 0, `${agent} has emoji`);
  assert(metadata.color.startsWith('#'), `${agent} has valid color`);
  assert(metadata.role.length > 0, `${agent} has role`);
  assert(metadata.jiraLabel.startsWith('agent:'), `${agent} has valid jiraLabel`);
});

// ============================================
// Agent Header 포맷 테스트
// ============================================

console.log('\n📝 Testing Agent Header Format...\n');

// formatAgentHeader 함수 시뮬레이션
function formatAgentHeader(agent: AgentType): string {
  const metadata = AGENT_METADATA[agent];
  return `${metadata.emoji} **${metadata.name} Agent** (${metadata.role})`;
}

// 테스트 2: Frontend Agent 헤더
const frontendHeader = formatAgentHeader('frontend');
assert(frontendHeader.includes('🎨'), 'Frontend has paint emoji');
assert(frontendHeader.includes('Frontend Agent'), 'Frontend has correct name');
assert(frontendHeader.includes('Frontend Development'), 'Frontend has correct role');

// 테스트 3: Backend Agent 헤더
const backendHeader = formatAgentHeader('backend');
assert(backendHeader.includes('⚙️'), 'Backend has gear emoji');
assert(backendHeader.includes('Backend Agent'), 'Backend has correct name');
assert(backendHeader.includes('Backend Development'), 'Backend has correct role');

// 테스트 4: QA Agent 헤더
const qaHeader = formatAgentHeader('qa');
assert(qaHeader.includes('🔍'), 'QA has magnifying glass emoji');
assert(qaHeader.includes('QA Agent'), 'QA has correct name');
assert(qaHeader.includes('Quality Assurance'), 'QA has correct role');

// ============================================
// Jira Label 생성 테스트
// ============================================

console.log('\n🏷️  Testing Jira Label Generation...\n');

// getAgentLabel 함수 시뮬레이션
function getAgentLabel(agent: AgentType): string {
  return AGENT_METADATA[agent].jiraLabel;
}

// 테스트 5: Label 형식 확인
agents.forEach(agent => {
  const label = getAgentLabel(agent);
  assert(label.startsWith('agent:'), `${agent} label starts with 'agent:'`);
  assert(label === `agent:${agent}`, `${agent} label matches expected format`);
});

// ============================================
// 고유성 테스트
// ============================================

console.log('\n🔑 Testing Uniqueness...\n');

// 테스트 6: 모든 emoji가 고유한지
const emojis = Object.values(AGENT_METADATA).map(m => m.emoji);
const uniqueEmojis = new Set(emojis);
assert(emojis.length === uniqueEmojis.size, 'All emojis are unique');

// 테스트 7: 모든 label이 고유한지
const labels = Object.values(AGENT_METADATA).map(m => m.jiraLabel);
const uniqueLabels = new Set(labels);
assert(labels.length === uniqueLabels.size, 'All labels are unique');

// 테스트 8: 모든 color가 유효한 hex 코드인지
const colors = Object.values(AGENT_METADATA).map(m => m.color);
colors.forEach(color => {
  assert(/^#[0-9A-F]{6}$/i.test(color), `Color ${color} is valid hex`);
});

// ============================================
// Jira 코멘트 포맷 시뮬레이션 테스트
// ============================================

console.log('\n💬 Testing Jira Comment Format...\n');

// 작업 시작 코멘트 생성
function createStartComment(agent: AgentType, issueKey: string): string {
  const agentHeader = formatAgentHeader(agent);
  const startTime = new Date().toISOString();
  return `## ${agentHeader}\n\n⏱️ **작업 시작**\n\n**시작 시간:** ${startTime}\n**상태:** In Progress\n**이슈:** ${issueKey}`;
}

// 작업 완료 코멘트 생성
function createCompleteComment(agent: AgentType, summary: string): string {
  const agentHeader = formatAgentHeader(agent);
  const completionTime = new Date().toISOString();
  return `## ${agentHeader}\n\n✅ **작업 완료**\n\n**완료 시간:** ${completionTime}\n\n### 작업 요약\n${summary}`;
}

// 테스트 9: 시작 코멘트 포맷
const startComment = createStartComment('frontend', 'PROJ-123');
assert(startComment.includes('🎨'), 'Start comment has emoji');
assert(startComment.includes('Frontend Agent'), 'Start comment has agent name');
assert(startComment.includes('작업 시작'), 'Start comment has start label');
assert(startComment.includes('PROJ-123'), 'Start comment has issue key');

// 테스트 10: 완료 코멘트 포맷
const completeComment = createCompleteComment('backend', 'API 개발 완료');
assert(completeComment.includes('⚙️'), 'Complete comment has emoji');
assert(completeComment.includes('Backend Agent'), 'Complete comment has agent name');
assert(completeComment.includes('작업 완료'), 'Complete comment has completion label');
assert(completeComment.includes('API 개발 완료'), 'Complete comment has summary');

// ============================================
// Agent Communication 포맷 테스트
// ============================================

console.log('\n📨 Testing Agent Communication Format...\n');

function formatAgentCommunication(from: AgentType, to: AgentType, message: string): string {
  const fromHeader = formatAgentHeader(from);
  const toHeader = formatAgentHeader(to);
  return `## 📨 Agent Communication\n\n**From:** ${fromHeader}\n**To:** ${toHeader}\n\n### Message\n${message}`;
}

// 테스트 11: Communication 포맷
const commMessage = formatAgentCommunication('frontend', 'backend', 'API 스펙 확인 요청');
assert(commMessage.includes('🎨'), 'Communication has from emoji');
assert(commMessage.includes('⚙️'), 'Communication has to emoji');
assert(commMessage.includes('Frontend Agent'), 'Communication has from agent');
assert(commMessage.includes('Backend Agent'), 'Communication has to agent');
assert(commMessage.includes('API 스펙 확인 요청'), 'Communication has message');

// ============================================
// 최종 결과
// ============================================

console.log('\n' + '='.repeat(50));
console.log('✅ All agent identification tests passed!');
console.log('='.repeat(50) + '\n');

console.log('📊 Test Summary:');
console.log('  - Agent Metadata: ✅ All 9 agents have complete metadata');
console.log('  - Header Format: ✅ Emoji, name, and role properly formatted');
console.log('  - Jira Labels: ✅ All labels follow agent:name pattern');
console.log('  - Uniqueness: ✅ All emojis and labels are unique');
console.log('  - Colors: ✅ All colors are valid hex codes');
console.log('  - Comments: ✅ Start and complete comments properly formatted');
console.log('  - Communication: ✅ Agent-to-agent messages properly formatted\n');

console.log('🎯 Agent Identification Summary:\n');
agents.forEach(agent => {
  const meta = AGENT_METADATA[agent];
  console.log(`  ${meta.emoji} ${meta.name.padEnd(15)} → ${meta.jiraLabel.padEnd(20)} (${meta.role})`);
});
console.log();
