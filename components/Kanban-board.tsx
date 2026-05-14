"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { Calendar, CheckCircle2, Mic, Award, XCircle, MoreVertical, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle  } from "./ui/card";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";


interface KanbanBoardProps{
    board: Board;
    userId: string;
}

interface ColConfig {
  color: string; icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<ColConfig> = [
    {
    color: "bg-cyan-500",
    icon: <Calendar className="w-4 h-4 text-white" />
  },
  {
    color: "bg-green-500",
    icon: <CheckCircle2 className="w-4 h-4 text-white" />
  },
  {
    color: "bg-yellow-500",
    icon: <Mic className="w-4 h-4 text-white" />
  },
  {
    color: "bg-red-500",
    icon: <Award className="w-4 h-4 text-white" />
  },
  {
    color: "bg-orange-500",
    icon: <XCircle className="w-4 h-4 text-white" />
  },
];

function DroppableColumn({
  column, 
  config, 
  boardId, 
  sortedColumns,
  moveJob
}: {
  column: Column; 
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
  moveJob: (
    jobApplicationId: string, 
    newColumnId: string, 
    newOrder: number
  ) => Promise<void>;
}) {
  const sortedJobs = column.jobApplications?.sort((a, b) => a.order - b.order) || [];
    
  return (
    <>
      <Card 
      className="min-w-75 shrink-0 shadow-md p-0"
      >
        <CardHeader 
        className={`${config.color} text-white rounded-t-lg pb-3 pt-3 `} >
          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2" >
              {config.icon}
              <CardTitle className="font-semibold text-base">{column.name}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:cursor-pointer hover:bg-white/20 text-white" >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end"> 
                {/* TODO: render jobs */}
                <DropdownMenuItem className=" text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-2 bg-gray-50/50 min-h-100 rounded-b-lg" >
          {sortedJobs.map((job, key) => (
            <SortableJobCard key={key}
            job={{ ...job, columnId: job.columnId || column._id }}
            columns={sortedColumns}
            moveJob={moveJob}
            />
          ))}
          <CreateJobApplicationDialog boardId={boardId} columnId={column._id} />
        </CardContent>
      </Card>
    </>
  );
}

function SortableJobCard({job, columns, moveJob}: {job: JobApplication; columns: Column[]; moveJob: (jobApplicationId: string, newColumnId: string, newOrder: number) => Promise<void>; }) {
  return (
    <>
      <div>
        <JobApplicationCard
         job={job} columns={columns} moveJob={moveJob}
         />
      </div> 
    </>
  )
}

export default function KanbanBoard({board, userId}: KanbanBoardProps) {
    const { columns, moveJob } = useBoard(board);
  
    const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  return (
      <>
        <div>
          <div>
            {columns.map((col, key) => {
              const config = COLUMN_CONFIG[key] || {
                color: "bg-gray-500",
                icon: <Calendar className="w-4 h-4 text-white" />,
              };
              return (
                <DroppableColumn 
                key={key} 
                column={col} 
                config={config} 
                boardId={board._id} 
                sortedColumns={sortedColumns}
                moveJob={moveJob}
                />
              );
            })
            }
          </div>
        </div>
      </>
    )
}

