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

export async function runWorkflow(workflowId: string) {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${API_BASE_URL}/${workflowId}/run`, {}, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error running workflow:', error);
    throw error;
  }
}
