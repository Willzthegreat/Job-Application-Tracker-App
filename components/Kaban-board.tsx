"use client";

import { Board, Column } from "@/lib/models/models.types";
import { Award, Calendar, CheckCircle2, Mic, XCircle } from "lucide-react";
import { Card, CardHeader } from "./ui/card";

interface KanbanBoardProps {
    board: Board;
    userId: string;
}

interface ColConfig {
  color: string; icon: React.ReactNode
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

function DroppableColumn({column, config, boardId 
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
}) {

  return (
    <Card>
      {/* <CardHeader className={`${config.color}`}>
        <div>
          <div>
            {config.icon}
          </div>
        </div>
      </CardHeader> */}
    </Card>
  )
};

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {

  if (!board || !board.columns) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading board...</p>
      </div>
    );
  }

  const columns = board.columns;

  return (
      <>
        <div>
          <div>
            {columns.map((col, key) => {
              const config = COLUMN_CONFIG[key] || {
                color: "bg-gray-500",
                icon: <Calendar className="w-4 h-4 text-white" />
              };
              return (
                <DroppableColumn
                key={key}
                column={col}
                config={config}
                boardId={board._id}
                />
              );
            })}
          </div>
        </div>
      </>
    );
}


