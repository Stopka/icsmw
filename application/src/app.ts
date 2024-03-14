import * as http from 'http'
import * as process from 'process'
import { z } from 'zod'

const calendarsSchema = z.record(z.string())

const paths = calendarsSchema.parse(
  JSON.parse(process.env.CALENDARS ?? '{}')
)
const postfix = process.env.POSTFIX ?? '@icsmw'

const handleRequest = async (req: http.IncomingMessage): Promise<string> => {
  const pathname = req.url ?? '/'
  const calendarUrl = paths[pathname]
  if (calendarUrl === undefined) {
    throw new Error(`Calendar ${pathname} not defined in CALENDARS env variable!`)
  }
  const calResponse = await fetch(calendarUrl, {
    headers: {
      Accept: 'text/calendar'
    }
  })
  if (calResponse.status !== 200) {
    throw new Error(`Calendar ${pathname} responded with empty body!`)
  }
  const calBody = await calResponse.text()
  return calBody.replace(/^UID:(.*)$/mg, `UID:$1${postfix}`)
}

const server = http.createServer()
server.on('request', (req, res) => {
  handleRequest(req)
    .then(body => {
      console.info('Successfully processed', req.url)
      res.writeHead(200, { 'Content-Type': 'text/calendar' })
      res.write(body)
      res.end()
    })
    .catch((e): void => {
      console.error(e)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write(e.toString())
      res.end()
    }
    )
})
server.on('listening', () => {
  console.info('Listening')
})
server.listen(8080)
