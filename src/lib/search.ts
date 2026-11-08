/**
 * Folds text for accent-insensitive matching, so "ribic" finds "Ribić" and
 * both "Dorde" and "Djordje" find "Đorđe". Apply it to the query and the
 * searched text alike.
 */
export function foldSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/dj/g, "d");
}
