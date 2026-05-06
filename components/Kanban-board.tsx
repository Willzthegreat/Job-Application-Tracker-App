"use client"

import { Board, Column } from "@/lib/models/models.types";
import { Calendar, CheckCircle2, Mic, Award, XCircle } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";


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

function DroppableColumn({column, config, boardId}: {
  column: Column; 
  config: ColConfig;
  boardId: string;
}) {
  return (
    <>
      <Card data-board-id={boardId}>
        <CardHeader className={`${config.color} text-white flex items-center gap-2`}>
        {config.icon}
        <span className="font-semibold">{column.name}</span>
        </CardHeader>
        <CardContent>
        {/* TODO: render jobs */}
        </CardContent>
      </Card>
    </>
  );
}

export default function KanbanBoard({board, userId}: KanbanBoardProps) {
    const columns = board.columns;
  
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
                <DroppableColumn key={key} column={col} config={config} boardId={board._id} />
              );
            })
            }
          </div>
        </div>
      </>
    )
}

