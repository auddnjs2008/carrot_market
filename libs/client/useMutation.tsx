import { useState } from 'react'

interface UseMutationState {
    loading: boolean;
    data?: object;
    error?: object;
}

type UseMutatoinResult = [(data: any) => void, UseMutationState];

export default function useMutation(url: string): UseMutatoinResult {
    const [state, setState] = useState({ loading: false, data: undefined, error: undefined })
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<undefined | any>(undefined);
    const [error, setError] = useState<undefined | any>(undefined);
    function mutation(data: any) {
        setState(prev => ({ ...prev, loading: true }));
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        }).then((response) => response.json().catch(() => { })).then((data) => setState(prev => ({ ...prev, data, loading: false }))).catch(error => setState(prev => ({ ...prev, error, loading: false }))).finally(() => setLoading(false));
    }

    return [mutation, { loading, data, error }]
}