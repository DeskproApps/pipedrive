Pipedrive App Setup Instructions
===

Follow these steps to install and configure the Pipedrive app using either an API key or OAuth credentials.

## Using API Key

To install the Pipedrive app you must copy your personal API token. Access this in Pipedrive under the personal preferences section of your settings in the top right, and click the API tab on the following page. 

## ⚠️ Important
For best results, you should use an API token from a Pipedrive account with global (admin-level) privileges. If the token belongs to a regular Pipedrive user, agents in Deskpro will only be able to view contact activities owned by the provided API token holder. Using an admin’s API key ensures agents in Deskpro can view all relevant activities across your Pipedrive account.

[![](/docs/assets/setup/setup-pipedrive-001.png)](/docs/assets/setup/setup-pipedrive-001.png)
[![](/docs/assets/setup/setup-pipedrive-002.png)](/docs/assets/setup/setup-pipedrive-002.png)


Copy the token and head back to Deskpro and navigate to the "Settings" tab of the Pipedrive app in admin.

[![](/docs/assets/setup/setup-pipedrive-003.png)](/docs/assets/setup/setup-pipedrive-003.png)

On this screen, enter the following details:

- **Pipedrive API Key** - this is the token you created in the previous steps
- **Domain Prefix** - this is your company name found in your Pipedrive URL, e.g. this will be `mycompany` if your Pipedrive URL is `https://mycompany.pipedrive.com`

To configure who can see and use the Pipedrive app, head to the "Permissions" tab and select those users and/or groups you'd like to have access.

When you're happy, click "Install".


## Using OAuth2

Head over to your Pipedrive homepage and click on your profile image in the top right, then select "Developer Hub".

[![](/docs/assets/setup/setup-pipedrive-004.png)](/docs/assets/setup/setup-pipedrive-004.png)

In the Developer Hub, click "Create an app". A popup will appear asking you to select the type of app you want to create. Choose "Public" if you plan to allow users outside of your Pipedrive instance or company to use the app (this will require approval from Pipedrive). Select "Private" if the app will only be used within your own Pipedrive instance (no approval is needed).

[![](/docs/assets/setup/setup-pipedrive-005.png)](/docs/assets/setup/setup-pipedrive-005.png)

Next, you’ll be shown a form to enter details about your app. Provide a name for your app and enter the Callback URL (this can be found in the app settings drawer in Deskpro). Click "Save" to proceed.

[![](/docs/assets/setup/setup-pipedrive-006.png)](/docs/assets/setup/setup-pipedrive-006.png)

Next, navigate to the "OAuth & access scopes" section in the side menu. Here, you will need to configure the necessary permissions for your app.  Select the following scopes and click "Save": `Deals:Full access`, `Activities:Full access`, `Contacts:Full access`, `Read users data`, and `Search for all data`.  These permissions ensure that your app can access the required data from Pipedrive while maintaining security and control over what it can modify.

[![](/docs/assets/setup/setup-pipedrive-007.png)](/docs/assets/setup/setup-pipedrive-007.png)

At the bottom of the page, you will find your app's `Client ID` and `Client Secret`. Copy these credentials and paste them into the corresponding fields in the Deskpro app settings drawer.

To activate your app, click "Change to live", which will allow users to start using it.

Finally, configure who can access the app by going to the "Permissions" tab. Select the users and/or groups that should have access. Once you’re satisfied with the settings, click "Install" to complete the setup.