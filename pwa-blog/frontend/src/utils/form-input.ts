import { z } from 'zod';
import type { FormKitNode, FormKitEvent } from '@formkit/core';
import { verifyAvailableEmail } from '../api/api';

/**
 * Handles Formkit input icon click and toggles input type from between `passowrd` and `text`,
 * while also updating the icon prop to reflect the change.
 */
export const handleTogglePasswordVisibility = (node: FormKitNode, _e: FormKitEvent): void => {
  node.props.type = node.props.type === 'password' ? 'text' : 'password';
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye';
};

/**
 * Custom Formkit validation rule to validate if
 * the provided email is available or is already in use.
 *
 * @param currentEmail - Optional param with the email the user is already using. Useful to skip availableEmail validation.
 */
export const formkitAvailableEmailValidation = (currentEmail?: string) => ({
  /**
   * Validation validEmail is run first.
   * When it passes, availableEmail validation runs with 500ms debounce.
   */
  validation: 'validEmail|(500)availableEmail',
  /** Custom validation rule functions */
  rules: {
    validEmail: (node: FormKitNode) =>
      z.string().email().safeParse(node?.value).success,
    availableEmail: async (node: FormKitNode) => {
      // No need to verify if email is available if the input value is the same as the `currentEmail`
      if (node.value === currentEmail) return true;

      try {
        const { data } = await verifyAvailableEmail({ email: node.value as string });
        return data.isAvailable;
      } catch (e) {
        return false;
      }
    },
  },
  /** Error messages for custom validation rules */
  messages: {
    validEmail: 'Invalid email',
    availableEmail: 'This is email is already in use',
  },
});
