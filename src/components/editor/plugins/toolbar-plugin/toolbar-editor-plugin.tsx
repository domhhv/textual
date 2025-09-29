import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { REDO_COMMAND, UNDO_COMMAND, FORMAT_TEXT_COMMAND } from 'lexical';
import {
  BoldIcon,
  CodeIcon,
  UndoIcon,
  RedoIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
} from 'lucide-react';
import * as React from 'react';

import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import useEditorToolbarSync from '@/lib/hooks/use-editor-toolbar-sync';
import useTooltipGroup from '@/lib/hooks/use-tooltip-group';

export default function ToolbarEditorPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = React.use(ToolbarStateContext);
  const tooltipGroup = useTooltipGroup();
  useEditorToolbarSync();

  return (
    <div
      onMouseLeave={tooltipGroup.onGroupMouseLeave}
      className="border-border flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 p-2 md:flex-nowrap md:overflow-x-auto"
    >
      <div className="[&>*]:rounded-none [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md">
        <TooltipProvider>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant="ghost"
                disabled={!toolbarState.canUndo}
                onClick={() => {
                  editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
              >
                <UndoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant="ghost"
                disabled={!toolbarState.canRedo}
                onClick={() => {
                  editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
              >
                <RedoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator
        orientation="vertical"
        className="h-6! self-center justify-self-center"
      />

      <div className="[&>*]:rounded-none [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md">
        <TooltipProvider>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isBold ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
              >
                <BoldIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isItalic ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
              >
                <ItalicIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isUnderline ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
              >
                <UnderlineIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isStrikethrough ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
              >
                <StrikethroughIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={tooltipGroup.getTooltipProps().delayDuration}>
            <TooltipTrigger
              asChild
              onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
            >
              <Button
                size="icon"
                variant={toolbarState.isCode ? 'secondary' : 'ghost'}
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }}
              >
                <CodeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
