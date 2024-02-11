import cluster from 'node:cluster'

const title = cluster.isPrimary
  ? '[SERVER]'
  : `[WORKER SERVER]: ${cluster.worker?.id}: pid ${process.pid}:`

const getTitle = (workers: NodeJS.Dict<import("cluster").Worker> | undefined) => {
  const hasWorkers = workers && Object.keys(workers).length
  return cluster.isPrimary
  ? hasWorkers ? '[PRIMARY SERVER]' : '[SERVER]'
  : `[WORKER SERVER]: ${cluster.worker?.id}: pid ${process.pid}:`
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
  console.log(`[PRIMARY SERVER] Proxy request [${method}] ${port}${url}`)
}

export const logWorkerServerDied = (id: number, pid: number | undefined) => {
  console.log(`[WORKER SERVER] ${id}: pid ${pid}: Died`)
}
