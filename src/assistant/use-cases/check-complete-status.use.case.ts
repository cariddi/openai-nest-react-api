import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { runId, threadId } = options;

  const runStatusObject = await openai.beta.threads.runs.retrieve(
    threadId,
    runId,
  );

  console.log({ runStatusObject });

  if ((runStatusObject.status = 'completed')) {
    return runStatusObject;
  }

  // TODO: add cases for diff statuses (if applicable) ---> cancelled, cancelling, expired, failed, in_progress, incomplete, queued

  // Wait for a seccond so we won't exaust our openai quota
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Recursively call to await for the completed status
  return await checkCompleteStatusUseCase(openai, options);
};
