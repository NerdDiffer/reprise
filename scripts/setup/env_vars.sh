#!/bin/sh

# If the file does not already exist, make a template for `.env` file.
# Fill in your own values for Facebook OAuth & for your server-side sessions.

ENV_FILE=.env

if [ ! -f $ENV_FILE ]; then
cat << EOF > $ENV_FILE
# Facebook OAuth credentials.
# Register your application: https://developers.facebook.com/
clientID=''
clientSecret=''
callbackURL=''
# Can be anything hard to guess
sessions_secret=''
EOF
fi
