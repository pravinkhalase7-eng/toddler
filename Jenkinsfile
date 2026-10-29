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
                script {
                    if (!env.DEPLOY_HOST?.trim()) {
                        echo 'DEPLOY_HOST is not set. The site was built and archived, and was not copied to a server.'
                        return
                    }
                    sshagent(credentials: [env.SSH_CREDENTIALS]) {
                        sh '''
                            ssh -o StrictHostKeyChecking=accept-new "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${DEPLOY_PATH}'"
                            rsync -az --delete dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true, onlyIfSuccessful: true
        }
    }
}
