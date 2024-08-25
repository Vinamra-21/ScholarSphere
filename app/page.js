import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to ScholarSphere</h1>
      <Link href="/studentform">
      <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded border-2 border-blue-500 cursor-pointer text-center inline-block ">
        Make new Student ID
      </div>
      </Link>
      <Link href="/fetchstudent">
        <div className="bg-orange-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded border-2 border-blue-500 cursor-pointer text-center inline-block ">
          Fetch Details of Student
        </div>
      </Link>
    </div>
  )};
