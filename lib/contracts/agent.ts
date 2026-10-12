import type { ToolCapability } from './tools'

/** Describes an agent configuration independent of how it is built. */
export interface AgentProfile {
  id: string
  /** Capabilities the profile requests; the registry grants a subset. */
  capabilities: readonly ToolCapability[]
  maxSteps: number
}

export const RESEARCHER_PROFILE: AgentProfile = {
  id: 'researcher',
  capabilities: ['web'],
  maxSteps: 50
}
