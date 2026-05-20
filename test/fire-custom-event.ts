// this lets us mock events like dragging in using tests
export default function (eventName: string, element: HTMLElement, data: {}) {
    data = data || {};

    let event = new Event(eventName, { cancelable: true, bubbles: true });
    event = Object.assign(event, data);

    element.dispatchEvent(event);
}
