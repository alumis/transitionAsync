import { CancellationToken } from "@alumis/utils/src/CancellationToken";

export interface IDOMAnimator {

    insertBeforeAsync(parentElement: HTMLElement, newChild: HTMLElement, referenceNode: Node, cancellationToken?: CancellationToken): Promise<any>;
    removeAsync(element: HTMLElement, cancellationToken?: CancellationToken): Promise<any>;
    replaceAsync(newChild: HTMLElement, oldChild: HTMLElement, cancellationToken?: CancellationToken, replaced?: () => any): Promise<any>;
    resumeAsync(element: HTMLElement, cancellationToken?: CancellationToken): Promise<any>;
}