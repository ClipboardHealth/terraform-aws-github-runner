import { bootTimeExceeded, listEC2Runners, tag, terminateRunner, untag } from './../aws/ec2-runners';
import type { RunnerList } from './../aws/ec2-runners.d';
import type { RunnerList as ScaleDownRunnerList, ScaleDownRunnerProvider } from './scale-down-provider';

async function listEc2ScaleDownRunners(environment: string, orphan?: boolean): Promise<ScaleDownRunnerList[]> {
  return (await listEC2Runners({ environment, orphan })).map(toScaleDownRunner);
}

async function markEc2RunnerOrphan(id: string): Promise<void> {
  await tag(id, [{ Key: 'ghr:orphan', Value: 'true' }]);
}

async function unmarkEc2RunnerOrphan(id: string): Promise<void> {
  await untag(id, [{ Key: 'ghr:orphan', Value: 'true' }]);
}

export const IDLE_DETECTED_TAG = 'ghr:idle_detected_at';

async function markEc2RunnerIdle(id: string, detectedAt: string): Promise<void> {
  await tag(id, [{ Key: IDLE_DETECTED_TAG, Value: detectedAt }]);
}

async function unmarkEc2RunnerIdle(id: string): Promise<void> {
  await untag(id, [{ Key: IDLE_DETECTED_TAG }]);
}

export function createEc2ScaleDownProvider(): Omit<ScaleDownRunnerProvider, 'type'> {
  return {
    list: listEc2ScaleDownRunners,
    bootTimeExceeded,
    markOrphan: markEc2RunnerOrphan,
    unmarkOrphan: unmarkEc2RunnerOrphan,
    markIdle: markEc2RunnerIdle,
    unmarkIdle: unmarkEc2RunnerIdle,
    terminate: terminateRunner,
  };
}

function toScaleDownRunner(runner: RunnerList): ScaleDownRunnerList {
  return {
    id: runner.instanceId,
    launchTime: runner.launchTime,
    owner: runner.owner,
    type: runner.type,
    repo: runner.repo,
    org: runner.org,
    orphan: runner.orphan,
    githubRunnerId: runner.runnerId,
    bypassRemoval: runner.bypassRemoval,
    idleDetectedAt: runner.idleDetectedAt,
  };
}
