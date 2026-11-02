// Small text helpers shared by the proof cards and the /how-i-build exhibits.

/** A count never splits across two lines ("194 of" / "194", "90%" / "bar"): the spaces in "N of M" and after a
    percentage become no-break spaces when it renders, so the data files stay word for word with their sources
    (review 2, 1 Nov). Used by components/ProofCard.tsx and components/HabitRow.tsx. */
export const keep = (s: string) => s.replace(/(\d+) of (\d+)/g, "$1 of $2").replace(/(\d+%) (?=\w)/g, "$1 ");
