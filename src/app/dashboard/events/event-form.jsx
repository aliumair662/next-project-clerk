'use client'
import { Field, Label, Fieldset, Legend } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Heading } from '@/components/heading'
import { Radio, RadioField, RadioGroup } from '@/components/radio'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { getEvent, saveEvent, signIntoFirebaseWithClerk } from '@/app/utils'

const EventForm = ({ _id }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    ticketsAvailable: '',
    ticketsSold: '',
    location: '',
    imageUrl: '',
    status: 'regular',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { getToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    signIntoFirebaseWithClerk(getToken)
      .then((res) => {
        if (_id) {
          fetchEvent()
        }
      })
      .catch((err) => console.log(err))
  }, [])

  const fetchEvent = async () => {
    try {
      const data = await getEvent(_id)
      setFormData(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    if (!e.target) return
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    try {
      await saveEvent(formData, _id)
      router.push('/dashboard/events')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <div className="w-1/2 m-auto">
        <Heading>{_id ? 'Edit' : 'Add'} Event</Heading>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <Field>
              <Label className="mb-0">Name</Label>
              <Input
                name="name"
                onChange={handleChange}
                value={formData.name || ''}
                required
              />
            </Field>
            <div className="flex gap-3">
              <Field className="mt-3 w-1/2">
                <Label className="mb-0">Date</Label>
                <Input
                  name="date"
                  type="date"
                  onChange={handleChange}
                  value={formData.date || ''}
                  required
                />
              </Field>
              <Field className="mt-3 w-1/2">
                <Label className="mb-0">Time</Label>
                <Input
                  name="time"
                  type="time"
                  onChange={handleChange}
                  value={formData.time || ''}
                  required
                />
              </Field>
            </div>
            <div className="flex gap-3">
              <Field className="mt-3 w-1/2">
                <Label className="mb-0">Total Tickets</Label>
                <Input
                  name="ticketsAvailable"
                  type="number"
                  onChange={handleChange}
                  value={formData.ticketsAvailable || ''}
                />
              </Field>
              <Field className="mt-3 w-1/2">
                <Label className="mb-0">Sold Tickets</Label>
                <Input
                  name="ticketsSold"
                  type="number"
                  onChange={handleChange}
                  value={formData.ticketsSold || ''}
                />
              </Field>
            </div>
            <Field className="mt-3">
              <Label className="mb-0">Location</Label>
              <Input
                name="location"
                onChange={handleChange}
                value={formData.location || ''}
              />
            </Field>
            <Field className="mt-3">
              <Label className="mb-0">Image URL</Label>
              <Input
                name="imageUrl"
                onChange={handleChange}
                value={formData.imageUrl || ''}
              />
            </Field>
            <div className='mt-5'>
                {formData.imageUrl && <img src={formData.imageUrl} alt="" />}
            </div>
            <div className="mt-3">
              <Fieldset>
                <Legend>Event Status</Legend>
                <RadioGroup
                  value={formData.status}
                  onChange={(value) =>
                    handleChange({
                      target: {
                        name: 'status',
                        value,
                      },
                    })
                  }
                >
                  <RadioField>
                    <Radio value="onSale" />
                    <Label>On Sale</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value="closed" />
                    <Label>Closed</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value="regular" />
                    <Label>Regular</Label>
                  </RadioField>
                </RadioGroup>
              </Fieldset>
            </div>

            <div className="flex justify-end mt-3">
              <Button type="submit">
                {isLoading ? 'Loading...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default EventForm
