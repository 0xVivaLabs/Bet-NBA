export async function GET() {
  const date = new Date().toISOString().replace(/T.+/, '')
  // const matches = await fetch(`https://api.balldontlie.io/v1/games?dates[]=${date}`, {
  const matches = await fetch(`https://api.balldontlie.io/v1/games?dates[]=2024-03-18`, {
    headers: {
      Authorization: '25047ffb-eb72-4d42-9b45-9ae3b9685ee5'
    }
  }).then((res) => res.json())
  return Response.json(matches)
}
