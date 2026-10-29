pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DEPLOY_USER = "${env.DEPLOY_USER ?: 'deploy'}"
        DEPLOY_PATH = "${env.DEPLOY_PATH ?: '/var/www/toddler'}"
        SSH_CREDENTIALS = 'toddler-deploy'
    }

    stages {
        stage('Install') {
            steps {
                sh 'node -v'
                sh 'npm ci'
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
                        error 'Set DEPLOY_HOST to the server that should serve the site. Add an SSH key credential named toddler-deploy.'
                    }
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

    post {
        success {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true, onlyIfSuccessful: true
        }
    }
}
