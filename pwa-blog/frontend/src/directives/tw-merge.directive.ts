import type { DirectiveBinding } from 'vue';
import { twMerge } from '../utils/tailwind';

/**
 * This directive will automatically use `twMerge`
 * to merge a components classes with fallthrough inherited classes.
 *
 * Read more about [Vue fallthrough-attributes](https://vuejs.org/guide/components/attrs#fallthrough-attributes).
 *
 * @example
 * --- ChildComponent.vue ---------------------------------------------
 * <div class="bg-red-50 text-lg" v-tw-merge />
 * ---------------------------------------------------------
 *
 * --- ParentComponent.vue ---------------------------------------------
 * <ChildComponent class="bg-blue-100" />
 * "Final classes will be: 'bg-blue-100 text-lg'"
 * ---------------------------------------------------------
 *
 */

type ComputeClasses = (
	el: HTMLElement,
	binding: DirectiveBinding,
	vNode: any
) => void;

const computeClasses: ComputeClasses = (el, _binding, vNode) => {
	const existingClasses = el.classList.value;
	const inheritedClasses = vNode?.ctx?.attrs as string | undefined;

	// No need to run twMerge if there are no classes
	if (!existingClasses || !inheritedClasses) return;

	// This works because all fallthrough classes are added at the end of the string
	el.classList.value = twMerge(existingClasses, inheritedClasses);
};

export const tailwindMergeDirective = {
	beforeMount: computeClasses,
	updated: computeClasses,
};
