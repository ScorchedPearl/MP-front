'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { runWorkflow } from '@/lib/api'

export default function RunWorkflowButton({ workflowId }: { workflowId: string }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await runWorkflow(workflowId);
      console.log('🚀 Workflow run started:', result);
    } catch (error) {
      console.error('❌ Failed to run workflow:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Button onClick={handleRun} disabled={isRunning}>
      {isRunning ? 'Running...' : 'Run Workflow'}
    </Button>
  );
}
