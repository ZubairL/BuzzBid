const API_BASE_URL = "http://localhost:8080/"

export const fetchData = async (endpoint) => {
  const full_path = new URL(endpoint, API_BASE_URL).href;
  const res = await fetch(full_path);
  if (res.ok) {
    const obj = await res.json();
    return obj;
  } else {
    return res.status;
  }
}

export const postData = async (endpoint, body, requestType = "POST") => {
  const full_path = new URL(endpoint, API_BASE_URL).href;
  const res = await fetch(full_path, {
    method: requestType,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
    },
    body: JSON.stringify(body)
  });

  try {
    const obj = await res.json();
    return [res.status, obj];
  } catch(e) {
    return [res.status, {}];
  }
}