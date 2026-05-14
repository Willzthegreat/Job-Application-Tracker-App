"use client";

import { useEffect, useState } from "react";
import { Board, Column } from "../models/models.types";


export function useBoard(initialBoard?: Board | null) {
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
    const [error, setError] = useState<string | null>(null);

    
  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);   //Error: Calling setState synchronously within an effect can trigger cascading renders. Effects are intended to synchronize state between Reach and external systems such as manully updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following: Update external systems with the latest from React. Subscribe for updates from some external system, calling setState in a callback function when external state changes.
      setColumns(initialBoard.columns || []);
    } 
  }, [initialBoard]);

    async function moveJob(
        jobApplicationId: string,
        newColumnId: string,
        newOrder: number
    ) {}


    return {
        board,
        columns,
        error,
        moveJob,
    }
}


