// 'use client';

// import { Button } from '@/components/ui/button';
// import { useState } from 'react';
// import { runWorkflow } from "@/lib/api";
// import { getGoogleToken } from "@/lib/google";
// import { useGoogleAccessTokenLogin } from "@/hooks/useGoogleAuth";

// interface RunWorkflowButtonProps {
//   workflowId: string;
//   workflowData?: any;
// }

// export default function RunWorkflowButton({ workflowId, workflowData }: RunWorkflowButtonProps) {
//   const [isRunning, setIsRunning] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const loginGoogle = useGoogleAccessTokenLogin();

//   const handleRun = async () => {
//     setIsRunning(true);
//     setError(null);

//     try {
//       console.log('🚀 Starting workflow execution:', workflowId);

//       let googleToken = getGoogleToken();
//       const needsGoogleLogin = detectGoogleAuthRequirement(workflowData);

//       if (needsGoogleLogin && !googleToken) {
//         console.log('🔐 Prompting Google login...');
//         googleToken = await loginGoogle();
//         console.log('✅ Google login successful');
//       }

//       const result = await runWorkflow(workflowId, workflowData, googleToken || undefined);
//       console.log('✅ Workflow execution result:', result);
//     } catch (error) {
//       console.error('❌ Workflow execution failed:', error);
//       setError(error instanceof Error ? error.message : 'Unknown error');
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <Button onClick={handleRun} disabled={isRunning}>
//         {isRunning ? 'Running...' : 'Run Workflow'}
//       </Button>

//       {error && (
//         <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
//           Error: {error}
//         </div>
//       )}
//     </div>
//   );
// }

// // ✅ Detect nodes that require Google auth
// function detectGoogleAuthRequirement(workflowData: any): boolean {
//   if (!workflowData || !workflowData.nodes) return false;

//   const nodes = Object.values(workflowData.nodes);

//   return nodes.some((node: any) => {
//     const url = node?.data?.url || '';
//     const explicit = node?.data?.useGoogleAuth === true;
//     return url.includes('googleapis.com') || explicit;
//   });
// }
