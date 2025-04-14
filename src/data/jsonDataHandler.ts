export const jsonDataHandler = {
    get: async <T>(url: string)=> {
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data: T = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching observations:', error);
            throw error;
        }
    },
    post: async <T>(url: string, data: T) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }
}