'use client'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/dropdown'
import { Link } from '@/components/link'
import { EllipsisVerticalIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { deleteEvent, getEvents, signIntoFirebaseWithClerk } from '@/app/utils'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    signIntoFirebaseWithClerk(getToken)
      .then((res) => loadEvents())
      .catch((err) => console.log(err))
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    const data = await getEvents()
    setEvents(data)
    setIsLoading(false)
  }

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId)
      loadEvents()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Events</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
            </div>
          </div>
        </div>
        <Button className="cursor-pointer">
          <Link href="events/form">Create Events</Link>
        </Button>
      </div>
      <ul className="mt-10">
        {isLoading ? <li>Loading...</li>  : !events.length ? <li>No record found.</li> : (
          events.map((event, index) => (
            <>
              <li key={event.id}>
                <Divider soft={index > 0} />
                <div className="flex items-center justify-between">
                  <div key={event.id} className="flex gap-6 py-6">
                    <div className="w-32 shrink-0">
                      <Link href={'events/form/' + event.id} aria-hidden="true">
                        <img
                          className="aspect-[3/2] rounded-lg shadow"
                          src={event.imageUrl}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-base/6 font-semibold">
                        <Link href={'events/form/' + event.id}>
                          {event.name}
                        </Link>
                      </div>
                      <div className="text-xs/6 text-zinc-500">
                        {event.date} at {event.time}{' '}
                        <span aria-hidden="true">·</span> {event.location}
                      </div>
                      <div className="text-xs/6 text-zinc-600">
                        {event.ticketsSold}/{event.ticketsAvailable} tickets
                        sold
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className="max-sm:hidden"
                      color={event.status === 'On Sale' ? 'lime' : 'zinc'}
                    >
                      {event.status}
                    </Badge>
                    <Dropdown>
                      <DropdownButton plain aria-label="More options">
                        <EllipsisVerticalIcon />
                      </DropdownButton>
                      <DropdownMenu anchor="bottom end">
                        <DropdownItem href={'events/form/' + event.id}>
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDelete(event.id)}>
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </li>
            </>
          ))
        )}
      </ul>
    </>
  )
}

export default EventList
