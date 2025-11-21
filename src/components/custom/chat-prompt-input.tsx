'use client';

import { CheckIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import {
  ModelSelector,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorContent,
  ModelSelectorTrigger,
  ModelSelectorLogoGroup,
} from '@/components/ai-elements/model-selector';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTools,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputProvider,
  PromptInputTextarea,
  PromptInputActionMenu,
  PromptInputAttachment,
  PromptInputAttachments,
  type PromptInputMessage,
  PromptInputSpeechButton,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputActionAddAttachments,
} from '@/components/ai-elements/prompt-input';

const models = [
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4o',
    name: 'GPT-4o',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5',
    name: 'GPT-5',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'o1',
    name: 'o1',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'o1-mini',
    name: 'o1 Mini',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'o3',
    name: 'o3',
    providers: ['openai'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'o3-mini',
    name: 'o3 Mini',
    providers: ['openai'],
  },
];

type ChatPromptInputProps = {
  model?: string;
  placeholder?: string;
  status?: 'submitted' | 'streaming' | 'ready' | 'error';
  onModelChange?: (model: string) => void;
  onSubmit?: (message: PromptInputMessage) => void;
};

function ChatPromptInput({
  model,
  onModelChange,
  onSubmit,
  placeholder = 'Add a paragraph or edit existing content...',
  status,
}: ChatPromptInputProps) {
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedModelData = models.find((m) => {
    return m.id === model;
  });

  function handleSubmit(message: PromptInputMessage) {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    onSubmit?.(message);
  }

  return (
    <div className="size-full">
      <PromptInputProvider>
        <PromptInput isMultiple hasGlobalDrop onSubmit={handleSubmit}>
          <PromptInputAttachments>
            {(attachment) => {
              return <PromptInputAttachment data={attachment} />;
            }}
          </PromptInputAttachments>
          <PromptInputBody>
            <PromptInputTextarea ref={textareaRef} placeholder={placeholder} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton textareaRef={textareaRef} />
              <ModelSelector open={modelSelectorOpen} onOpenChange={setModelSelectorOpen}>
                <ModelSelectorTrigger asChild>
                  <PromptInputButton>
                    {selectedModelData?.chefSlug && <ModelSelectorLogo provider={selectedModelData.chefSlug} />}
                    {selectedModelData?.name && <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {['OpenAI'].map((chef) => {
                      return (
                        <ModelSelectorGroup key={chef} heading={chef}>
                          {models
                            .filter((m) => {
                              return m.chef === chef;
                            })
                            .map((m) => {
                              return (
                                <ModelSelectorItem
                                  key={m.id}
                                  value={m.id}
                                  onSelect={() => {
                                    onModelChange?.(m.id);
                                    setModelSelectorOpen(false);
                                  }}
                                >
                                  <ModelSelectorLogo provider={m.chefSlug} />
                                  <ModelSelectorName>{m.name}</ModelSelectorName>
                                  <ModelSelectorLogoGroup>
                                    {m.providers.map((provider) => {
                                      return <ModelSelectorLogo key={provider} provider={provider} />;
                                    })}
                                  </ModelSelectorLogoGroup>
                                  {model === m.id ? (
                                    <CheckIcon className="ml-auto size-4" />
                                  ) : (
                                    <div className="ml-auto size-4" />
                                  )}
                                </ModelSelectorItem>
                              );
                            })}
                        </ModelSelectorGroup>
                      );
                    })}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}

export default ChatPromptInput;
