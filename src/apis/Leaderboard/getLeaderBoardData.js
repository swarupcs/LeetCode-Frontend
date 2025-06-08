import axios from '@/config/axiosConfig';



export const getLeaderBoardDataRequest = async () => {
    try {
        const response = await axios.get('/leaderboard/getLeaderboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw error.response ? error.response.data : 'Network Error';
        
    }
}