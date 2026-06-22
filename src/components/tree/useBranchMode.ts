import { useEffect, useMemo, useState } from "react";
import type { TreeNodePerson } from "../../lib/people";
import { ancestorsOf, descendantsOf } from "./relationships";

export function updateBranchParam(id: string | null) {
  try {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("branch", id);
    else url.searchParams.delete("branch");
    window.history.replaceState(null, "", url);
  } catch {}
}

export function useBranchMode(people: TreeNodePerson[]) {
  const [branchTarget, setBranchTarget] = useState<string | null>(null);

  useEffect(() => {
    try {
      setBranchTarget(new URLSearchParams(window.location.search).get("branch"));
    } catch {}
  }, []);

  const branchSet = useMemo(() => {
    if (!branchTarget || !people.some((person) => person.id === branchTarget)) {
      return null;
    }
    const ids = new Set([
      branchTarget,
      ...ancestorsOf(branchTarget, people),
      ...descendantsOf(branchTarget, people),
    ]);
    for (const person of people) {
      if (ids.has(person.id)) {
        for (const spouseId of person.spouses) ids.add(spouseId);
      }
    }
    return ids;
  }, [branchTarget, people]);

  const treePeople = useMemo(
    () => (branchSet ? people.filter((person) => branchSet.has(person.id)) : people),
    [branchSet, people],
  );

  const branchPerson = branchTarget
    ? people.find((person) => person.id === branchTarget)
    : undefined;

  const clearBranch = () => {
    setBranchTarget(null);
    updateBranchParam(null);
  };

  return {
    branchTarget,
    branchSet,
    treePeople,
    branchPerson,
    clearBranch,
  };
}
