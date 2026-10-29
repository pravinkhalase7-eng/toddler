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
            when {
                branch 'main'
            }
            steps {
                sh '''
                    set -eu
                    docker rm -f toddler || true
                    docker run -d --name toddler --restart unless-stopped -p 5174:80 toddler:latest
                    docker exec toddler wget -qO- http://127.0.0.1/ >/dev/null
                    echo "Container is serving the site on port 80 inside Docker, published as host port 5174."

                    edge=$(docker ps --format '{{.ID}} {{.Ports}}' | awk '/:80->80/ {print $1; exit}')
                    if [ -z "$edge" ]; then
                        echo "No edge nginx container is publishing port 80."
                        echo "Direct URL depends on the VPS firewall allowing TCP 5174."
                        exit 0
                    fi

                    docker exec -i "$edge" sh -c 'cat > /etc/nginx/conf.d/61-toddler.conf' <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 187.127.138.86;
    location / {
        proxy_pass http://host.docker.internal:5174;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
                    docker exec "$edge" nginx -t
                    docker exec "$edge" nginx -s reload
                    echo "http://187.127.138.86/ proxies to the toddler container."
                    echo "http://187.127.138.86:5174/ works only after the VPS firewall allows TCP 5174."
                '''
            }
        }
    }
}
