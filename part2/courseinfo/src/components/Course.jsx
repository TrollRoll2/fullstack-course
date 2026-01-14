const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => props.parts.map(part => <li key={part.id}><Part part={part} /></li>)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={props.course.parts.reduce((sum, ex) => sum + ex.exercises, 0)} />
    </div>
  )
}

const Total = (props) => <p>Number of exercises {props.total}</p>

export default Course