pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Build image') {
            steps {
                sh '''
                    docker version
                    docker build -t toddler:latest .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    docker rm -f toddler || true
                    docker run -d --name toddler --restart unless-stopped -p 5174:80 toddler:latest
                    docker exec toddler wget -qO- http://127.0.0.1/ >/dev/null
                    echo "Toddler container is listening on host port 5174 for the doxstation edge."
                    echo "Open http://toddler.doxstation.com/ after the doxstation-proxy job has been built."
                    echo "Do not use http://187.127.138.86:5174/ — that port is closed by the firewall."
                '''
            }
        }
    }
}
