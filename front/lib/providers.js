export const modelProviders = [
  {
    providerId: "openai",
    name: "OpenAI",
    built: true,
    enabled: false,
  },
  {
    providerId: "cohere",
    name: "Cohere",
    built: true,
    enabled: false,
  },
  {
    providerId: "ai21",
    name: "AI21 Studio",
    built: true,
    enabled: false,
  },
  {
    providerId: "hugging_face",
    name: "HuggingFace",
    built: false,
    enabled: false,
  },
  {
    providerId: "replicate",
    name: "Replicate",
    built: false,
    enabled: false,
  },
];

export const serviceProviders = [
  {
    providerId: "serpapi",
    name: "SerpAPI (Google) Search",
    built: true,
    enabled: false,
  },
  {
    providerId: "browserlessapi",
    name: "Browserless (Web Scrape)",
    built: true,
    enabled: false,
  },
  {
    providerId: "youtube",
    name: "Youtube Search",
    built: false,
    enabled: false,
  },
  { providerId: "notion", name: "Notion", built: false, enabled: false },
  { providerId: "gmail", name: "GMail", built: false, enabled: false },
];

export async function checkProvider(providerId, config) {
  try {
    const result = await fetch(
      `/api/providers/${providerId}/check?config=${JSON.stringify(config)}`
    );
    return await result.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export function filterModelProviders(providers) {
  if (!providers) return [];
  return providers.filter((p) =>
    modelProviders.map((p) => p.providerId).includes(p.providerId)
  );
}

export function filterServiceProviders(providers) {
  if (!providers) return [];
  return providers.filter((p) =>
    serviceProviders.map((p) => p.providerId).includes(p.providerId)
  );
}

export async function getProviderLLMModels(providerId, config) {
  let modelsRes = await fetch(`/api/providers/${providerId}/models`);
  if (!modelsRes.ok) {
    let err = await modelsRes.json();
    console.log(`Error fetching models for ${providerId}:`, err);
    return { models: [] };
  }
  let models = await modelsRes.json();
  return { models: models.models };
}

export const credentialsFromProviders = (providers) => {
  let credentials = {};
  providers.forEach((provider) => {
    let config = JSON.parse(provider.config);
    switch (provider.providerId) {
      case "openai":
        credentials["OPENAI_API_KEY"] = config.api_key;
        break;
      case "cohere":
        credentials["COHERE_API_KEY"] = config.api_key;
        break;
      case "ai21":
        credentials["AI21_API_KEY"] = config.api_key;
        break;
      case "serpapi":
        credentials["SERP_API_KEY"] = config.api_key;
        break;
      case "browserlessapi":
        credentials["BROWSERLESS_API_KEY"] = config.api_key;
        break;
    }
  });
  return credentials;
};
