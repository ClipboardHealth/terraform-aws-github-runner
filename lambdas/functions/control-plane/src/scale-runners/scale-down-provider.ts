import type { RunnerProvider } from '@aws-github-runner/runner-provider';

export interface RunnerList {
  id: string;
  launchTime?: Date;
  owner?: string;
  type?: string;
  repo?: string;
  org?: string;
  orphan?: boolean;
  githubRunnerId?: string;
  bypassRemoval?: boolean;
  idleDetectedAt?: string;
}

export interface RunnerInfo extends RunnerList {
  owner: string;
  type: string;
}

export interface ScaleDownRunnerProvider extends RunnerProvider {
  list(environment: string, orphan?: boolean): Promise<RunnerList[]>;
  bootTimeExceeded(runner: RunnerInfo): boolean;
  markOrphan(id: string): Promise<void>;
  unmarkOrphan(id: string): Promise<void>;
  /** Persist the first not-busy observation for a later scale-down invocation. */
  markIdle?(id: string, detectedAt: string): Promise<void>;
  /** Remove a prior observation when the runner is no longer a scale-down candidate. */
  unmarkIdle?(id: string): Promise<void>;
  terminate(id: string): Promise<void>;
}
