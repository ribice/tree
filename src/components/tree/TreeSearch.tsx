import type { TreeNodePerson } from "../../lib/people";

interface TreeSearchLabels {
  search: string;
  searchPlaceholder: string;
  searchEmpty: string;
  center: string;
}

interface TreeSearchProps {
  labels: TreeSearchLabels;
  query: string;
  normalizedQuery: string;
  results: TreeNodePerson[];
  onQueryChange: (value: string) => void;
  onFocusPerson: (id: string) => void;
  onSelectFirst: () => void;
}

export function TreeSearch({
  labels,
  query,
  normalizedQuery,
  results,
  onQueryChange,
  onFocusPerson,
  onSelectFirst,
}: TreeSearchProps) {
  return (
    <div className="tree-search-panel">
      <label htmlFor="tree-search" className="tree-search-label">
        {labels.search}
      </label>
      <input
        id="tree-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSelectFirst();
          }
        }}
        placeholder={labels.searchPlaceholder}
        className="tree-search-input"
      />
      {normalizedQuery && (
        <div className="tree-search-results">
          {results.length ? (
            results.map((person) => (
              <button
                type="button"
                key={person.id}
                data-tree-control
                onClick={() => onFocusPerson(person.id)}
                className="tree-search-result"
              >
                <span>
                  <strong>{person.treeName || person.name}</strong>
                  <small>
                    {[person.lifespan, person.tagline].filter(Boolean).join(" - ")}
                  </small>
                </span>
                <em>{labels.center}</em>
              </button>
            ))
          ) : (
            <p className="tree-search-empty">{labels.searchEmpty}</p>
          )}
        </div>
      )}
    </div>
  );
}
