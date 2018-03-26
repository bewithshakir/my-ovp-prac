Activity Config
===============

Activity config gives us a way to configure application parameters that we can modify without re-deploying the app.

Getting to OVP Activity config
---

* login to [https://cyclops-returns.cdp.webapps.rr.com/#/index](https://cyclops-returns.cdp.webapps.rr.com/#/index) with your EID or VID.
* go to 'Client Configuration'
* search for 'twc-ovp'


Note: Currently selected environment will be shown on the top-right with drop down option to change the environment. Each environment has its own activity config. Please make sure, if you are modifying or adding a config, you do that for all the environments like prod, SIT-A or SIT-B, unless you only need it for a specific environment.

Creating new config
---
There is no way to create an empty activity config, you would have to clone an exising one.

* Click on 'Create Copy' button next to the version of activity config version that you want to replicate.
* A popup will appear, enter just the version number like 1.4 that you want to create and click 'Copy'
* This will create new version 1.4.

Update an existing config
---

* Click 'Modify Settings' next to the activity config version you want to modify.
* A simple string or number value can be modified inline, just click on the value and a popup will appear, allowing you to change the value.
* For complex values like array, you would need to delete the existing param and add it back again with new value.
