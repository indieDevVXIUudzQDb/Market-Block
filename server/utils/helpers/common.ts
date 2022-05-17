// The helper function
export async function filter(arr: any[], callback: any): Promise<any[]> {
  const fail = Symbol()
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail)
}
