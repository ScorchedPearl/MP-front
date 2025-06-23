import axios from 'axios';

const API_BASE_URL = 'http://localhost:2706/api/v1/workflows';

function getAuthToken() {
  const rawToken = localStorage.getItem('__Pearl_Token');
  if (!rawToken) throw new Error('User not authenticated');
  return `Bearer ${rawToken}`;
}

export async function createWorkflow(data: {
  name: string;
  description?: string;
  workflowData: any;
}) {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${API_BASE_URL}`, data, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
}


export async function runWorkflow(
  workflowId: string,
  workflowData: any = {},
  googleToken?: string
) {
  console.log("📌 runWorkflow called with ID:", workflowId);
  try {
    const headers: Record<string, string> = {
      Authorization: getAuthToken(),
      "Content-Type": "application/json",
    };

    const nodes = Object.values(workflowData?.nodes || {});
    const hasGoogleNode = nodes.some((node: any) => {
      const url = node?.data?.url || "";
      const explicitGoogle = node?.data?.useGoogleAuth === true;
      return url.includes("googleapis.com") || explicitGoogle;
    });
    console.log("hello");
    if (hasGoogleNode) {
      const tokenToUse = googleToken || localStorage.getItem("__Google_Access_Token__");
      console.log("🔐 Token being sent:", tokenToUse);
      if (tokenToUse) {
        headers["X-Google-Access-Token"] = tokenToUse;
      } else {
        console.warn("⚠️ Missing Google access token for workflow with Google-auth node");
      }
    }

    const response = await axios.post(
      `${API_BASE_URL}/${workflowId}/run`,
      workflowData,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Error running workflow:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Workflow run failed");
    }
    throw error;
  }
}


