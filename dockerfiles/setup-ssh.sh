#!/bin/bash

echo "Configuring SSH for Jenkins..."

# Define SSH directories
JENKINS_SSH_DIR="/var/jenkins_home/.ssh"
ROOT_SSH_DIR="/root/.ssh"
PRIVATE_KEY="id_rsa"
PUBLIC_KEY="id_rsa.pub"
KNOWN_HOSTS_FILE="known_hosts"

# Check if .ssh directory exists in Jenkins home, if not, exit
if [ ! -d "$JENKINS_SSH_DIR" ]; then
    echo "Error: SSH directory not found in $JENKINS_SSH_DIR. Please create it and add the necessary keys."
    exit 1
fi

# Validate that both private and public keys exist
if [ ! -f "$JENKINS_SSH_DIR/$PRIVATE_KEY" ] || [ ! -f "$JENKINS_SSH_DIR/$PUBLIC_KEY" ]; then
    echo "Error: SSH keys not found in $JENKINS_SSH_DIR. Please add both id_rsa and id_rsa.pub."
    exit 1
fi

# Ensure root SSH directory exists
mkdir -p "$ROOT_SSH_DIR"
chmod 700 "$ROOT_SSH_DIR"

# Copy SSH keys to root's .ssh directory
cp "$JENKINS_SSH_DIR/$PRIVATE_KEY" "$ROOT_SSH_DIR/$PRIVATE_KEY"
cp "$JENKINS_SSH_DIR/$PUBLIC_KEY" "$ROOT_SSH_DIR/$PUBLIC_KEY"
chmod 600 "$ROOT_SSH_DIR/$PRIVATE_KEY"
chmod 644 "$ROOT_SSH_DIR/$PUBLIC_KEY"

# Remove GitHub host entries from known_hosts if they exist
if [ -f "$ROOT_SSH_DIR/$KNOWN_HOSTS_FILE" ]; then
    sed -i '/github.com/d' "$ROOT_SSH_DIR/$KNOWN_HOSTS_FILE"
    echo "Removed existing GitHub entries from known_hosts."
fi

# Add GitHub to known_hosts again
echo "Adding GitHub to known_hosts..."
ssh-keyscan github.com >> "$ROOT_SSH_DIR/$KNOWN_HOSTS_FILE"
chmod 644 "$ROOT_SSH_DIR/$KNOWN_HOSTS_FILE"

# Start the SSH agent and add the private key
echo "Starting SSH agent..."
eval $(ssh-agent -s)

echo "Adding the private key to the SSH agent..."
ssh-add "$ROOT_SSH_DIR/$PRIVATE_KEY" >/dev/null 2>&1 && echo "Identity added: [Private Key Loaded]"

# Validate the connection with GitHub
echo "Verifying connection with GitHub..."
SSH_OUTPUT=$(ssh -T git@github.com 2>&1)

if [[ "$SSH_OUTPUT" == *"successfully authenticated"* ]]; then
    echo "GitHub authentication successful!"
else
    echo "Warning: GitHub authentication failed. Check SSH keys and access."
    exit 1
fi

exit 0