import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CreateDialogButtonProps{
  onCreatRoom:(description:string,genre:string,title:string)=>void
}


export default function CreateDialogButton({onCreatRoom}:CreateDialogButtonProps){
    const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [open, setOpen] = useState(false); // 모달 열림 상태 관리

  // 1. 핸들러 함수 정의
const handleSubmit =async (e: React.FormEvent) => {
  e.preventDefault(); 
  
  // 모든 데이터가 있을 때만 실행 
  if (!title.trim() || !description.trim()) {
    alert("내용을 입력해주세요!");
    return;
  }

  await onCreatRoom(description, genre, title);
  setTitle("");
      setDescription("");
      setGenre("");
  setOpen(false);
};
    console.log(open,"오픈 값확인")
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
  
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>방 정보를 입력하세요</DialogTitle>
            <DialogDescription>
             -방 제목,
            </DialogDescription>
          </DialogHeader>

         <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">제목</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="방 제목을 입력하세요"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Input 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="방에 대해 짧게 설명해주세요"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="genre">장르</Label>
              <Input 
                id="genre" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)} 
                placeholder="예: Jazz, K-Pop"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">방 만들기</Button>
          </DialogFooter>
           </form>
        </DialogContent>
     
    </Dialog>
  )
}