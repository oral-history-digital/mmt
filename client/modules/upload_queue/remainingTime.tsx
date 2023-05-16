export default function remainingTime(startDate: Date, fileSize: number,
  fileTransferred: number) {
  let processedTime = Date.now() - startDate.getTime();
  let totalTime = processedTime * fileSize / fileTransferred;
  let remainingTime = totalTime - processedTime;

  return remainingTime;
}
