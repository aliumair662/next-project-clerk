import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center mt-[4rem]">
        <h1 className="mb-4 text-2xl font-bold">Clerk SignIn</h1>
        <SignIn />
      </div>
    </>
  )
}
