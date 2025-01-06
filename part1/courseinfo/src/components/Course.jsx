const Header = (props) => {
    return (
      <h1>{props.course}</h1>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercise}
      </p>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} part={part.name} exercise={part.exercises} />)}
      </div>
    )
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce( ( sum, { exercises } ) => sum + exercises , 0)  
    return (
      <p><b>Total of {total} exercises</b></p>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    )
  }

export default Course