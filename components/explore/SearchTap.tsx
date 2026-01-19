
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export default function SearchTap(){

    return   (
         <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit" variant="outline" size="icon-sm" >
        Subscribe
      </Button>
    </div>
    )
        
} 