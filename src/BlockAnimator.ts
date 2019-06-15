import { IDOMAnimator } from "./IDOMAnimator";
import { elementIsVisible } from "@alumis/utils/src/elementIsVisible";
//import { getScrollParent } from "@alumis/utils/src/getScrollParent";
import { CancellationToken } from "@alumis/utils/src/CancellationToken";
import { OperationCancelledError } from "@alumis/utils/src/OperationCancelledError";
import { transitionAsync, easeIn, easeOut } from "./transitionAsync";

export class BlockAnimator implements IDOMAnimator {

    async insertBeforeAsync(parentElement: HTMLElement, newChild: HTMLElement, referenceNode: Node, cancellationToken?: CancellationToken) {

        newChild.style.opacity = "0";
        newChild.style.position = "absolute";
        newChild.style.width = "100%";

        parentElement.insertBefore(newChild, referenceNode);

        if (newChild.offsetParent !== parentElement)
            parentElement.style.position = "relative";

        let heightToBe = newChild.clientHeight;

        if (heightToBe && elementIsVisible(newChild)) {

            newChild.style.height = "0";
            newChild.style.width = "";
            newChild.style.position = "";

            let height = 0;
            let remaining = heightToBe - height;

            try {

                if (remaining) {

                    // let scrollParent = getScrollParent(newChild);
                    // let scrollBottom = scrollParent.scrollHeight - window.innerHeight - window.scrollY;

                    // if (scrollParent && scrollBottom < scrollY) {

                    //     await transitionAsync(150, t => {

                    //         newChild.style.height = (height + remaining * easeIn(t)) + "px";

                    //         scrollBy(0, document.body.scrollHeight - window.innerHeight - window.scrollY - scrollBottom);
                    //     }, cancellationToken);
                    // }

                    // else 

                    await transitionAsync(150, t => { newChild.style.height = (height + remaining * easeIn(t)) + "px"; }, cancellationToken);
                }

                newChild.style.height = "";

                let opacity = 0;

                remaining = 1 - opacity;

                if (remaining)
                    await transitionAsync(200, t => { newChild.style.opacity = String(opacity + remaining * easeOut(t)); }, cancellationToken);
            }

            catch (e) {

                if (e instanceof OperationCancelledError)
                    return;

                throw e;
            }

            newChild.style.opacity = "";
        }

        else {

            newChild.style.opacity = "";
            newChild.style.width = "";
            newChild.style.position = "";
        }
    }

    async removeAsync(element: HTMLElement, cancellationToken?: CancellationToken) {

        if (elementIsVisible(element)) {

            let opacity = parseFloat(getComputedStyle(element).opacity);

            try {

                if (opacity)
                    await transitionAsync(200, t => { element.style.opacity = String(opacity - opacity * easeIn(t)); }, cancellationToken);

                let height = element.clientHeight;

                if (height)
                    await transitionAsync(150, t => { element.style.height = height - height * easeOut(t) + "px"; }, cancellationToken);
            }

            catch (e) {

                if (e instanceof OperationCancelledError)
                    return;

                throw e;
            }

            element.remove();

            element.style.opacity = "";
            element.style.height = "";
        }

        else element.remove();
    }

    async replaceAsync(newChild: HTMLElement, oldChild: HTMLElement, cancellationToken?: CancellationToken, replaced?: () => any) {

        newChild.style.display = oldChild.style.display = "block";

        newChild.style.opacity = "0";
        newChild.style.position = "absolute";
        newChild.style.width = "100%";

        oldChild.parentNode.insertBefore(newChild, oldChild);

        let newChildClientHeight = newChild.clientHeight;

        if (elementIsVisible(oldChild) || elementIsVisible(newChild)) {

            newChild.remove();

            newChild.style.width = "";
            newChild.style.position = "";

            let oldChildOpacity = parseFloat(getComputedStyle(oldChild).opacity), oldChildClientHeight = oldChild.clientHeight;

            try {

                if (oldChildOpacity && oldChildClientHeight)
                    await transitionAsync(150, t => { oldChild.style.opacity = String(oldChildOpacity - oldChildOpacity * easeIn(t)); }, cancellationToken);

                let d = newChildClientHeight - oldChildClientHeight;

                if (oldChildClientHeight !== newChildClientHeight)
                    await transitionAsync(150, t => { oldChild.style.height = oldChildClientHeight + d * easeIn(t) + "px"; }, cancellationToken);

                oldChild.parentElement.replaceChild(newChild, oldChild);

                if (replaced)
                    replaced();

                oldChild.style.height = "";
                oldChild.style.opacity = "";

                if (newChildClientHeight)
                    await transitionAsync(200, t => { newChild.style.opacity = String(easeOut(t)); }, cancellationToken);
            }

            catch (e) {

                if (e instanceof OperationCancelledError)
                    return;

                throw e;
            }

            newChild.style.opacity = "";
        }

        else {

            if (replaced)
                replaced();

            newChild.style.opacity = "";
            newChild.style.width = "";
            newChild.style.position = "";

            oldChild.remove();
        }
    }

    async resumeAsync(element: HTMLElement, cancellationToken?: CancellationToken) {

        let height = element.clientHeight;
        let styleHeight = element.style.height;
        element.style.height = "";
        let heightToBe = element.clientHeight;

        try {
            
            if (height !== heightToBe) {

                element.style.height = styleHeight;

                let d = heightToBe - height;

                await transitionAsync(150, t => { element.style.height = height + d * easeIn(t) + "px"; }, cancellationToken);
            }

            element.style.height = "";

            let opacity = parseFloat(getComputedStyle(element).opacity);

            if (opacity < 1) {

                let d = 1 - opacity;

                await transitionAsync(200, t => { element.style.opacity = String(opacity + d * easeOut(t)); }, cancellationToken);
            }
        }

        catch (e) {

            if (e instanceof OperationCancelledError)
                return;

            throw e;
        }

        element.style.opacity = "";
    }
}

