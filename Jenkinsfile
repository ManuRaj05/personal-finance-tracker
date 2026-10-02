pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }

                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t pft-backend:${BUILD_NUMBER} ./backend'
                sh 'docker build -t pft-frontend:${BUILD_NUMBER} ./frontend'
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

                        docker tag pft-backend:${BUILD_NUMBER} $DOCKER_USERNAME/pft-backend:${BUILD_NUMBER}
                        docker tag pft-frontend:${BUILD_NUMBER} $DOCKER_USERNAME/pft-frontend:${BUILD_NUMBER}

                        docker push $DOCKER_USERNAME/pft-backend:${BUILD_NUMBER}
                        docker push $DOCKER_USERNAME/pft-frontend:${BUILD_NUMBER}

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                withCredentials([string(
                    credentialsId: 'ansible-vault-password',
                    variable: 'VAULT_PASSWORD'
                )]) {
                    sh '''
                        VAULT_FILE=$(mktemp)
                        chmod 600 "$VAULT_FILE"
                        trap 'rm -f "$VAULT_FILE"' EXIT

                        printf '%s' "$VAULT_PASSWORD" > "$VAULT_FILE"

                        ANSIBLE_VAULT_PASSWORD_FILE="$VAULT_FILE" \
                        ansible-playbook \
                            -i infrastructure/inventory \
                            infrastructure/deploy-backend.yml \
                            -e "backend_image=manuraj05/pft-backend:${BUILD_NUMBER}"

                        ANSIBLE_VAULT_PASSWORD_FILE="$VAULT_FILE" \
                        ansible-playbook \
                            -i infrastructure/inventory \
                            infrastructure/deploy-frontend.yml \
                            -e "frontend_image=manuraj05/pft-frontend:${BUILD_NUMBER}"
                    '''
                }
            }
        }
    }
}


