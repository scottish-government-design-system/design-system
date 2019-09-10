'use strict';

const notificationComponent = {
    init: function () {
        const notifications = document.querySelectorAll('.ds_notification');

        notifications.forEach(function (notification) {
            const closeButton = notification.querySelector('.js-close-notification');
            closeButton.addEventListener('click', function () {
                notification.parentNode.removeChild(notification);
            });
        });
    }
};

// self-initialize
notificationComponent.init();

export {notificationComponent};
