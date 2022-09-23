function setToken(token) {
  localStorage.setItem('token', token)
}

function getToken() {
  return localStorage.getItem('token')
}

function removeToken() {
  return localStorage.removeItem('token')
}

export { setToken, getToken, removeToken }
