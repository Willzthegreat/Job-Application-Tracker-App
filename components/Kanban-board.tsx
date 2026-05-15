"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { Calendar, CheckCircle2, Mic, Award, XCircle, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle  } from "./ui/card";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";
import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";




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
  // moveJob
}: {
  column: Column; 
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
  // moveJob: (
  //   jobApplicationId: string, 
  //   newColumnId: string, 
  //   newOrder: number
  // ) => Promise<void>;
}) {

  const {setNodeRef,  isOver} = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });

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
              <DropdownMenuTrigger>
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
        <CardContent 
          ref={setNodeRef} 
          className={`pt-4 space-y-2 bg-gray-50/50 min-h-100 rounded-b-lg ${isOver ? "ring-2 ring-offset-2 ring-cyan-500/50" : ""}`} 
          >
          <SortableContext  items={sortedJobs.map(job => job._id)} strategy={verticalListSortingStrategy}>
          {...sortedJobs.map((job, key) => (
            <SortableJobCard key={key}
              job={{ ...job, columnId: job.columnId || column._id }}
              columns={sortedColumns} 
              // moveJob={function (jobApplicationId: string, newColumnId: string, newOrder: number): Promise<void> {
              //   throw new Error("Function not implemented.");
              // } } // moveJob={moveJob}
            />
          ))}          </SortableContext>
          <CreateJobApplicationDialog boardId={boardId} columnId={column._id} />
        </CardContent>
      </Card>
    </>
  );
}

function SortableJobCard({job, columns}: {
  job: JobApplication; 
  columns: Column[]; 
  // moveJob: (jobApplicationId: string, newColumnId: string, newOrder: number) => Promise<void>; 
}) {

  const {
    attributes, 
    listeners, 
    transition,
    setNodeRef, 
    transform, 
    isDragging
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  }

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style}
       >
        <JobApplicationCard
          job={job}
          columns={columns}
          dragHandleProps={{
            ...attributes,
            ...listeners,
          }}
        />
      </div> 
    </>
  )
}

export default function KanbanBoard({board, userId}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);  
  const { columns, moveJob } = useBoard(board);
  
    const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

    const sensors = useSensors(
      // Add sensors here (e.g., PointerSensor, KeyboardSensor)
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // Minimum distance in pixels before activation
        },
      }));


  async function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event

    setActiveId(null);

    if (!over || !board._id) return;

    const activeId = active.id as string;
    const overId = over.id as string;


    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs = 
        column.jobApplications.sort((a, b) => a.order - b.order) || [];
      const jobIndex = jobs.findIndex((j) => j._id === activeId);
      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    // Check if dropped in a column or another job
    const targetColumn = sortedColumns.find((col) => col._id === overId);
    const targetJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === overId);

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn._id;
      const jobsInTarget = 
      targetColumn.jobApplications
        .filter((j) => j._id !== activeId)
        .sort((a, b) => a.order - b.order) || [];
      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((col) => 
          col.jobApplications.some(j => j._id === targetJob._id)
      );

      targetColumnId = targetJob.columnId || targetJobColumn?._id || "";
      if (!targetColumnId) return;

      const targetColumnObj = sortedColumns.find(
        (col) => col._id === targetColumnId
      );

      if (!targetColumnObj) return;

      const allJobsInTargetOriginal = 
        targetColumnObj.jobApplications.sort((a, b) => a.order - b.order) || [];

      const allJobsInTargetFiltered = 
        allJobsInTargetOriginal.filter((j) => j._id !== activeId) || [];

      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        (j) => j._id === overId
      );

      const targetIndexInFiltered = allJobsInTargetOriginal.findIndex(
        (j) => j._id === overId
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn._id === targetColumnId) {
          if (sourceIndex < targetIndexInOriginal) {
            newOrder = targetIndexInFiltered + 1
          } else {
            newOrder = targetIndexInFiltered
          }
        } else {
          newOrder = targetIndexInFiltered
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) {
      return;
    }

    await moveJob(activeId, targetColumnId, newOrder);
  } 

  const activeJob = sortedColumns.flatMap((col) => col.jobApplications || []).find((job) => job._id === activeId);


  return (
      <>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          >
          <div className="space-y-4">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {sortedColumns.map((col, key) => {
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
                  // moveJob={moveJob}
                  />
                );
              })
              }
            </div>
          </div>

          <DragOverlay>
            {activeJob ? (
            <div className="Opacity-50">
              <JobApplicationCard job={activeJob} columns={sortedColumns} />
            </div>) : null}
          </DragOverlay>
        </DndContext>
      </>
    )
}

