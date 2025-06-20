'use client';

import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/provider/statecontext';
import { createWorkflow } from '@/lib/api'; 
import { serializeWorkflowForBackend } from '@/lib/serializeWorkflowData';

export default function SaveWorkflowButton() {
  const { getWorkflowExecutionData } = useWorkflow();

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
    } catch (error) {
      console.error('❌ Error saving workflow:', error);
    }
  };

  return (
    <Button onClick={handleSave}>
      Save Workflow
    </Button>
  );
}
