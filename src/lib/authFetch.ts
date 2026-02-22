

export const authFetch2 = async (
    url: string,
    options: RequestInit = {},
    accessToken: string | null,
    setAccessToken: (token: string | null) => void
) => {
    let res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: accessToken ?
                `Bearer ${accessToken}`
                : ""
        }
    });

    if (res.status === 401) {
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST"
        });

        if (!refreshRes.ok) {
            setAccessToken(null);
            throw new Error("Session Expired")
        }

        const data = await res.json();
        setAccessToken(data.accessToken);

        res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${data.accessToken}`
            }
        })
    }

    return res
}

export const authFetch = async (
    url: string,
    options: RequestInit,
    accessToken: string | null,
    setAccessToken: (token: string | null) => void,
    logout: () => Promise<void>
) => {

    const makeRequest = async (token: string | null) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        })
    }

    let hasRetried = false;

    let response = await makeRequest(accessToken);

    if (response.status === 401 && !hasRetried) {
        hasRetried = true;

        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST"
        });

        if (!refreshRes.ok) {
            setAccessToken(null);
            throw new Error("Session expired");
            await logout(); // Clear state + redirect
            // window.location.replace("/login");
        }

        const data = await refreshRes.json();
        setAccessToken(data.accessToken);


        response = await makeRequest(data.accessToken);

        if (response.status === 401) {
            setAccessToken(null);
            await logout();
            throw new Error("Unauthorized after refresh.");
        }
    }


    return response;
}