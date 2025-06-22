import axios from 'axios';

const API_BASE_URL = 'http://localhost:2706/api/v1/workflows';

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

function getAuthToken() {
  const rawToken = localStorage.getItem('__Pearl_Token');
  if (!rawToken) throw new Error('User not authenticated');
  return `Bearer ${rawToken}`;
}

export async function runWorkflow(workflowId: string, googleToken?: string) {
  try {
    const headers: any = {
      Authorization: getAuthToken(),
    };

    if (googleToken) {
      headers['X-Google-Access-Token'] = googleToken; 
    }

    const response = await axios.post(`${API_BASE_URL}/${workflowId}/run`, {}, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error running workflow:', error);
    throw error;
  }
}


