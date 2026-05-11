
import  KanbanBoard  from "@/components/Kanban-board";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getBoard(userId: string) {
  "use cache";

  await connectDB()

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt",
  })
  .populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });
  
  if (!boardDoc) return null;
  
  const board = JSON.parse(JSON.stringify(boardDoc));
   
  return board;
}

async function DashboardPage() {
  const session = await getSession();
  const board = await getBoard(session?.user.id ?? "");

  if (!session?.user) {
    redirect("/pages/sign-in");
  }


  return (
    <>
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-start mb-6">
            <h1 className="text-2xl font-bold  mb-2">Job Hunt</h1>
            <p className="text-gray-600">Track your job application</p>
          </div>
          <KanbanBoard board={board} userId={session.user.id} />
        </div>
      </div>
    </>
  )
}

export default async function Dashboard() {

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardPage />
    </Suspense>
  );
}



