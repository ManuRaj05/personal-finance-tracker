pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ManuRaj05/personal-finance-tracker.git'
            }
        }

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
    }
}


