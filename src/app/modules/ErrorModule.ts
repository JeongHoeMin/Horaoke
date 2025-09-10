export function getErrorMessage(e: unknown): string {
  let errMessage: string = 'Unknown error';
  if (e instanceof Error) {
    errMessage = e.message;
  } else if (typeof e === "string") {
    errMessage = e;
  }

  return errMessage;
}