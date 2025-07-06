import { useEffect, useState } from "react";

export default function useQuery<T>(queryFunction: () => Promise<T>, autoQuery = true) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const executeQuery = async() => {
        setLoading(true);
        setError(null);

        try {
            const result = await queryFunction();
            setData(result);
        }
        catch (error) {
            setError(error instanceof Error ? error : new Error("An unexpected error occurred"));
        }
        finally {
            setLoading(false);
        }
    }

    const resetQuery = () => {
        setData(null);
        setLoading(true);
        setError(null);
    }

    useEffect(() => {
        if (autoQuery) {
            executeQuery();
        }
    }, []);

    return {
        data,
        loading,
        error,
        requeryFunction: executeQuery,
        resetQueryFunction: resetQuery
    }
}