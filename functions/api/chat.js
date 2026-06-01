export async function onRequestPost(context) {
  const workerUrl = 'https://cini-bot.srk8115939.workers.dev/api/chat'
  
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: context.request.body,
  })

  return response
}