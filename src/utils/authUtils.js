export const handleConsent = async (authFn, callbackFn, state, setState) => {
    try {
      await authFn();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callbackFn();
};

export const handleLoginAgain = async (authFn, callbackFn, state, setState) => {
    try {
        await authFn();
        setState({
          ...state,
          error: null,
        });
      } catch (error) {
        setState({
          ...state,
          error: error.error,
        });
      }
  
    await callbackFn();
}

export const callApiWithAuth = async (authFn, apiUrl) => {
    const token = await authFn();

    console.log(apiUrl);
    
    const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
    });

    const responseData = await response.json();

    return responseData;
}

export const postApiWithAuth = async (authFn, apiUrl, body) => {
    const token = await authFn();

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: body
    });

    const responseData = await response.json();

    return responseData;
}