import axios from 'axios';

export async function createWorkflow(data: {
  name: string;
  description?: string;
  workflowData: any;
}) {
  try {
    const rawToken = localStorage.getItem('__Pearl_Token');
    if (!rawToken) throw new Error('User not authenticated');

    const token = `Bearer ${rawToken}`;

    const response = await axios.post(
      'http://localhost:2706/api/v1/workflows',
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error; 
  }
}
