import { useState } from 'react'

interface UseMutationState {
    loading: boolean;
    data?: object;
    error?: object;
}

type UseMutatoinResult = [(data: any) => void, UseMutationState];

export default function useMutation(url: string): UseMutatoinResult {
    const [state, setState] = useState({ loading: false, data: undefined, error: undefined })

    function mutation(data: any) {
        setState(prev => ({ ...prev, loading: true }));
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        }).then((response) => response.json().catch(() => { })).then((data) => setState(prev => ({ ...prev, data, loading: false }))).catch(error => setState(prev => ({ ...prev, error, loading: false })));
    }

    return [mutation, { ...state }]
}