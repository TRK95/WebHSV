export const chunkArr = <R,>(arr: R[], chunkSize: number): Array<Array<R>> => {
  return arr.reduce((list, item, index) => {
    const chunkIndex = Math.floor(index / Math.round(arr.length / chunkSize))
    list[chunkIndex] = [...(list[chunkIndex] || []), item];
    return list;
  }, [])
}