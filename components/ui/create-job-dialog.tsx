"use client"


import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Plus } from "lucide-react";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";

interface CreateJobApplicationDialogProps {
    columnId: string;
    boardId: string;
}

const   INITIAL_FORM_DATA = {
    company: "",
    position: "",
    location: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
    notes: "",
};

export default function CreateJobApplicationDialog({columnId, boardId}:  CreateJobApplicationDialogProps ) {

  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
    notes: "",
  });


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const result = await createJobApplication({
        ...formData,
        columnId,
        boardId,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      });

      if (!result.error) {
        setFormData(INITIAL_FORM_DATA);
        setOpen(false);
      } else {
        console.log("Failed to create job application:", result.error);
      }
    } catch (error) {
      console.error("Error creating job application:", error);
    }
  }

    return (
        <>
       <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className=" hover:cursor-pointer w-full mb-4 justify-start text-muted-foreground border-dashed border-2 " >
                <Plus />
              Add Job
            </Button> 
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Job Application</DialogTitle>
              <DialogDescription>Track a new job application.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                <Button className=" hover:cursor-pointer " type="button" variant="outline" onClick={() => setOpen(false)} >
                  Cancel
                </Button>
                <Button className=" hover:cursor-pointer" type="submit">Add Application</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </>
    )
}