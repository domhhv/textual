import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import Color from 'color';
import {
  REDO_COMMAND,
  UNDO_COMMAND,
  HISTORIC_TAG,
  $getSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import {
  XIcon,
  BoldIcon,
  CodeIcon,
  ListIcon,
  UndoIcon,
  RedoIcon,
  LinkIcon,
  QuoteIcon,
  IndentIcon,
  ItalicIcon,
  EraserIcon,
  HeadingIcon,
  BaselineIcon,
  UnderlineIcon,
  ChevronDownIcon,
  TextInitialIcon,
  PaintBucketIcon,
  TypeOutlineIcon,
  StrikethroughIcon,
  BrushCleaningIcon,
  IndentDecreaseIcon,
} from 'lucide-react';
import * as React from 'react';

import EditorColorPicker from '@/components/custom/editor-color-picker';
import FontSizeInput from '@/components/custom/font-size-input';
import Shortcut from '@/components/custom/shortcut';
import TooltipButton from '@/components/custom/tooltip-button';
import { ToolbarStateContext } from '@/components/providers/editor-toolbar-state-provider';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { default as KBD } from '@/lib/constants/editor-shortcuts';
import type { Alignment } from '@/lib/constants/editor-toolbar-alignments';
import ELEMENT_FORMAT_OPTIONS from '@/lib/constants/editor-toolbar-alignments';
import headings from '@/lib/constants/editor-toolbar-headings';
import lists from '@/lib/constants/editor-toolbar-lists';
import TEXT_FORMAT_OPTIONS from '@/lib/constants/editor-toolbar-text-formats';
import useEditorToolbarSync from '@/lib/hooks/use-editor-toolbar-sync';
import useTooltipGroup from '@/lib/hooks/use-tooltip-group';
import {
  formatQuote,
  clearEditor,
  formatHeading,
  updateFontSize,
  formatCheckList,
  formatParagraph,
  clearFormatting,
  formatBulletList,
  formatNumberedList,
} from '@/lib/utils/editor-helpers';

export default function ToolbarEditorPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = React.use(ToolbarStateContext);
  const tooltipGroup = useTooltipGroup();
  const [isFontColorPickerOpen, setIsFontColorPickerOpen] =
    React.useState(false);
  const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] =
    React.useState(false);
  const [fontColor, setFontColor] = React.useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] =
    React.useState<string>('#000000');
  useEditorToolbarSync();

  React.useEffect(() => {
    setFontColor(toolbarState.fontColor || '#000000');
  }, [toolbarState.fontColor]);

  React.useEffect(() => {
    setBackgroundColor(toolbarState.backgroundColor || '#ffffff');
  }, [toolbarState.backgroundColor]);

  const applyStyleText = React.useCallback(
    (styles: Record<string, string>) => {
      editor.update(
        () => {
          const selection = $getSelection();

          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        { tag: HISTORIC_TAG }
      );
    },
    [editor]
  );

  const applyFontColor = React.useCallback(() => {
    setIsFontColorPickerOpen(false);
    applyStyleText({ color: fontColor });
  }, [applyStyleText, fontColor]);

  const applyBackgroundColor = React.useCallback(() => {
    setIsBackgroundColorPickerOpen(false);
    applyStyleText({ 'background-color': backgroundColor });
  }, [applyStyleText, backgroundColor]);

  const applyFontFamily = React.useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();

        if (selection !== null) {
          $patchStyleText(selection, {
            ['font-family']: option,
          });
        }
      });
    },
    [editor]
  );

  const handleFontSizeChange = React.useCallback(
    (newSize: string) => {
      updateFontSize(editor, `${newSize}px`);
    },
    [editor]
  );

  const handleFontColorOpenChange = React.useCallback((open: boolean) => {
    setIsFontColorPickerOpen(open);
    setIsBackgroundColorPickerOpen(false);
  }, []);

  const handleBackgroundColorOpenChange = React.useCallback((open: boolean) => {
    setIsBackgroundColorPickerOpen(open);
    setIsFontColorPickerOpen(false);
  }, []);

  React.useEffect(() => {
    if (!isFontColorPickerOpen && !isBackgroundColorPickerOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      if (isFontColorPickerOpen) {
        setIsFontColorPickerOpen(false);
      }

      if (isBackgroundColorPickerOpen) {
        setIsBackgroundColorPickerOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFontColorPickerOpen, isBackgroundColorPickerOpen]);

  return (
    <TooltipProvider>
      <div
        onMouseLeave={tooltipGroup.onGroupMouseLeave}
        className="flex items-center gap-2 overflow-x-auto p-2"
      >
        <TooltipButton
          {...tooltipGroup.getTooltipProps()}
          variant="outline"
          tooltip="Strikethrough"
          shortcut={KBD.CLEAR_EDITOR}
          onClick={clearEditor.bind(null, editor)}
        >
          <BrushCleaningIcon />
        </TooltipButton>

        <Separator
          orientation="vertical"
          className="h-6! flex-shrink-0 self-center justify-self-center"
        />

        <ButtonGroup>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Undo"
            variant="secondary"
            shortcut={KBD.UNDO}
            disabled={!toolbarState.canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
          >
            <UndoIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Redo"
            variant="secondary"
            shortcut={KBD.REDO}
            disabled={!toolbarState.canRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
          >
            <RedoIcon />
          </TooltipButton>
        </ButtonGroup>

        <Separator
          orientation="vertical"
          className="h-6! flex-shrink-0 self-center justify-self-center"
        />

        <ButtonGroup>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Bold"
            shortcut={KBD.BOLD}
            variant={toolbarState.isBold ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
          >
            <BoldIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Italic"
            shortcut={KBD.ITALIC}
            variant={toolbarState.isItalic ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
          >
            <ItalicIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Underline"
            shortcut={KBD.UNDERLINE}
            variant={toolbarState.isUnderline ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
          >
            <UnderlineIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Strikethrough"
            shortcut={KBD.STRIKETHROUGH}
            variant={toolbarState.isStrikethrough ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
          >
            <StrikethroughIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Code"
            shortcut={KBD.CODE}
            variant={toolbarState.isCode ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
          >
            <CodeIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            tooltip="Link"
            shortcut={KBD.INSERT_LINK}
            variant={toolbarState.isLink ? 'secondary' : 'ghost'}
            onClick={() => {
              if (!toolbarState.isLink) {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
              }
            }}
          >
            <LinkIcon />
          </TooltipButton>
        </ButtonGroup>

        <Separator className="h-6!" orientation="vertical" />

        <Select value={toolbarState.fontFamily} onValueChange={applyFontFamily}>
          <SelectTrigger
            size="sm"
            variant="secondary"
            className="w-40 flex-shrink-0"
          >
            <SelectValue placeholder="Font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Ubuntu">Ubuntu</SelectItem>
            <SelectItem value="Montserrat">Montserrat</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Open Sans">Open Sans</SelectItem>
            <SelectItem value="Lora">Lora</SelectItem>
          </SelectContent>
        </Select>

        <FontSizeInput
          className="flex-shrink-0"
          value={toolbarState.fontSize}
          onChange={handleFontSizeChange}
          onMouseEnter={tooltipGroup.getTooltipProps().onMouseEnter}
          delayDuration={tooltipGroup.getTooltipProps().delayDuration}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-40 flex-shrink-0 justify-between"
          >
            <Button size="sm" variant="secondary">
              <HeadingIcon className="mr-1 h-4 w-4" />
              {headings.find((h) => {
                return h.value === toolbarState.blockType;
              })?.label || 'Normal text'}
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {headings.map((heading) => {
              return (
                <DropdownMenuItem
                  key={heading.value}
                  className="flex justify-between gap-4"
                  onClick={() => {
                    formatHeading(
                      editor,
                      toolbarState.blockType,
                      heading.value
                    );
                  }}
                >
                  <div className="flex items-center">
                    <heading.icon className="mr-2 h-4 w-4" />
                    <span>{heading.label}</span>
                  </div>
                  <Shortcut keys={heading.shortcut} />
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-between gap-4"
              onClick={() => {
                return formatParagraph(editor);
              }}
            >
              <div className="flex items-center gap-2">
                <TextInitialIcon />
                <span>Normal text</span>
              </div>
              <Shortcut keys={KBD.NORMAL} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-44 flex-shrink-0 justify-between"
          >
            <Button size="sm" variant="secondary">
              <ListIcon className="mr-1 h-4 w-4" />
              {lists.find((l) => {
                return l.value === toolbarState.blockType;
              })?.label || 'Insert list'}
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {lists.map((list) => {
              return (
                <DropdownMenuItem
                  key={list.value}
                  className="flex justify-between gap-4"
                  onClick={() => {
                    if (list.value === 'bullet') {
                      formatBulletList(editor, toolbarState.blockType);
                    } else if (list.value === 'number') {
                      formatNumberedList(editor, toolbarState.blockType);
                    } else if (list.value === 'check') {
                      formatCheckList(editor, toolbarState.blockType);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <list.icon className="mr-2 h-4 w-4" />
                    <span>{list.label}</span>
                  </div>
                  <Shortcut keys={list.shortcut} />
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator
          orientation="vertical"
          className="h-6! flex-shrink-0 self-center justify-self-center"
        />

        <Popover
          open={isFontColorPickerOpen}
          onOpenChange={handleFontColorOpenChange}
        >
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="flex-shrink-0 gap-0 space-x-2"
            >
              <div className="flex items-center gap-2">
                <BaselineIcon />
                <div
                  className="h-4 w-4 rounded"
                  style={{
                    backgroundColor: Color(fontColor).alpha(0.8).string(),
                  }}
                />
              </div>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            asChild
            onInteractOutside={(event) => {
              event.preventDefault();
            }}
          >
            <div className="w-[305px] space-y-4">
              <div className="text-muted-foreground flex items-center justify-between">
                <p className="text-sm">Font color</p>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setIsFontColorPickerOpen(false);
                  }}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
              <EditorColorPicker value={fontColor} onChange={setFontColor} />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsFontColorPickerOpen(false);
                }}
              >
                <div className="rounded border border-current px-1 py-0.5 text-xs">
                  Esc
                </div>
                <span>Cancel</span>
              </Button>
              <Button className="w-full" onClick={applyFontColor}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover
          open={isBackgroundColorPickerOpen}
          onOpenChange={handleBackgroundColorOpenChange}
        >
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="flex-shrink-0 gap-0 space-x-2"
            >
              <div className="flex items-center gap-2">
                <PaintBucketIcon />
                <div
                  className="h-4 w-4 rounded"
                  style={{
                    backgroundColor: Color(backgroundColor).alpha(0.8).string(),
                  }}
                />
              </div>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            asChild
            onInteractOutside={(event) => {
              event.preventDefault();
            }}
          >
            <div className="w-[305px] space-y-4">
              <div className="text-muted-foreground flex items-center justify-between">
                <p className="text-sm">Background color</p>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setIsBackgroundColorPickerOpen(false);
                  }}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
              <EditorColorPicker
                value={backgroundColor}
                onChange={setBackgroundColor}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsBackgroundColorPickerOpen(false);
                }}
              >
                <div className="rounded border border-current px-1 py-0.5 text-xs">
                  Esc
                </div>
                <span>Cancel</span>
              </Button>
              <Button className="w-full" onClick={applyBackgroundColor}>
                <span>Apply</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator
          orientation="vertical"
          className="h-6! flex-shrink-0 self-center justify-self-center"
        />

        <ButtonGroup>
          {(Object.keys(ELEMENT_FORMAT_OPTIONS) as Alignment[]).map(
            (alignment) => {
              const {
                icon: Icon,
                name,
                shortcut,
              } = ELEMENT_FORMAT_OPTIONS[alignment];

              return (
                <TooltipButton
                  key={alignment}
                  {...tooltipGroup.getTooltipProps()}
                  tooltip={name}
                  shortcut={shortcut}
                  onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
                  }}
                  variant={
                    toolbarState.elementFormat === alignment
                      ? 'secondary'
                      : 'ghost'
                  }
                >
                  <Icon />
                </TooltipButton>
              );
            }
          )}
        </ButtonGroup>

        <Separator
          orientation="vertical"
          className="h-6! flex-shrink-0 self-center justify-self-center"
        />

        <ButtonGroup>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            variant="ghost"
            tooltip="Outdent"
            shortcut={KBD.OUTDENT}
            onClick={() => {
              editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
            }}
          >
            <IndentDecreaseIcon />
          </TooltipButton>
          <TooltipButton
            {...tooltipGroup.getTooltipProps()}
            variant="ghost"
            tooltip="Indent"
            shortcut={KBD.INDENT}
            onClick={() => {
              editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
            }}
          >
            <IndentIcon />
          </TooltipButton>
        </ButtonGroup>

        <Separator
          orientation="vertical"
          className="h-6! flex-shrink-0 self-center justify-self-center"
        />

        <TooltipButton
          {...tooltipGroup.getTooltipProps()}
          tooltip="Code"
          shortcut={KBD.QUOTE}
          variant={toolbarState.isQuote ? 'secondary' : 'ghost'}
          onClick={() => {
            formatQuote(editor, toolbarState.blockType);
          }}
        >
          <QuoteIcon />
        </TooltipButton>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-44 flex-shrink-0 justify-between"
          >
            <Button size="sm" variant="secondary">
              <TypeOutlineIcon className="mr-1 h-4 w-4" />
              {Object.entries(TEXT_FORMAT_OPTIONS).find(([, option]) => {
                return toolbarState[option.key];
              })?.[1]?.name || 'Text format'}
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(
              Object.keys(TEXT_FORMAT_OPTIONS) as Array<
                keyof typeof TEXT_FORMAT_OPTIONS
              >
            ).map((format) => {
              const option = TEXT_FORMAT_OPTIONS[format];
              const Icon = option.icon;

              return (
                <DropdownMenuItem
                  key={format}
                  className="flex justify-between gap-4"
                  onClick={() => {
                    editor.dispatchCommand(
                      FORMAT_TEXT_COMMAND,
                      format as TextFormatType
                    );
                  }}
                >
                  <div className="flex items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{option.name}</span>
                  </div>
                  <Shortcut keys={option.shortcut} />
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-between gap-4"
              onClick={() => {
                clearFormatting(editor);
              }}
            >
              <div className="flex items-center gap-2">
                <EraserIcon className="h-4 w-4" />
                <span>Clear formatting</span>
              </div>
              <Shortcut keys={KBD.CLEAR_FORMATTING} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
