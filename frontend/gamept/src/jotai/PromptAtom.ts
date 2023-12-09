import { IPromptHistory } from '@/types/components/Prompt.types';
import { atom, useAtomValue, useSetAtom } from 'jotai';

const initValue: IPromptHistory = {
  msg: '',
  role: '',
}

const promptAtom = atom([[initValue]]);

const updatePromptAtom = atom(
  [['']],
  (get, set, update: IPromptHistory[]) => {
    if (update.length == 0) {
      return;
    }
    const currentPrompt = get(promptAtom);
    const updatedPrompt =
      currentPrompt[0][0] === initValue && currentPrompt.length === 1
        ? [update]
        : [...currentPrompt, update];
    set(promptAtom, updatedPrompt);
  }
);

export const useUpdatePromptAtom = () => useSetAtom(updatePromptAtom);

export const usePromptAtom = () => useAtomValue(promptAtom);
