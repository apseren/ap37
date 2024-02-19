# ap37 Launcher

Cyberpunkish Launcher default script and api documentation.

## API

The code runs in the device Android WebView. All JavaScript features supported by the device WebView are available. Additionally some methods where added to access phone functionality.

### print(x, y, text, color)
Prints text at the x y coordinates.
```javascript
ap37.print(0, 0, 'text', '#666666');
```

### printLines(lines, color)
Prints the entire screen line by line.
```javascript
ap37.printLines(['line 1', 'line 2'], '#666666');
```

### printMultipleColors(x, y, text, colors)
Prints text using different colors for each character.
```javascript
ap37.printMultipleColors(0, 0, 'text', '#666666', ['#ff0000', '#000000', '#ffffff']);
```

### setTextSize(size)
Change font size.
```javascript
ap37.setTextSize(11);
```

### getScreenWidth() and getScreenHeight()
Returns the number of character that fit on the screen horizontally and vertically.
```javascript
ap37.getScreenWidth(); // returns a number
ap37.getScreenHeight(); // returns a number
```

### getDate()
Returns the current date.
> Useful to avoid Android WebView timezone bug: https://bugs.chromium.org/p/chromium/issues/detail?id=520783 
```javascript
ap37.getDate(); // returns an object: {year: 2018, month: 7, day: 12, hour: 1, minute: 2, second: 49}
```

### getBatteryLevel()
Returns the battery level in a number ranging from 0 to 100. 
```javascript
ap37.getBatteryLevel(); // returns a number
```

### getApps()
Returns the list of currently installed apps.
```javascript
ap37.getApps(); // returns an array: [{id: 0, name: "Alarm"}, ...]
```

### openApp(appId)
Instructs the launcher to open the app with a given id.
```javascript
ap37.openApp(apps[0].id);
```

### setOnAppsListener(callbackFunction)
Defines the callback function to be called every time an app is installed or removed.
```javascript
ap37.setOnAppsListener(function() {
    apps = ap37.getApps();
});
```

### openLink(url)
Launches the device default web browser with the given url.
```javascript
 ap37.openLink('http://google.com');
```

### notificationsActive()
Returns a boolean indicating if the launcher has permissions to access the user notifications.
```javascript
ap37.notificationsActive(); // returns a boolean
```

### requestNotificationsPermission()
Instructs the launcher to request the user for permissions the notifications.
```javascript
ap37.requestNotificationsPermission();
```

### getNotifications()
Retrieves the list of current notifications. 
> This method will fail if the user has not yet accepted the request to access the device notifications.
> Each notification includes the appId that indicates which app from the list returned by ap37.getApps() it belongs to.
> The appId value will be -1 for apps not set to be visible in the launcher, for example system apps.
```javascript
ap37.getNotifications(); // returns an array: [{id: 0, appId: 0, name: "New message"}, ...]
```

### getNotificationGroups()
Retrieves the list of current notifications grouped by app, including the amount of current active notifications for each app.
If a notification has a count above 1, its name property will be the name of the app instead of the notification text.
> This method will fail if the user has not yet accepted the request to access the device notifications.
> Each notification includes the appId that indicates which app from the list returned by ap37.getApps() it belongs to.
> The appId value will be -1 for apps not set to be visible in the launcher, for example system apps.
```javascript
ap37.getNotificationGroups(); // returns an array: [{id: 0, appId: 0, name: "Alarm", count: 2}, ...]
```

### openNotification(notificationId)
Instructs the launcher to open the notification with a given id.
```javascript
ap37.openNotification(notification[0].id);
```

### setOnNotificationsListener(callbackFunction)
Defines the callback function to be called every time an notification is created or removed.
```javascript
ap37.setOnNotificationsListener(function() {
    notifications = ap37.getNotifications();
});
```

### setOnTouchListener(callbackFunction)
Defines the callback function to be called every time the user touches the device screen.
```javascript
ap37.setOnTouchListener(function(x, y) {
    // handle screen touch at coordinates x y
});
```

## License

Copyright (C) 2018 Apseren Industries

Licensed under the GPL v3 license.
