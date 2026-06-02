const openAiModels = [
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.5',
    name: 'GPT-5.5',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.4',
    name: 'GPT-5.4',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.4-mini',
    name: 'GPT-5.4 mini',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.4-nano',
    name: 'GPT-5.4 nano',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.3-codex',
    name: 'GPT-5.3 Codex',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.2-pro',
    name: 'GPT-5.2 pro',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5.1',
    name: 'GPT-5.1',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5-pro',
    name: 'GPT-5 pro',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5',
    name: 'GPT-5',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5-mini',
    name: 'GPT-5 mini',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-5-nano',
    name: 'GPT-5 nano',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 mini',
    providers: [],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'gpt-4o',
    name: 'GPT-4o',
    providers: [],
  },
];

const claudeModels = [
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-opus-4-7',
    name: 'Claude Opus 4.7',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-opus-4-5',
    name: 'Claude Opus 4.5',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    providers: [],
  },
  {
    chef: 'Anthropic',
    chefSlug: 'anthropic',
    id: 'claude-opus-4-1',
    name: 'Claude Opus 4.1',
    providers: [],
  },
];

const aiChatModels = [...openAiModels, ...claudeModels];

const aiChatModelsChefs = Array.from(
  new Set(
    aiChatModels.map((m) => {
      return m.chef;
    })
  )
);

const MODELS_PER_CHEF_LIMIT = 3;

export { aiChatModels, aiChatModelsChefs, MODELS_PER_CHEF_LIMIT };
