"use client";

import { useEffect, useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { updateJobApplication } from "../actions/job-applications";


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
    ) {
      setColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          jobApplications: [...col.jobApplications],
        }));

        // Find and remove job from the old column

        let jobToMove: JobApplication | null = null;
        let oldColumnId: string | null = null;

        for (const col of newColumns) {
          const jobIndex = col.jobApplications.findIndex((j) => j._id === jobApplicationId);
          if (jobIndex !== -1 && jobIndex !== undefined) {
            jobToMove = col.jobApplications[jobIndex];
            oldColumnId = col._id;
            col.jobApplications = col.jobApplications.filter(
              (j) => j._id !== jobApplicationId
            );
            break;
          }

        }

        if (jobToMove && oldColumnId) {
          const  targetColumnIndex = newColumns.findIndex(
            (col) => col._id === newColumnId
          );

          if (targetColumnIndex !== -1) {
            const targetColumn = newColumns[targetColumnIndex];
            const currentJobs = targetColumn.jobApplications || [];

            const updatedJobs = [...currentJobs] 
            updatedJobs.splice(newOrder, 0, {
              ...jobToMove,
              columnId: newColumnId,
              order: newOrder * 100,
            });

            const jobsWithUpdatedOrders = updatedJobs.map((job, index) => ({
              ...job,
              order: index * 100,
            }));

            newColumns[targetColumnIndex] = {
              ...targetColumn,
              jobApplications: jobsWithUpdatedOrders,
            };
          } 
        }

        return newColumns;
      });

      try {
        const result = await updateJobApplication(jobApplicationId, {
          columnId: newColumnId,
          order: newOrder,
        });
      } catch (err) {
        console.error("Error", err);
      }
    }


    return {
        board,
        columns,
        error,
        moveJob,
    };
}


