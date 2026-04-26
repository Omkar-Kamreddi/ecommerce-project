//Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Decode JWT safely
export const decodeToken = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

// Get user role
export const getRole = () => {
  const payload = decodeToken();
  return payload ? payload.role : null;
};

// Get user email (optional but useful)
export const getEmail = () => {
  const payload = decodeToken();
  return payload ? payload.sub : null;
};

//Check if logged in
export const isAuthenticated = () => {
  return !!getToken();
};

//Logout helper
export const logout = () => {
  localStorage.removeItem("token");
};