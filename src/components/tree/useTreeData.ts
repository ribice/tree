import { useEffect, useState } from "react";
import type { TreeNodePerson } from "../../lib/people";

export function useTreeData(
  initialPeople: TreeNodePerson[],
  dataUrl?: string,
) {
  const [people, setPeople] = useState<TreeNodePerson[]>(initialPeople);
  const [loading, setLoading] = useState(Boolean(dataUrl && !initialPeople.length));

  useEffect(() => {
    if (!dataUrl) return;
    let cancelled = false;
    setLoading(true);
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Tree data failed: ${response.status}`);
        return response.json() as Promise<TreeNodePerson[]>;
      })
      .then((items) => {
        if (!cancelled) setPeople(items);
      })
      .catch(() => {
        if (!cancelled) setPeople(initialPeople);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // `initialPeople` is the server-rendered fallback for this tree instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUrl]);

  return { people, loading };
}
