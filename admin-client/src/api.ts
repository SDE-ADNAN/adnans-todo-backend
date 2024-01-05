
// local one

// export const API_URL_LOCAL = "http://192.168.0.101:3033"
// export const API_URL_LOCAL = "http://192.168.0.103:3033"
// export const API_URL_LOCAL = "http://192.168.68.63:3033/jarvis"
export const API_URL_LOCAL = "http://192.168.0.100:3033/jarvis"

// personal host
// export const API_URL_LOCAL = "http://172.20.10.13:3033"

// live one
// export const API_URL_LIVE = "https://adnans-todo-backend.onrender.com/jarvis"
// export const API_URL_LIVE = "http://ec2-16-170-250-205.eu-north-1.compute.amazonaws.com:3033/jarvis"
export const API_URL_LIVE = "https://taskmaster.3621.lol/jarvis"

// isLive
export const isLive = true;


export function generateUniqueID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let id = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}