import EventForm from '../../event-form'

const Form = async ({ params }) => {
  return (
    <>
      <EventForm _id={params.event} />
    </>
  )
}

export default Form
