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
                withCredentials([
                    string(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASSWORD'),
                    string(credentialsId: 'azure-client-id', variable: 'AZURE_CLIENT_ID'),
                    string(credentialsId: 'azure-client-secret', variable: 'AZURE_CLIENT_SECRET'),
                    string(credentialsId: 'azure-tenant-id', variable: 'AZURE_TENANT_ID')
                ]) {
                    sh '''
                        VAULT_FILE=$(mktemp)
                        INVENTORY_FILE=$(mktemp)

                        chmod 600 "$VAULT_FILE" "$INVENTORY_FILE"

                        cleanup() {
                            rm -f "$VAULT_FILE" "$INVENTORY_FILE"
                            az logout >/dev/null 2>&1 || true
                        }

                        trap cleanup EXIT

                        printf '%s' "$VAULT_PASSWORD" > "$VAULT_FILE"

                        az login \
                            --service-principal \
                            --username "$AZURE_CLIENT_ID" \
                            --password "$AZURE_CLIENT_SECRET" \
                            --tenant "$AZURE_TENANT_ID" \
                            --output none

                        PUBLIC_IP=$(az vm list-ip-addresses \
                            --resource-group pft-dev-rg \
                            --name pft-vm \
                            --query "[].virtualMachine.network.publicIpAddresses[].ipAddress" \
                            --output tsv)

                        echo "Azure VM public IP: $PUBLIC_IP"

                        printf '%s\\n' \
                            '[web]' \
                            "pft-vm ansible_host=${PUBLIC_IP} ansible_user=azureuser" \
                            > "$INVENTORY_FILE"

                        echo "Dynamic Ansible inventory:"
                        cat "$INVENTORY_FILE"

                        ANSIBLE_VAULT_PASSWORD_FILE="$VAULT_FILE" \
                        ansible-playbook \
                            -i "$INVENTORY_FILE" \
                            infrastructure/deploy-backend.yml \
                            -e "backend_image=manuraj05/pft-backend:${BUILD_NUMBER}"

                        ansible-playbook \
                            -i "$INVENTORY_FILE" \
                            infrastructure/deploy-frontend.yml \
                            -e "frontend_image=manuraj05/pft-frontend:${BUILD_NUMBER}" \
                            -e "backend_url=http://${PUBLIC_IP}:5000/api"
                    '''
                }
            }
        }
    }
}


