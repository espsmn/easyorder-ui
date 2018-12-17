const prod = process.env.NODE_ENV === 'production'

const baseUrl = prod ? 'http://193.174.80.157:3000/' : 'http://193.174.80.157:3000/'

module.exports = {
  'BACKEND_URL': baseUrl + 'api',
  'auth': '?auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Mzc4ODU0NTYsImV4cCI6MTU0MDQ3NzQ1NiwiYXVkIjoiRWFzeU9yZGVyLUdVSSJ9.nGr-V0hFNUiZ5MNp4l3sSLpnkver710fReDB4T3IhdY'
}
