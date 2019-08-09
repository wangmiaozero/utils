const getScore = score => {
  const scoreData = new Array(101).fill(0)
  .map((data, idx) => ([idx, () => (idx < 60 ? '不及格' : '及格')]))
  const scoreMap = new Map(scoreData)
  return (scoreMap.get(score) 
        ? scoreMap.get(score)() 
        : '未知分数')
}
getScore(30) // 不及格
