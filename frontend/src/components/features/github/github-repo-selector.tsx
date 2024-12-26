import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import posthog from "posthog-js";
import { setSelectedRepository } from "#/state/initial-query-slice";
import { useConfig } from "#/hooks/query/use-config";
import { searchPublicRepositories } from "#/api/github";

interface GitHubRepositorySelectorProps {
  onSelect: () => void;
  repositories: GitHubRepository[];
}

export function GitHubRepositorySelector({
  onSelect,
  repositories,
}: GitHubRepositorySelectorProps) {
  const { data: config } = useConfig();
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searchedRepos, setSearchedRepos] = React.useState<GitHubRepository[]>(
    [],
  );

  React.useEffect(() => {
    const searchPublicRepo = async () => {
      const repos = await searchPublicRepositories(searchQuery);
      setSearchedRepos(repos);
    };

    const debounceTimeout = setTimeout(searchPublicRepo, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const finalRepositories = repositories.map((i) => i);
  searchedRepos.forEach((repo) => {
    if (!repositories.find((r) => r.id === repo.id)) {
      finalRepositories.unshift({
        ...repo,
        fromPublicRepoSearch: true,
      });
    }
  });

  const dispatch = useDispatch();

  const handleRepoSelection = (id: string | null) => {
    const repo = finalRepositories.find((r) => r.id.toString() === id);
    if (repo) {
      // set query param
      dispatch(setSelectedRepository(repo.full_name));
      posthog.capture("repository_selected");
      onSelect();
      setSelectedKey(id);
    }
  };

  const handleClearSelection = () => {
    // clear query param
    dispatch(setSelectedRepository(null));
  };

  const emptyContent = "No results found.";

  return (
    <Autocomplete
      data-testid="github-repo-selector"
      name="repo"
      aria-label="GitHub Repository"
      placeholder="Select a GitHub project"
      selectedKey={selectedKey}
      inputProps={{
        classNames: {
          inputWrapper:
            "text-sm w-full rounded-[4px] px-3 py-[10px] bg-[#525252] text-[#A3A3A3]",
        },
      }}
      onSelectionChange={(id) => handleRepoSelection(id?.toString() ?? null)}
      onInputChange={(value) => setSearchQuery(value)}
      clearButtonProps={{ onClick: handleClearSelection }}
      listboxProps={{
        emptyContent,
      }}
      defaultFilter={(textValue, inputValue) =>
        !inputValue ||
        textValue.toLowerCase().includes(inputValue.toLowerCase())
      }
    >
      {config?.APP_MODE === "saas" &&
        config?.APP_SLUG &&
        ((
          <AutocompleteItem key="install">
            <a
              href={`https://github.com/apps/${config.APP_SLUG}/installations/new`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
            >
              Add more repositories...
            </a>
          </AutocompleteItem> // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any)}
      {finalRepositories.map((repo) => (
        <AutocompleteItem
          data-testid="github-repo-item"
          key={repo.id}
          value={repo.id}
          className="data-[selected=true]:bg-default-100"
          textValue={repo.full_name}
        >
          {repo.full_name}
          {repo.fromPublicRepoSearch && repo.stargazers_count !== undefined && (
            <span className="ml-1 text-gray-400">
              ({repo.stargazers_count}⭐)
            </span>
          )}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
