import cluster from 'node:cluster'

const ansiCodes = {
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  end: '\x1b[0m',
}

export const blue = (str: string | number | undefined) => `${ansiCodes.blue}${str}${ansiCodes.end}`
export const yellow = (str: string | number | undefined) => `${ansiCodes.yellow}${str}${ansiCodes.end}`

const getTitle = (workers: NodeJS.Dict<import('cluster').Worker> | undefined) => {
  const hasWorkers = workers && Object.keys(workers).length
  return cluster.isPrimary
  ? hasWorkers ? blue('[PRIMARY SERVER]') : blue('[SERVER]')
  : `${yellow('[WORKER SERVER]')}: ${yellow(cluster.worker?.id)}: pid ${process.pid}:`
}

export const logServerStartedOnPort = (port: number) => {
  const title = getTitle(cluster.workers)
  console.log(`${title} Started on port ${port}`)
}

export const logServerProcessStarted = () => {
  const title = getTitle(cluster.workers)
  console.log(`${title} Started process ${process.pid}`)
}

export const logServerRouterProcessRequest = (method = '', url = '') => {
  const title = getTitle(cluster.workers)
  console.log (`${title} Process request [${method}] ${url}`)
}

export const logPrimaryServerProxyRequest = (method = '', port: number, url = '') => {
  console.log(`${blue('[PRIMARY SERVER]')} Proxy request [${method}] ${port}${url}`)
}

export const logWorkerServerDied = (id: number, pid: number | undefined) => {
  console.log(`${yellow('[WORKER SERVER]')} ${yellow(id)}: pid ${pid}: Died`)
}

export const logTestingServerStartedOnPort = (port: number) => {
  console.log(`${blue('[TESTING SERVER]')} Started on port ${port}`)
}
