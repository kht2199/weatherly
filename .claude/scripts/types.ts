/**
 * Type definitions for Agent Communication and Jira Automation
 */

// ============================================
// Agent Types
// ============================================

export type AgentType =
  | 'coordinator'
  | 'frontend'
  | 'backend'
  | 'design'
  | 'qa'
  | 'security'
  | 'devops'
  | 'deploy'
  | 'documentation';

// ============================================
// Message Types
// ============================================

export type MessageType =
  // Task related
  | 'task_assignment'
  | 'task_status'
  | 'task_completion'
  | 'task_blocked'
  // Review related
  | 'review_request'
  | 'review_completed'
  | 'review_feedback'
  // Information sharing
  | 'information'
  | 'notification'
  | 'alert'
  | 'question'
  // Collaboration
  | 'collaboration_request'
  | 'resource_ready'
  | 'dependency_update'
  // Error
  | 'error';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type Environment = 'dev' | 'staging' | 'production';

// ============================================
// Message Structure
// ============================================

export interface AgentMessage {
  // Metadata
  id: string;
  timestamp: string;
  version: string;

  // Sender and receiver
  from: AgentType;
  to: AgentType | AgentType[];

  // Message content
  type: MessageType;
  priority: Priority;
  payload: any;

  // Context
  context: {
    jiraIssue?: string;
    parentMessageId?: string;
    threadId?: string;
    environment?: Environment;
  };

  // Options
  options?: {
    requiresResponse?: boolean;
    responseDeadline?: string;
    retryable?: boolean;
    ttl?: number;
  };
}

// ============================================
// Payload Types
// ============================================

export interface TaskAssignmentPayload {
  jiraIssue: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  deadline?: string;
  dependencies?: string[];
  resources?: {
    documents?: string[];
    apis?: string[];
    credentials?: string[];
  };
  estimatedEffort?: string;
}

export interface TaskStatusPayload {
  jiraIssue: string;
  status: 'in_progress' | 'blocked' | 'review' | 'completed';
  progress: number;
  summary: string;
  blockers?: Array<{
    description: string;
    blockingIssue?: string;
    resolution?: string;
  }>;
  nextSteps?: string[];
  estimatedCompletion?: string;
  metrics?: {
    testsWritten?: number;
    codeCoverage?: number;
    linesOfCode?: number;
  };
}

export interface ReviewRequestPayload {
  jiraIssue: string;
  reviewType: 'code' | 'design' | 'security' | 'documentation';
  title: string;
  description: string;
  artifacts: Array<{
    type: 'pr' | 'design' | 'document' | 'deployment';
    url: string;
    description?: string;
  }>;
  checkpoints: string[];
  deadline?: string;
  context?: string;
}

export interface ReviewCompletedPayload {
  jiraIssue: string;
  reviewType: 'code' | 'design' | 'security' | 'documentation';
  result: 'approved' | 'approved_with_comments' | 'changes_requested';
  summary: string;
  issues: Array<{
    severity: 'critical' | 'major' | 'minor' | 'suggestion';
    description: string;
    location?: string;
    suggestion?: string;
    mustFix: boolean;
  }>;
  positives?: string[];
  metrics?: any;
}

export interface TaskBlockedPayload {
  jiraIssue: string;
  blockers: Array<{
    type: 'dependency' | 'resource' | 'technical' | 'external';
    description: string;
    blockingIssue?: string;
    blockingAgent?: AgentType;
    impact: 'critical' | 'high' | 'medium' | 'low';
    proposedSolution?: string;
  }>;
  currentStatus: string;
  urgency: 'immediate' | 'urgent' | 'normal';
}

export interface ResourceReadyPayload {
  jiraIssue: string;
  resourceType: 'api' | 'design' | 'infrastructure' | 'documentation';
  resource: {
    name: string;
    description: string;
    url?: string;
    credentials?: string;
    documentation?: string;
  };
  readyFor: AgentType[];
  notes?: string;
}

export interface ErrorPayload {
  errorCode: string;
  errorMessage: string;
  originalMessage?: string;
  stackTrace?: string;
  recoverable: boolean;
  suggestedAction?: string;
}

// ============================================
// Jira Types
// ============================================

export interface JiraIssue {
  key: string;
  id: string;
  fields: {
    summary: string;
    description?: string;
    issuetype: { name: string };
    status: { name: string };
    assignee?: { accountId: string; displayName: string };
    priority?: { name: string };
    labels: string[];
    created: string;
    updated: string;
    [key: string]: any;
  };
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    name: string;
    id: string;
  };
}

export interface JiraComment {
  id: string;
  author: {
    accountId: string;
    displayName: string;
  };
  body: any;
  created: string;
  updated: string;
}

export interface JiraWorklog {
  timeSpent: string;
  comment?: string;
  started: string;
}

export interface JiraVersion {
  id: string;
  name: string;
  released: boolean;
  releaseDate?: string;
  description?: string;
}

// ============================================
// Utility Types
// ============================================

export interface MessageLog {
  message: AgentMessage;
  delivered: boolean;
  deliveredAt?: string;
  responseReceived?: boolean;
  responseReceivedAt?: string;
  retryCount: number;
}

export interface AgentCommunicationMetrics {
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
