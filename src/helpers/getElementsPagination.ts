function getElementsPagination<T>(
  elements: T[],
  numberPagePagination: number,
  counterCurrentPage: number,
) {
  //В примере страница под номером 3

  const lastIndex = numberPagePagination * counterCurrentPage; // 3 * 5 = 15
  const firstIndex = lastIndex - counterCurrentPage; // 15 - 5 = 10

  return elements.slice(firstIndex, lastIndex); // получаем от 10 до 15
}

export { getElementsPagination };
