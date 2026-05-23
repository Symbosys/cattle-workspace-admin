import { useState } from "react";
import { useGetAllCategories, useCreateCategory, useUpdateCategory } from "../../api/hooks/animal/category";
import { Plus, Pencil, Eye, ImageIcon, FolderOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryPage() {
  const { data, isLoading, error, refetch } = useGetAllCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleCreateOpen = () => {
    setIsEditing(false);
    setCurrentId("");
    setName("");
    setDescription("");
    setImage(null);
    setIsDialogOpen(true);
  };

  const handleUpdateOpen = (category: any) => {
    setIsEditing(true);
    setCurrentId(category.id);
    setName(category.name);
    setDescription(category.description || "");
    setImage(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await updateCategory.mutateAsync({ id: currentId, name, description, image: image || undefined });
    } else {
      await createCategory.mutateAsync({ name, description, image: image || undefined });
    }
    setIsDialogOpen(false);
    refetch();
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Tag className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm max-w-md">Organize and manage your animal categories. Each category represents a major type of livestock.</p>
        </div>
        <Button onClick={handleCreateOpen} size="lg" className="gap-2 shadow-md rounded-xl px-6">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Stats Bar */}
      {data?.data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.data.length}</p>
              <p className="text-xs text-muted-foreground">Total Categories</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.data.filter(c => c.imageUrl?.secure_url).length}</p>
              <p className="text-xs text-muted-foreground">With Images</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.data.filter(c => !c.imageUrl?.secure_url).length}</p>
              <p className="text-xs text-muted-foreground">Without Images</p>
            </div>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{isEditing ? "Update Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Modify the category details below." : "Add a new category for animals. Fill in the details and click save."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cow, Dog, Horse" required className="h-11 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the category..." className="resize-none rounded-lg" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-image" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Image {isEditing && <span className="text-muted-foreground/60 normal-case">(optional)</span>}
              </Label>
              <Input id="cat-image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="cursor-pointer h-11 rounded-lg" />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="rounded-lg px-6">
                {isPending ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <Card key={i} className="overflow-hidden rounded-xl">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="text-destructive text-sm font-medium">Failed to load categories. Please check your connection and try again.</div>
        </div>
      )}
      
      {/* Empty State */}
      {data?.data && data.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 px-6 text-center bg-muted/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5">
            <FolderOpen className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No categories yet</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">Get started by creating your first animal category to organize your livestock.</p>
          <Button onClick={handleCreateOpen} size="lg" className="gap-2 rounded-xl shadow-md px-6">
            <Plus className="h-4 w-4" />
            Create First Category
          </Button>
        </div>
      )}
      
      {/* Cards Grid */}
      {data?.data && data.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.data.map((category) => (
            <Card key={category.id} className="group overflow-hidden rounded-xl border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                {category.imageUrl?.secure_url ? (
                  <img src={category.imageUrl.secure_url} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
                    <ImageIcon className="h-10 w-10" />
                    <span className="text-xs font-medium">No image uploaded</span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base font-semibold">{category.name}</CardTitle>
                {category.description && <CardDescription className="line-clamp-2 text-xs mt-1.5 leading-relaxed">{category.description}</CardDescription>}
              </CardHeader>
              <CardFooter className="gap-2 pt-2 pb-4">
                <Button size="sm" variant="default" className="flex-1 gap-1.5 h-9 rounded-lg text-xs font-medium" onClick={() => handleUpdateOpen(category)}>
                  <Pencil className="h-3 w-3" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 h-9 rounded-lg text-xs font-medium">
                  <Eye className="h-3 w-3" />
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
