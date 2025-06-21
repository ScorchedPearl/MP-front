'use client';

import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/provider/statecontext';
import { createWorkflow } from '@/lib/api';
import { serializeWorkflowForBackend } from '@/lib/serializeWorkflowData';
import RunWorkflowButton from './RunWorkflowButton'; 
import { useState } from 'react';

export default function SaveWorkflowButton() {
  const { getWorkflowExecutionData } = useWorkflow();
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const handleSave = async () => {
    const fullWorkflow = getWorkflowExecutionData();

    const payload = {
      name: fullWorkflow.metadata.name,
      description: fullWorkflow.metadata.description,
      workflowData: serializeWorkflowForBackend(fullWorkflow),
    };

    try {
      const response = await createWorkflow(payload);
      console.log('✅ Workflow saved successfully:', response);
      setWorkflowId(response.id); 
    } catch (error) {
      console.error('❌ Error saving workflow:', error);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <Button onClick={handleSave}>Save Workflow</Button>
      {workflowId && <RunWorkflowButton workflowId={workflowId} />}
    </div>
  );
}
