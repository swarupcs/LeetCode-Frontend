import axios from "@/config/axiosConfig";


export const deleteProblem = async (problemId) => {
    try {
        const response = await axios.delete(`/problems/delete-problem/${problemId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response.data;
    }
}