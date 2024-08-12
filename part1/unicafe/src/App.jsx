import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
      <td>{props.percent}</td>
    </tr>
  )
}

const Statistics = (props) => {
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={props.sum} />
          <StatisticLine text="average" value={((props.good * 1 + props.neutral * 0 + props.bad * (-1)) / props.sum).toFixed(1)} />
          <StatisticLine text="positive" value={(props.good / props.sum * 100).toFixed(1)} percent="%" />
        </tbody>
      </table>
    </div>
  ) 
}

const History = (props) => {
  if (props.sum === 0){
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <Statistics good={props.good} neutral={props.neutral} bad={props.bad} sum={props.sum} />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text ="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text ="neutral" />
      <Button onClick={() => setBad(bad + 1)} text ="bad" />
      <h1>statistics</h1>
      <History good={good} neutral={neutral} bad={bad} sum={good + neutral + bad} />
    </div>
  )
}

export default App