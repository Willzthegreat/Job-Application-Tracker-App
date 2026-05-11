import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateJobApplication } from "@/lib/actions/job-applications";

interface JobApplicationCardProps {
    job: JobApplication;
    columns: Column[];
}


export default function JobApplicationCard({ job, columns }: JobApplicationCardProps) {

  async function handleMove(newColumnId: string) {

    try{
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      }
      )
    
    } catch (err) {
      console.error("Failed to move job application", err);
    }
  }

    return (
      <>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1">{job.position}</h3>
                <p className="text-foreground text-xs mb-2">
                  {job.company}
                </p>
                {job.description &&
                <p 
                className="text-muted-foreground text-xs mb-2 line-clamp-1"
                >
                  {job.description}
                </p>}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.tags.map((tag, key) => (
                      <span key={key}
                      className=" py-0.5 text-primary bg-blue/20 text-md px-2 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}

                    {job.jobUrl && (
                      <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-[3px] mt-2 block"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      >
                        <ExternalLink />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-200">
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:cursor-pointer hover:bg-white/20 text-muted-foreground" >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem className="hover:cursor-pointer">
                      <Edit2 />
                      Edit
                    </DropdownMenuItem>
                    {columns.length > 1 && (
                      <>
                        {columns
                        .filter(col => col._id !== job.columnId)
                        .map((column, key) => (
                          <DropdownMenuItem key={key} 
                          onClick={() => handleMove(column._id)}
                          className="hover:cursor-pointer" >
                            Move to {column.name} 
                          </DropdownMenuItem>
                        ))}
                      </>
                    )} 

                    <DropdownMenuItem className=" hover:text-destructive hover:cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )
}