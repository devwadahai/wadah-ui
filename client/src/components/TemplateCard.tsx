import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Star } from "lucide-react";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  image?: string;
  tags: string[];
  rating?: number;
  downloads?: number;
  onClone?: () => void;
  onView?: () => void;
}

export function TemplateCard({
  id,
  name,
  description,
  image,
  tags,
  rating,
  downloads,
  onClone,
  onView,
}: TemplateCardProps) {
  return (
    <Card className="hover-elevate cursor-pointer" data-testid={`card-template-${id}`} onClick={onView}>
      {image && (
        <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden rounded-t-lg">
          <img src={image} alt={name} className="w-24 h-24 object-contain" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base" data-testid={`text-template-name-${id}`}>{name}</h3>
          {rating && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <p className="text-xs text-muted-foreground">
          {downloads ? `${downloads.toLocaleString()} uses` : 'New'}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onClone?.();
          }}
          data-testid={`button-clone-${id}`}
        >
          <Copy className="h-3 w-3 mr-1.5" />
          Clone
        </Button>
      </CardFooter>
    </Card>
  );
}
