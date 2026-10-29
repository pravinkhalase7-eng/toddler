pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        NODE_VERSION = '22.20.0'
        DEPLOY_USER = "${env.DEPLOY_USER ?: 'deploy'}"
        DEPLOY_PATH = "${env.DEPLOY_PATH ?: '/var/www/toddler'}"
        SSH_CREDENTIALS = 'toddler-deploy'
        PATH = "${WORKSPACE}/.node/bin:${env.PATH}"
    }

    stages {
        stage('Install') {
            steps {
                sh '''
                    if ! command -v node >/dev/null 2>&1; then
                        case "$(uname -m)" in
                            x86_64) arch=x64 ;;
                            aarch64|arm64) arch=arm64 ;;
                            *) echo "Unsupported CPU: $(uname -m)" >&2; exit 1 ;;
                        esac
                        mkdir -p .node-tmp
                        url="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${arch}.tar.gz"
                        if command -v curl >/dev/null 2>&1; then
                            curl -fsSL "$url" -o .node-tmp/node.tar.gz
                        elif command -v wget >/dev/null 2>&1; then
                            wget -qO .node-tmp/node.tar.gz "$url"
                        else
                            echo "curl or wget is required to download Node.js" >&2
                            exit 1
                        fi
                        tar -xzf .node-tmp/node.tar.gz -C .node-tmp
                        rm -rf .node
                        mv ".node-tmp/node-v${NODE_VERSION}-linux-${arch}" .node
                        rm -rf .node-tmp
                    fi
                    node -v
                    npm ci
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    set -eu
                    publish() {
                        dir="$1"
                        echo "Publishing dist to ${dir}"
                        mkdir -p "$dir"
                        find "$dir" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
                        cp -a dist/. "$dir/"
                        test -f "${dir}/index.html"
                    }

                    if [ -n "${DEPLOY_HOST:-}" ]; then
                        ssh -o StrictHostKeyChecking=accept-new "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${DEPLOY_PATH}'"
                        rsync -az --delete dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
                        echo "Published to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
                        exit 0
                    fi

                    root=""
                    if [ -d /etc/nginx ]; then
                        root=$(grep -R --include='*.conf' -hE '^[[:space:]]*root[[:space:]]+' /etc/nginx 2>/dev/null | head -1 | awk '{print $2}' | tr -d ';' || true)
                    fi
                    if [ -z "$root" ]; then
                        for candidate in /usr/share/nginx/html /var/www/html /var/www/toddler; do
                            if [ -d "$candidate" ]; then
                                root="$candidate"
                                break
                            fi
                        done
                    fi
                    if [ -z "$root" ]; then
                        root="/var/www/toddler"
                    fi

                    if [ -w "$root" ] || [ -w "$(dirname "$root")" ]; then
                        publish "$root"
                    elif command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
                        sudo mkdir -p "$root"
                        sudo find "$root" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
                        sudo cp -a dist/. "$root/"
                        sudo test -f "${root}/index.html"
                        echo "Published dist to ${root}"
                    else
                        echo "Cannot write ${root}. The Jenkins user needs write access to the nginx site folder, or set DEPLOY_HOST." >&2
                        echo "Port 5174 is not open on this server. Nginx is already answering on port 80." >&2
                        exit 1
                    fi
                    echo "Open the site on port 80. Port 5174 is closed on this server."
                '''
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true, onlyIfSuccessful: true
        }
    }
}
