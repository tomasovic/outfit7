export type ChartData = {
  crosspromo: number
  liveops: number
  app: number
  ads: number
}

export const data = (chartData: ChartData) => ({
  labels: ['Events'],
  datasets: [
    {
      label: 'crosspromo',
      backgroundColor: '#f87543',
      data: [chartData.crosspromo]
    },
    {
      label: 'liveops',
      backgroundColor: '#f87979',
      data: [chartData.liveops]
    },
    {
      label: 'app',
      backgroundColor: '#42A5F5',
      data: [chartData.app]
    },
    {
      label: 'ads',
      backgroundColor: '#66BB6A',
      data: [chartData.ads]
    }
  ],
})

export const chartOptions = {
  responsive: true,
}
