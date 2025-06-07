
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, AlertTriangle, MessageSquare, Users } from "lucide-react"


export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  author,
  commentCount = 0,
  replyCount = 0,
  isLoading = false,
  requireConfirmation = false,
  confirmationText = "DELETE",
}) {
  const [confirmText, setConfirmText] = useState("")
  const [acknowledgeWarning, setAcknowledgeWarning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isDiscussion = type === "discussion"
  const hasReplies = replyCount > 0
  const hasComments = commentCount > 0
  const requiresTextConfirmation = requireConfirmation || (isDiscussion && (hasComments || hasReplies))
  const textConfirmationValid = !requiresTextConfirmation || confirmText === confirmationText

  const handleConfirm = async () => {
    if (!textConfirmationValid || (requiresTextConfirmation && !acknowledgeWarning)) {
      return
    }

    setIsDeleting(true)
    try {
      await onConfirm()
      handleClose()
    } catch (error) {
      console.error("Delete failed:", error)
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    setConfirmText("")
    setAcknowledgeWarning(false)
    setIsDeleting(false)
    onClose()
  }

  const getWarningMessage = () => {
    if (isDiscussion) {
      if (hasComments && hasReplies) {
        return `This discussion has ${commentCount} comments with ${replyCount} replies. All comments and replies will be permanently deleted.`
      } else if (hasComments) {
        return `This discussion has ${commentCount} ${commentCount === 1 ? "comment" : "comments"}. All comments will be permanently deleted.`
      } else if (hasReplies) {
        return `This discussion has ${replyCount} ${replyCount === 1 ? "reply" : "replies"}. All replies will be permanently deleted.`
      }
      return "This discussion will be permanently deleted."
    } else {
      if (hasReplies) {
        return `This comment has ${replyCount} ${replyCount === 1 ? "reply" : "replies"}. All replies will be permanently deleted.`
      }
      return "This comment will be permanently deleted."
    }
  }

  const getImpactBadges = () => {
    const badges = []

    if (isDiscussion && hasComments) {
      badges.push(
        <Badge key="comments" variant="destructive" className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </Badge>,
      )
    }

    if (hasReplies) {
      badges.push(
        <Badge key="replies" variant="destructive" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </Badge>,
      )
    }

    return badges
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete {isDiscussion ? "Discussion" : "Comment"}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm you want to delete this {type}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Preview */}
          {title && (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {isDiscussion ? "Discussion Title" : "Comment"}
              </div>
              <div className="text-sm line-clamp-2">{title}</div>
              {author && <div className="text-xs text-muted-foreground mt-1">by {author}</div>}
            </div>
          )}

          {/* Impact Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div>{getWarningMessage()}</div>
              {getImpactBadges().length > 0 && <div className="flex flex-wrap gap-2 mt-2">{getImpactBadges()}</div>}
            </AlertDescription>
          </Alert>

          {/* Text Confirmation */}
          {requiresTextConfirmation && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="confirm-text" className="text-sm font-medium">
                  Type <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{confirmationText}</code> to
                  confirm:
                </Label>
                <Input
                  id="confirm-text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Type "${confirmationText}" here`}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="acknowledge" checked={acknowledgeWarning} onCheckedChange={setAcknowledgeWarning} />
                <Label htmlFor="acknowledge" className="text-sm">
                  I understand this action is permanent and cannot be undone
                </Label>
              </div>
            </div>
          )}

          {/* Simple Confirmation for Comments without replies */}
          {!requiresTextConfirmation && (
            <div className="flex items-center space-x-2">
              <Checkbox id="simple-acknowledge" checked={acknowledgeWarning} onCheckedChange={setAcknowledgeWarning} />
              <Label htmlFor="simple-acknowledge" className="text-sm">
                I confirm I want to delete this {type}
              </Label>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!textConfirmationValid || !acknowledgeWarning || isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
