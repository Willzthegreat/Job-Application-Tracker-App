import  KanbanBoard  from "@/components/Kaban-board";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";


export default async function Dashboard() {

  const session = await getSession();

  if (!session?.user) {
    redirect("/pages/sign-in");
  }

  await connectDB()

  const board =  await Board.findOne({
    userId: session.user.id,
    name: "Job Hunt",
  }).lean();


  console.log(board)
  return (
    <>
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">Job Hunt</h1>
          <p className="text-gray-600">Track your job application</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
    </>
  )
}



