FROM node:20-bullseye

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

WORKDIR /workspace

# Create a shared node_modules directory and set permissions
RUN mkdir -p /usr/local/share/node_modules && \
    chown -R node:node /usr/local/share/node_modules && \
    chmod -R 755 /usr/local/share/node_modules

# Set npm to use the shared directory for global installations
ENV NODE_PATH=/usr/local/share/node_modules
ENV PATH="/usr/local/share/node_modules/bin:${PATH}"

# Switch to node user for npm installations
USER node

# Install packages one by one with error handling
RUN npm install -g npm@latest || exit 1
RUN npm install -g typescript || exit 1
RUN npm install -g @types/node || exit 1
RUN npm install -g eslint || exit 1
RUN npm install -g prettier || exit 1
RUN npm install -g nodemon || exit 1
RUN npm install -g ts-node || exit 1

# [Optional] Uncomment this section if you want to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-here> 