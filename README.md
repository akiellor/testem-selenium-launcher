# Testem Selenium Launcher

This project provides a testem launcher which can connect to an existing selenium hub.

## Getting Started

1. Install the launcher

```
$ npm install testem-selenium-launcher --save-dev
```

2. Add the launcher configuration to your testem config.
```json
{
  ...
  "launchers": {
    "Selenium": {
      "exe": "node_modules/.bin/testem-selenium-launcher",
      "args": ["<url>", "INSERT YOUR HUB URL", "INSERT DESIRED BROWSER (chrome|firefox|etc)"],
      "protocol": "browser"
    }
  }
  ...
}
```

3. Run the suite 
```
$ testem -l Selenium
```

