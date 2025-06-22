'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { runWorkflow } from '@/lib/api';
import { getGoogleAccessToken } from '@/lib/google';
import { useGoogleAccessTokenLogin } from '@/hooks/useGoogleAuth';

export default function RunWorkflowButton({ workflowId }: { workflowId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const loginGoogle = useGoogleAccessTokenLogin();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      let googleToken = getGoogleAccessToken();
      if (!googleToken) {
        googleToken = await loginGoogle();
      }

      const result = await runWorkflow(workflowId, googleToken);
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
