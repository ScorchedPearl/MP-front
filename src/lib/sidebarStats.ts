export type SidebarStats = {
    draftWorkflows: number
    activeWorkflows: number
    failedExecutions: number
    recentRuns: number
    scheduled: number
  }
  
  export async function fetchSidebarStats(): Promise<SidebarStats> {
    const token = localStorage.getItem("token");

    if (!token || token === "null") {
    console.error("No valid token found in localStorage.");
    throw new Error("Unauthenticated");
    }

    const res = await fetch("http://localhost:2706/api/v1/workflows/sidebar-stats", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch sidebar stats: ${res.status}`);
    }
  
    return res.json();
  }
  
  