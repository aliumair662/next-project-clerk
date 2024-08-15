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
import { getDocs, collection, db, auth } from '@/firebase'
import { signInWithCustomToken } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input, InputGroup } from '@/components/input'
import { Select } from '@/components/select'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState('')
  const { getToken } = useAuth()
  useEffect(() => {
    signIntoFirebaseWithClerk()
  }, [])
  const fetchEvents = async () => {
    try {
      const collRef = collection(db, 'events')
      const querySnapshot = await getDocs(collRef)

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setEvents(documents)
    } catch (error) {
      console.log(error)
    }
  }
  const signIntoFirebaseWithClerk = async () => {
    try {
      const token = await getToken({ template: 'integration_firebase' })
      await signInWithCustomToken(auth, token || '')
      setSignedIn(true)
    } catch (error) {
      setSignedIn(false)
      console.log(error)
    }
  }
  const retrieveData = () => {
    if (!signedIn) {
      setError('Something went wrong.')
      return
    }
    fetchEvents()
  }
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Events</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search events&hellip;" />
              </InputGroup>
            </div>
            <div>
              <Select name="sort_by">
                <option value="name">Sort by name</option>
                <option value="date">Sort by date</option>
                <option value="status">Sort by status</option>
              </Select>
            </div>
          </div>
        </div>
        <Button onClick={retrieveData} className="cursor-pointer">
          Fetch Events
        </Button>
      </div>
      <ul className="mt-10">
        {error ? (
          <li>{error}</li>
        ) : (
          events.map((event, index) => (
            <>
              <li key={event.id}>
                <Divider soft={index > 0} />
                <div className="flex items-center justify-between">
                  <div key={event.id} className="flex gap-6 py-6">
                    <div className="w-32 shrink-0">
                      <Link href={event.url} aria-hidden="true">
                        <img
                          className="aspect-[3/2] rounded-lg shadow"
                          src={event.imgUrl}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-base/6 font-semibold">
                        <Link href={event.url}>{event.name}</Link>
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
                        <DropdownItem href={event.url}>View</DropdownItem>
                        <DropdownItem>Edit</DropdownItem>
                        <DropdownItem>Delete</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </li>
            </>
          ))
        )}
        {!events.length && (
          <li>{`Please click "Fetch Events" button to display data.`}</li>
        )}
      </ul>
    </>
  )
}

export default EventList
