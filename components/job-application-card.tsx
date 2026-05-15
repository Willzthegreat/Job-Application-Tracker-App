"use client";


import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-applications";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label} from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface JobApplicationCardProps {
    job: JobApplication;
    columns: Column[];
}


export default function JobApplicationCard({ 
  job, 
  columns 
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    salary: job.salary || "",
    notes: job.notes || "",
    description: job.description || "",
    jobUrl: job.jobUrl || "",
    tags: job.tags?.join(", ") || "",
    columnId: job.columnId || "",
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try{
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      });

      if (!result.error) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to move job application", err);
    }
  }


  async function handleDelete() {
    try{
      const result = await deleteJobApplication(job._id,);
    } catch (err) {
      console.error("Failed to move job application", err);
    }
  }

  async function handleMove(newColumnId: string) {
    try{
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      })
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
                     <DropdownMenuItem onClick={() => setIsEditing(true)} className="hover:cursor-pointer">
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

                    <DropdownMenuItem 
                    className="text-destructive hover:text-destructive hover:cursor-pointer"
                    onClick={() => handleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Job Application</DialogTitle>
                      <DialogDescription>Track a new job application.</DialogDescription>
                    </DialogHeader>
                    <form 
                    className="space-y-4" 
                    onSubmit={handleUpdate}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="company"> Company * </Label>
                            <Input className="pt-2" name="company" id="company" placeholder="Enter Company Name" required onChange={(e) => setFormData({...formData, company: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position"> Position * </Label>
                            <Input className="pt-2" name="position" id="position" 
                            value={formData.position}
                            placeholder="Enter your position" required onChange={(e) => setFormData({...formData, position: e.target.value})} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location"> Location </Label>
                            <Input className="pt-2" name="location" id="location"
                            value={formData.location}
                            placeholder="your Location" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="salary"> Salary </Label>
                            <Input className="pt-2" name="salary" id="salary"
                            value={formData.salary}
                            placeholder="e.g. N200,000 - N300,000" onChange={(e) => setFormData({...formData, salary: e.target.value})}  />
                          </div>
                        </div>
                        <div className="pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="jobUrl"> Job URL </Label>
                              <Input className="pt-2" name="jobUrl" id="jobUrl"
                              value={formData.jobUrl}
                              placeholder="e.g. https://....." onChange={(e) => setFormData({...formData, jobUrl: e.target.value})} />
                          </div>
                          <div className="space-y-2 pt-4">
                            <Label htmlFor="tags"> Tags (comma-sparated) </Label>
                            <Input className="pt-2" name="tags" id="tags" 
                            value={formData.tags}
                            placeholder="e.g. frontend,react,typescript" onChange={(e) => setFormData({...formData, tags: e.target.value})} />
                          </div>
                          <div className="space-y-2 pt-4">
                            <Label htmlFor="description"> Description </Label>
                            <Textarea className="pt-2" rows={3} id="description" 
                            value={formData.description}
                            placeholder="Enter a brief job description" onChange={(e) => setFormData({...formData, description: e.target.value})} />
                          </div>
                          <div className="space-y-2 pt-4">
                            <Label htmlFor="notes"> Notes </Label>
                            <Textarea className="pt-2" rows={4} id="notes" 
                            value={formData.notes}
                            placeholder="Enter any additional notes" onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className=" hover:cursor-pointer " type="button" variant="outline" onClick={() => setIsEditing(false)} >
                          Cancel
                        </Button>
                        <Button className=" hover:cursor-pointer" type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                
      </>
    )
}