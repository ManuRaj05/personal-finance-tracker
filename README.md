# Personal Finance Tracker

A full-stack Personal Finance Tracker deployed with Docker, Jenkins,
Terraform, Ansible, Azure, Prometheus, and Grafana.

This repository is designed as a **DevOps-focused deployment project**
as well as a working web application. The goal is not only to run the
application, but to make the infrastructure and deployment process
reproducible.

A new user should be able to clone the repository, understand the
architecture, configure the required secrets, provision Azure
infrastructure with Terraform, and deploy the application through
Jenkins.

------------------------------------------------------------------------

## 1. Project Overview

Personal Finance Tracker is a web application for managing personal
financial information.

The application consists of:

-   A Next.js frontend
-   A Node.js/Express backend
-   MongoDB Atlas as the database
-   JWT-based authentication
-   Docker containers for the frontend and backend
-   Jenkins for CI/CD
-   Docker Hub for container image storage
-   Terraform for Azure infrastructure provisioning
-   Ansible for server configuration and application deployment
-   Prometheus for metrics collection
-   Node Exporter for Azure VM metrics
-   cAdvisor for Docker container metrics
-   Grafana for monitoring dashboards

### Main DevOps flow

``` text
Developer
   |
   | git push
   v
GitHub
   |
   | webhook / SCM trigger
   v
Jenkins
   |
   +--> Install dependencies
   |
   +--> Run tests
   |
   +--> Build Docker images
   |
   +--> Push images to Docker Hub
   |
   +--> Authenticate to Azure
   |
   +--> Discover current VM public IP
   |
   +--> Generate temporary Ansible inventory
   |
   +--> Install/configure Docker
   |
   +--> Deploy backend
   |
   +--> Deploy frontend
   |
   +--> Deploy monitoring stack
   |
   v
Azure VM
   |
   +--> Frontend
   +--> Backend
   +--> Node Exporter
   +--> cAdvisor
   +--> Prometheus
   +--> Grafana
```

------------------------------------------------------------------------

# 2. Architecture

## Application architecture

``` text
                         Internet
                            |
                            |
                    Azure Public IP
                            |
              +-------------+-------------+
              |                           |
          Port 3000                   Port 5000
              |                           |
              v                           v
     Next.js Frontend            Node.js/Express Backend
              |                           |
              |                           |
              +---------------------------+
                            |
                            v
                       MongoDB Atlas
```

## Monitoring architecture

``` text
                    Grafana
                       |
                       | PromQL
                       v
                  Prometheus
                  /         \
                 /           \
                v             v
        Node Exporter       cAdvisor
                |             |
                v             v
          Azure VM       Docker containers
                              |
                    +---------+---------+
                    |                   |
                    v                   v
              PFT Backend        PFT Frontend
```

### What each monitoring component does

  -----------------------------------------------------------------------
  Component                           Purpose
  ----------------------------------- -----------------------------------
  Node Exporter                       Collects Linux/Azure VM metrics
                                      such as CPU, memory, disk and
                                      network

  cAdvisor                            Collects Docker container CPU and
                                      memory metrics

  Prometheus                          Scrapes and stores metrics

  Grafana                             Queries Prometheus and displays
                                      dashboards
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3. Technology Stack

## Application

-   Next.js
-   React
-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   JWT authentication

## DevOps

-   Git
-   GitHub
-   Docker
-   Docker Hub
-   Jenkins
-   Terraform
-   Ansible
-   Azure

## Monitoring

-   Prometheus
-   Grafana
-   Node Exporter
-   cAdvisor

------------------------------------------------------------------------

# 4. Repository Structure

``` text
personal-finance-tracker/
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── ...
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── next.config.mjs
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   └── ...
│
├── infrastructure/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── terraform.tfvars
│   │
│   ├── install-docker.yml
│   ├── deploy-backend.yml
│   ├── deploy-frontend.yml
│   ├── setup-monitoring.yml
│   │
│   ├── prometheus.yml
│   │
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── prometheus.yml
│       │   └── dashboards/
│       │       └── dashboards.yml
│       │
│       └── dashboards/
│           └── pft-monitoring.json
│
├── Jenkinsfile
├── .gitignore
├── LICENSE
└── README.md
```

> The exact application files inside `frontend/` and `backend/` may grow
> as application features are added.

------------------------------------------------------------------------

# 5. Prerequisites

A machine used to work with this project should have the following
tools.

## Required for local application development

-   Git
-   Node.js 22+
-   npm
-   MongoDB Atlas account

## Required for Docker deployment

-   Docker
-   Docker Compose plugin (optional for local compose-based workflows)

## Required for Azure infrastructure

-   Azure account/subscription
-   Azure CLI
-   Terraform

## Required for CI/CD

-   Jenkins
-   Java/JDK compatible with the installed Jenkins version
-   Jenkins Docker access
-   Jenkins Ansible
-   Ansible Docker collection
-   Azure CLI available to Jenkins
-   Docker Hub account

------------------------------------------------------------------------

# 6. Clone the Repository

``` bash
git clone <repository-url>
cd personal-finance-tracker
```

Replace `<repository-url>` with the repository URL.

------------------------------------------------------------------------

# 7. Application Configuration

The repository intentionally does not contain production secrets.

Environment variables are excluded through `.gitignore`.

## Backend environment variables

Create:

``` text
backend/.env
```

based on:

``` text
backend/.env.example
```

Example:

``` env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000
```

### Variables

  Variable        Description
  --------------- ------------------------------------
  `MONGODB_URI`   MongoDB Atlas connection string
  `JWT_SECRET`    Secret used for JWT authentication
  `PORT`          Backend listening port

Do not commit the real `.env` file.

------------------------------------------------------------------------

## Frontend environment variables

Create the appropriate frontend environment file based on:

``` text
frontend/.env.example
```

Example:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For local development:

``` text
http://localhost:5000/api
```

When the frontend is deployed to Azure, Jenkins passes the Azure VM
backend URL during deployment.

------------------------------------------------------------------------

# 8. Running the Application Locally

## Backend

``` bash
cd backend
npm ci
npm start
```

The backend runs on:

``` text
http://localhost:5000
```

The API base path is:

``` text
http://localhost:5000/api
```

------------------------------------------------------------------------

## Frontend

Open another terminal:

``` bash
cd frontend
npm ci
npm run dev
```

The frontend normally runs on:

``` text
http://localhost:3000
```

The frontend uses `NEXT_PUBLIC_API_URL` to communicate with the backend.

------------------------------------------------------------------------

# 9. Running with Docker Locally

The backend and frontend each have their own Dockerfile.

## Build backend image

From the repository root:

``` bash
docker build -t pft-backend:local ./backend
```

## Build frontend image

``` bash
docker build -t pft-frontend:local ./frontend
```

------------------------------------------------------------------------

## Create Docker network

``` bash
docker network create pft-network
```

If the network already exists, Docker will report that it exists.

------------------------------------------------------------------------

## Run backend

The backend needs the MongoDB URI and JWT secret.

Example:

``` bash
docker run -d \
  --name pft-backend \
  --network pft-network \
  -p 5000:5000 \
  --env-file backend/.env \
  pft-backend:local
```

------------------------------------------------------------------------

## Run frontend

Because the frontend container must communicate with the backend
container through the Docker network:

``` bash
docker run -d \
  --name pft-frontend \
  --network pft-network \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://pft-backend:5000/api \
  pft-frontend:local
```

The application should then be available at:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 10. Docker Image Design

## Backend

The backend Dockerfile:

1.  Uses Node.js 22
2.  Creates `/usr/src/app`
3.  Copies `package.json` and `package-lock.json`
4.  Runs `npm ci`
5.  Copies the application
6.  Exposes port 5000
7.  Starts `server.js`

The dependency installation is performed before copying the remaining
application files so Docker can reuse the dependency layer when
appropriate.

------------------------------------------------------------------------

## Frontend

The frontend uses a multi-stage Docker build.

### Builder stage

``` text
Node.js
   |
   +--> npm ci
   |
   +--> npm run build
```

### Runtime stage

Only the required Next.js standalone output and static files are copied
into the final image.

This reduces the runtime image compared with keeping the complete build
environment.

------------------------------------------------------------------------

# 11. Git Workflow

The repository uses Git and GitHub as the source of truth.

Typical workflow:

``` bash
git status
git add .
git commit -m "Describe the change"
git push origin main
```

A push to `main` triggers the Jenkins pipeline.

An empty commit can also be used when the infrastructure needs to be
redeployed without changing application source code:

``` bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

This is useful after rebuilding Azure infrastructure.

------------------------------------------------------------------------

# 12. Jenkins CI/CD Pipeline

The Jenkins pipeline is defined in:

``` text
Jenkinsfile
```

The pipeline is configured as a Jenkins Pipeline job using:

``` text
Pipeline script from SCM
```

SCM:

``` text
GitHub repository
```

Branch:

``` text
main
```

Script:

``` text
Jenkinsfile
```

------------------------------------------------------------------------

## Jenkins pipeline stages

The current pipeline contains these stages:

``` text
1. Install Dependencies
2. Test
3. Build Docker Images
4. Push Docker Images
5. Deploy to Azure
```

------------------------------------------------------------------------

## Stage 1: Install Dependencies

Jenkins runs:

``` bash
npm ci
```

inside:

``` text
backend/
frontend/
```

`npm ci` uses the committed lock files for reproducible dependency
installation.

------------------------------------------------------------------------

# 13. Test Stage

The current backend test command is:

``` bash
npm test
```

At the current project stage, the backend test script is a placeholder:

``` text
No tests specified
```

and exits successfully.

This stage is intentionally kept in the pipeline so real automated tests
can be added later without redesigning the pipeline.

------------------------------------------------------------------------

# 14. Docker Build Stage

Jenkins creates build-specific image tags using the Jenkins build
number.

Example:

``` text
pft-backend:17
pft-frontend:17
```

The images are built from:

``` text
./backend
./frontend
```

------------------------------------------------------------------------

# 15. Docker Hub

Jenkins pushes the images to Docker Hub.

Repository pattern:

``` text
<docker-username>/pft-backend:<build-number>
<docker-username>/pft-frontend:<build-number>
```

Example:

``` text
manuraj05/pft-backend:17
manuraj05/pft-frontend:17
```

The Docker Hub password is not stored inside the Jenkinsfile.

Jenkins uses a Jenkins credential named:

``` text
dockerhub-credentials
```

The credential contains the Docker Hub username and PAT/password.

------------------------------------------------------------------------

# 16. Jenkins Credentials

The pipeline expects these Jenkins credentials:

  --------------------------------------------------------------------------
  Credential ID              Type                    Purpose
  -------------------------- ----------------------- -----------------------
  `dockerhub-credentials`    Username/password       Push Docker images

  `ansible-vault-password`   Secret text             Decrypt Ansible Vault
                                                     secrets

  `azure-client-id`          Secret text             Azure service principal
                                                     authentication

  `azure-client-secret`      Secret text             Azure service principal
                                                     authentication

  `azure-tenant-id`          Secret text             Azure tenant
                                                     authentication
  --------------------------------------------------------------------------

Never commit the values of these credentials to Git.

------------------------------------------------------------------------

# 17. Azure Authentication from Jenkins

Jenkins authenticates to Azure using a service principal.

The pipeline performs:

``` bash
az login \
  --service-principal \
  --username "$AZURE_CLIENT_ID" \
  --password "$AZURE_CLIENT_SECRET" \
  --tenant "$AZURE_TENANT_ID"
```

After deployment:

``` bash
az logout
```

is executed.

The Azure credentials are supplied through Jenkins credentials rather
than hardcoded in the repository.

------------------------------------------------------------------------

# 18. Dynamic Azure VM IP

One important design decision is that the Jenkins pipeline does **not**
hardcode the Azure VM public IP.

It queries Azure:

``` bash
az vm list-ip-addresses \
  --resource-group pft-dev-rg \
  --name pft-vm
```

The returned IP is stored in:

``` text
PUBLIC_IP
```

Jenkins then creates a temporary Ansible inventory containing the
current VM address.

Example:

``` ini
[web]
pft-vm ansible_host=<CURRENT_PUBLIC_IP> ansible_user=azureuser
```

This is important because destroying and recreating the infrastructure
can result in a different public IP.

------------------------------------------------------------------------

# 19. Ansible Deployment

Ansible is used to configure the Azure VM and deploy the application.

Playbooks:

``` text
infrastructure/install-docker.yml
infrastructure/deploy-backend.yml
infrastructure/deploy-frontend.yml
infrastructure/setup-monitoring.yml
```

------------------------------------------------------------------------

# 20. Docker Installation Playbook

`install-docker.yml` is responsible for:

-   Installing Docker
-   Installing Docker Compose v2 package where configured
-   Starting Docker
-   Adding `azureuser` to the Docker group

This allows the newly created VM to become a Docker deployment host.

------------------------------------------------------------------------

# 21. Backend Deployment

`deploy-backend.yml`:

1.  Installs the Python Docker SDK required by Ansible's Docker modules
2.  Creates the application Docker network
3.  Pulls the requested Docker Hub backend image
4.  Runs the backend container
5.  Supplies the required environment variables securely through Ansible
    Vault
6.  Exposes port 5000

The image is passed from Jenkins:

``` text
backend_image=manuraj05/pft-backend:<BUILD_NUMBER>
```

------------------------------------------------------------------------

# 22. Ansible Vault

Sensitive backend values are encrypted using Ansible Vault.

The repository should not contain plaintext production secrets.

Jenkins provides the Vault password through:

``` text
ansible-vault-password
```

The pipeline creates a temporary password file during deployment and
removes it after deployment.

The temporary files are not intended to be committed to Git.

------------------------------------------------------------------------

# 23. Frontend Deployment

`deploy-frontend.yml`:

1.  Pulls the frontend Docker image
2.  Creates/runs the frontend container
3.  Connects the container to the application Docker network
4.  Passes the backend URL
5.  Exposes port 3000

Jenkins dynamically supplies:

``` text
http://<CURRENT_AZURE_PUBLIC_IP>:5000/api
```

as the frontend API URL.

------------------------------------------------------------------------

# 24. Terraform Infrastructure

Terraform files are located in:

``` text
infrastructure/
```

Terraform is responsible for creating the Azure infrastructure.

The infrastructure includes the resources defined in `main.tf`,
including the resource group, networking, VM and network security
configuration.

Terraform also defines the required inbound application/monitoring
ports.

------------------------------------------------------------------------

# 25. Terraform Workflow

Move into the infrastructure directory:

``` bash
cd infrastructure
```

Initialize Terraform:

``` bash
terraform init
```

Format Terraform files:

``` bash
terraform fmt
```

Validate configuration:

``` bash
terraform validate
```

Preview changes:

``` bash
terraform plan
```

Create/update infrastructure:

``` bash
terraform apply
```

Destroy infrastructure:

``` bash
terraform destroy
```

------------------------------------------------------------------------

# 26. Important Terraform Warning

Terraform state files contain infrastructure information and must not be
committed to Git.

The repository `.gitignore` excludes:

``` text
terraform.tfstate
terraform.tfstate.backup
```

Do not remove these entries unless you have deliberately chosen another
secure Terraform state strategy.

For a production project, a remote Terraform backend/state store should
be considered.

------------------------------------------------------------------------

# 27. Azure Network Security

The Azure Network Security Group allows the application and Grafana
ports required by the current architecture.

Current public ports:

  Port   Service           Purpose
  ------ ----------------- ----------------------
  3000   Next.js           Frontend
  5000   Node.js/Express   Backend API
  3001   Grafana           Monitoring dashboard

Prometheus and exporter ports are intended to remain internal to the
monitoring setup rather than being exposed publicly.

------------------------------------------------------------------------

# 28. Monitoring Setup

The monitoring stack is deployed automatically by:

``` text
infrastructure/setup-monitoring.yml
```

The playbook installs/configures:

``` text
Node Exporter
cAdvisor
Prometheus
Grafana
```

------------------------------------------------------------------------

# 29. Node Exporter

Node Exporter runs with host networking and collects host-level Linux
metrics.

It provides metrics such as:

-   CPU usage
-   Memory usage
-   Disk usage
-   Network traffic

Prometheus scrapes Node Exporter on:

``` text
host.docker.internal:9100
```

------------------------------------------------------------------------

# 30. cAdvisor

cAdvisor collects Docker container metrics.

It provides container-level information such as:

-   Container CPU usage
-   Container memory usage
-   Container resource activity

The current monitoring dashboard uses cAdvisor data for:

``` text
pft-backend
pft-frontend
```

------------------------------------------------------------------------

# 31. Prometheus

Prometheus is configured through:

``` text
infrastructure/prometheus.yml
```

Current scrape interval:

``` yaml
scrape_interval: 15s
```

Prometheus scrapes:

``` text
Node Exporter
cAdvisor
```

Prometheus runs internally on:

``` text
9090
```

The port is not intended to be publicly exposed through the Azure NSG in
the current architecture.

------------------------------------------------------------------------

# 32. Grafana

Grafana runs in Docker and is exposed through:

``` text
Azure VM public IP:3001
```

Example:

``` text
http://<AZURE_PUBLIC_IP>:3001
```

Grafana uses Prometheus as its datasource.

------------------------------------------------------------------------

# 33. Grafana Provisioning

Grafana is not dependent on manually recreating the dashboard.

The repository contains:

``` text
infrastructure/grafana/provisioning/datasources/prometheus.yml
```

which provisions the Prometheus datasource.

The dashboard provider is:

``` text
infrastructure/grafana/provisioning/dashboards/dashboards.yml
```

The dashboard itself is stored in:

``` text
infrastructure/grafana/dashboards/pft-monitoring.json
```

This means the dashboard configuration is version-controlled in Git.

------------------------------------------------------------------------

# 34. Current Grafana Dashboard

The dashboard is called:

``` text
Monitoring PFT
```

It currently contains nine panels:

### Host metrics

1.  CPU Usage
2.  Memory Usage
3.  Disk Usage
4.  Network Receive
5.  Network Transmit

### Backend metrics

6.  PFT Backend CPU
7.  PFT Backend Memory

### Frontend metrics

8.  PFT Frontend CPU
9.  PFT Frontend Memory

------------------------------------------------------------------------

# 35. Monitoring Queries

The current dashboard uses PromQL.

Examples include:

### Host CPU

``` promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### Host memory

``` promql
100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))
```

### Backend CPU

``` promql
sum by (name) (
  rate(container_cpu_usage_seconds_total{name="pft-backend",image!=""}[5m])
) * 100
```

### Backend memory

``` promql
container_memory_working_set_bytes{name="pft-backend"}
```

### Frontend CPU

``` promql
sum by (name) (
  rate(container_cpu_usage_seconds_total{name="pft-frontend",image!=""}[5m])
) * 100
```

### Frontend memory

``` promql
container_memory_working_set_bytes{name="pft-frontend"}
```

------------------------------------------------------------------------

# 36. Reproducibility Test

The infrastructure has been tested using the following process:

``` text
1. Existing Azure infrastructure destroyed
2. Terraform recreated the infrastructure
3. Azure created a new VM
4. VM received a new public IP
5. Empty Git commit pushed
6. GitHub triggered Jenkins
7. Jenkins discovered the new VM IP dynamically
8. Jenkins installed Docker
9. Jenkins deployed backend
10. Jenkins deployed frontend
11. Jenkins deployed monitoring
12. Grafana provisioning restored the dashboard
```

The important point is that the deployment did not depend on the
previous VM or its previous IP address.

This demonstrates that the infrastructure and deployment process are
reproducible.

------------------------------------------------------------------------

# 37. Complete Fresh Deployment

For a complete rebuild:

## Step 1: Destroy infrastructure

``` bash
cd infrastructure
terraform destroy
```

Confirm the destruction when Terraform asks.

------------------------------------------------------------------------

## Step 2: Recreate infrastructure

``` bash
terraform apply
```

Wait for:

``` text
Apply complete!
```

------------------------------------------------------------------------

## Step 3: Trigger Jenkins

Terraform itself does not trigger Jenkins.

After the new infrastructure exists, trigger Jenkins by pushing a normal
change or an empty commit:

``` bash
git commit --allow-empty -m "Trigger deployment after infrastructure rebuild"
git push origin main
```

Jenkins will then:

``` text
Discover new VM IP
        ↓
Install Docker
        ↓
Deploy backend
        ↓
Deploy frontend
        ↓
Deploy monitoring
        ↓
Provision Grafana
```

------------------------------------------------------------------------

# 38. Verifying the Deployment

After Jenkins reports success, obtain the VM IP:

``` bash
az vm list-ip-addresses \
  --resource-group pft-dev-rg \
  --name pft-vm \
  --output table
```

Then test:

### Frontend

``` text
http://<PUBLIC_IP>:3000
```

### Backend

``` text
http://<PUBLIC_IP>:5000
```

### Grafana

``` text
http://<PUBLIC_IP>:3001
```

------------------------------------------------------------------------

# 39. Verification Checklist

After a fresh deployment, verify:

``` text
[ ] Azure VM exists
[ ] VM has a public IP
[ ] Jenkins deployment succeeded
[ ] Backend container is running
[ ] Frontend container is running
[ ] Backend can reach MongoDB Atlas
[ ] Frontend can reach backend
[ ] Node Exporter is running
[ ] cAdvisor is running
[ ] Prometheus is running
[ ] Prometheus targets are UP
[ ] Grafana is running
[ ] Prometheus datasource exists
[ ] Monitoring PFT dashboard exists
[ ] Dashboard panels show live metrics
```

------------------------------------------------------------------------

# 40. Useful Azure Commands

Show the resource group:

``` bash
az group show --name pft-dev-rg
```

Get VM information:

``` bash
az vm show \
  --resource-group pft-dev-rg \
  --name pft-vm
```

Get VM public IP:

``` bash
az vm list-ip-addresses \
  --resource-group pft-dev-rg \
  --name pft-vm
```

List resources:

``` bash
az resource list \
  --resource-group pft-dev-rg \
  --output table
```

------------------------------------------------------------------------

# 41. Useful Docker Commands on the Azure VM

List containers:

``` bash
docker ps
```

List all containers:

``` bash
docker ps -a
```

View images:

``` bash
docker images
```

View backend logs:

``` bash
docker logs pft-backend
```

View frontend logs:

``` bash
docker logs pft-frontend
```

View Prometheus logs:

``` bash
docker logs prometheus
```

View Grafana logs:

``` bash
docker logs grafana
```

View cAdvisor logs:

``` bash
docker logs cadvisor
```

View Node Exporter logs:

``` bash
docker logs node-exporter
```

------------------------------------------------------------------------

# 42. Useful Ansible Commands

Test connectivity:

``` bash
ansible -i inventory.ini web -m ping
```

Run Docker installation:

``` bash
ansible-playbook \
  -i inventory.ini \
  infrastructure/install-docker.yml
```

Deploy backend:

``` bash
ANSIBLE_VAULT_PASSWORD_FILE=<vault-password-file> \
ansible-playbook \
  -i inventory.ini \
  infrastructure/deploy-backend.yml
```

Deploy frontend:

``` bash
ansible-playbook \
  -i inventory.ini \
  infrastructure/deploy-frontend.yml
```

Deploy monitoring:

``` bash
ansible-playbook \
  -i inventory.ini \
  infrastructure/setup-monitoring.yml
```

The exact inventory and secret handling used by Jenkins are
intentionally temporary and dynamically generated.

------------------------------------------------------------------------

# 43. Security

This repository is designed so that secrets are not stored in source
control.

Do not commit:

``` text
.env
.env.*
terraform.tfstate
terraform.tfstate.backup
Ansible Vault passwords
Azure client secrets
Docker Hub PATs
SSH private keys
```

The root `.gitignore` excludes environment files, Terraform state and
common generated files.

### Secrets used by the deployment

``` text
MongoDB credentials
JWT secret
Ansible Vault password
Azure service principal secret
Docker Hub PAT
SSH private key
```

These should be stored in the appropriate secret-management system or
Jenkins credentials rather than Git.

------------------------------------------------------------------------

# 44. Jenkins SSH Access

Jenkins uses its own SSH key for connecting to the Azure VM.

The private key belongs to the Jenkins environment and should never be
committed to this repository.

The Jenkins pipeline also performs host-key discovery using:

``` bash
ssh-keyscan
```

and creates a temporary/dynamic Ansible inventory for the current VM.

------------------------------------------------------------------------

# 45. Idempotency

The Ansible playbooks are designed to be repeatable.

Running the monitoring playbook against an already configured VM should
not recreate everything unnecessarily.

For example, once the monitoring stack is configured, repeated runs
should report many tasks as:

``` text
ok
```

rather than repeatedly changing the system.

This is an important Ansible principle:

> Running the automation again should converge the machine toward the
> desired state.

------------------------------------------------------------------------

# 46. Current Limitations

This project is intentionally a learning/portfolio deployment rather
than a production-grade platform.

Current limitations include:

### Testing

The current backend test stage is a placeholder.

Real unit/integration/API tests should be added later.

### Secrets

Secrets are handled through Jenkins credentials and Ansible Vault, but a
production deployment could use a dedicated secret manager such as Azure
Key Vault.

### Terraform state

Terraform state is currently local and excluded from Git.

A production implementation should use a secure remote backend.

### HTTPS

The current application is exposed using HTTP ports.

Production deployment should use HTTPS with a reverse proxy/load
balancer and TLS certificates.

### Public backend port

The backend is currently reachable through port 5000.

A production architecture would normally place the backend behind a
reverse proxy/API gateway and restrict direct public access.

### Monitoring

The current monitoring stack focuses on VM and Docker container metrics.

Application-specific metrics, database metrics, alert rules and
notification channels can be added later.

### High availability

The current architecture uses a single Azure VM.

There is no multi-VM high availability configuration.

------------------------------------------------------------------------

# 47. Why Terraform + Ansible + Jenkins Are All Used

These tools have different responsibilities.

## Terraform

Terraform answers:

> What infrastructure should exist?

Examples:

``` text
Resource Group
Network
Subnet
VM
Public IP
NSG
```

------------------------------------------------------------------------

## Ansible

Ansible answers:

> How should the server be configured?

Examples:

``` text
Install Docker
Create Docker network
Run containers
Install monitoring
Configure Grafana
```

------------------------------------------------------------------------

## Jenkins

Jenkins answers:

> When should the deployment happen and how should the delivery process
> be orchestrated?

Examples:

``` text
Git push
   ↓
Build
   ↓
Test
   ↓
Docker build
   ↓
Docker Hub push
   ↓
Azure authentication
   ↓
Ansible deployment
```

------------------------------------------------------------------------

# 48. Why Docker Hub Is Used

Jenkins builds the application images and pushes them to Docker Hub.

The Azure VM then pulls the exact image tag selected by Jenkins.

Example:

``` text
Jenkins Build #17
        |
        +--> manuraj05/pft-backend:17
        |
        +--> manuraj05/pft-frontend:17
```

This separates:

``` text
Build environment
```

from:

``` text
Runtime environment
```

The Azure VM does not need the source code or a Node.js development
environment to build the application. It only needs to pull and run the
container images.

------------------------------------------------------------------------

# 49. Deployment Versioning

Docker images use the Jenkins build number as their tag.

Example:

``` text
Build #17
    |
    +--> pft-backend:17
    +--> pft-frontend:17
```

This makes it possible to identify which Jenkins build produced a
deployed image.

The deployment playbooks receive the image tag from Jenkins rather than
using a hardcoded application version.

------------------------------------------------------------------------

# 50. CI/CD Lifecycle

The complete lifecycle is:

``` text
Developer changes code
        |
        v
git add / commit
        |
        v
git push
        |
        v
GitHub
        |
        v
Jenkins
        |
        +--> npm ci
        |
        +--> npm test
        |
        +--> Docker build
        |
        +--> Docker push
        |
        +--> Azure login
        |
        +--> Discover VM IP
        |
        +--> Ansible
               |
               +--> Docker
               +--> Backend
               +--> Frontend
               +--> Monitoring
        |
        v
Running application
        |
        v
Prometheus
        |
        v
Grafana
```

------------------------------------------------------------------------

# 51. Troubleshooting

## Jenkins cannot connect to Azure

Check:

``` bash
az login
az account show
```

Then verify that the Jenkins service principal has the required
permissions.

Also verify the Jenkins credentials:

``` text
azure-client-id
azure-client-secret
azure-tenant-id
```

------------------------------------------------------------------------

## Jenkins cannot connect to the VM

Check the VM public IP:

``` bash
az vm list-ip-addresses \
  --resource-group pft-dev-rg \
  --name pft-vm
```

Check that SSH is allowed by the Azure NSG.

Check that the VM is running.

------------------------------------------------------------------------

## Backend container exits

Check:

``` bash
docker ps -a
docker logs pft-backend
```

Common causes:

-   Incorrect MongoDB URI
-   Incorrect JWT secret
-   MongoDB Atlas network access restrictions
-   Missing environment variables

------------------------------------------------------------------------

## Frontend loads but API calls fail

Check the frontend container environment:

``` bash
docker inspect pft-frontend
```

Verify that:

``` text
NEXT_PUBLIC_API_URL
```

points to the current backend URL.

For the Azure deployment it should look like:

``` text
http://<PUBLIC_IP>:5000/api
```

------------------------------------------------------------------------

## Prometheus target is DOWN

Check:

``` bash
docker logs prometheus
```

Then verify the exporters:

``` bash
docker ps
```

Node Exporter should be running.

cAdvisor should be running.

------------------------------------------------------------------------

## Grafana dashboard is missing

Check:

``` bash
docker logs grafana
```

Verify that the following directories/files exist on the VM:

``` text
/opt/pft-monitoring/grafana/provisioning/
/opt/pft-monitoring/grafana/dashboards/
```

The Ansible monitoring playbook should recreate these files.

------------------------------------------------------------------------

# 52. Rebuilding Only the Application

If the infrastructure is still running, a normal Git push is enough to
trigger the Jenkins pipeline.

You do not need to run Terraform every time application code changes.

``` text
Application change
       |
       v
git push
       |
       v
Jenkins
       |
       v
New Docker image
       |
       v
Ansible deployment
```

Terraform is primarily concerned with infrastructure.

------------------------------------------------------------------------

# 53. Rebuilding the Infrastructure

If the infrastructure itself needs to be recreated:

``` bash
terraform destroy
terraform apply
```

After the new infrastructure exists, trigger Jenkins.

Because Jenkins dynamically discovers the current VM IP, it does not
depend on the previous VM IP.

------------------------------------------------------------------------

# 54. Development vs Deployment

## Local development

``` text
Developer laptop
    |
    +--> Next.js
    +--> Node.js
    +--> MongoDB Atlas
```

## Containerized local environment

``` text
Developer laptop
    |
    +--> Docker
          |
          +--> frontend
          +--> backend
```

## Azure deployment

``` text
Azure
 |
 +--> VM
       |
       +--> frontend container
       +--> backend container
       +--> node-exporter
       +--> cadvisor
       +--> prometheus
       +--> grafana
```

------------------------------------------------------------------------

# 55. Project Goals

This project demonstrates practical understanding of:

-   Git-based development
-   GitHub source control
-   Docker containerization
-   Docker image versioning
-   Jenkins CI/CD
-   Docker Hub image publishing
-   Azure infrastructure
-   Terraform infrastructure as code
-   Ansible configuration management
-   Dynamic infrastructure discovery
-   Secret handling
-   Ansible Vault
-   Prometheus monitoring
-   Grafana dashboards
-   Node Exporter
-   cAdvisor
-   Infrastructure recreation
-   Reproducible deployment

------------------------------------------------------------------------

# 56. Final Result

The project has been tested by destroying and recreating the Azure
infrastructure.

The recreated environment successfully received:

``` text
Application
    |
    +--> Backend
    +--> Frontend
    |
Monitoring
    |
    +--> Node Exporter
    +--> cAdvisor
    +--> Prometheus
    +--> Grafana
```

The Grafana dashboard is stored in Git and automatically provisioned
during deployment.

Therefore, the project is not dependent on manually configuring the new
VM after infrastructure recreation.

------------------------------------------------------------------------

# 57. Future Improvements

Possible next improvements:

-   Add proper automated backend tests
-   Add frontend tests
-   Add API integration tests
-   Add Docker image vulnerability scanning
-   Add Trivy scanning
-   Add Jenkins quality gates
-   Add Azure Key Vault
-   Add Terraform remote state
-   Add HTTPS/TLS
-   Add Nginx or an Azure Application Gateway
-   Add Prometheus alert rules
-   Add Grafana alerts
-   Add application-level Prometheus metrics
-   Add MongoDB monitoring
-   Add centralized logging
-   Add backup strategy
-   Add Azure Managed Identity
-   Add separate development/staging/production environments
-   Add automatic rollback
-   Add blue/green or rolling deployment
-   Add Kubernetes as a future evolution of the deployment architecture

------------------------------------------------------------------------

# 58. Quick Start Summary

For someone who already has all required accounts and tools:

``` bash
# Clone
git clone <repository-url>
cd personal-finance-tracker

# Configure application secrets
cp backend/.env.example backend/.env

# Local backend
cd backend
npm ci
npm start

# Local frontend
cd ../frontend
npm ci
npm run dev
```

For Azure:

``` bash
cd infrastructure

terraform init
terraform validate
terraform plan
terraform apply
```

Then configure Jenkins and trigger:

``` bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

Jenkins handles:

``` text
Build
  ↓
Test
  ↓
Docker images
  ↓
Docker Hub
  ↓
Azure authentication
  ↓
Dynamic VM discovery
  ↓
Ansible
  ↓
Application deployment
  ↓
Monitoring deployment
  ↓
Grafana provisioning
```

------------------------------------------------------------------------

# 59. Important Note for Contributors

Before making changes:

1.  Do not commit secrets.
2.  Do not commit `.env` files.
3.  Do not commit Terraform state.
4.  Keep Dockerfiles reproducible.
5.  Update Ansible playbooks when deployment requirements change.
6.  Update Grafana provisioning files when dashboards change.
7.  Test locally before pushing.
8.  Verify the Jenkins pipeline after deployment-related changes.

------------------------------------------------------------------------

## License

This project is licensed under the GNU General Public License v3.0. See
`LICENSE` for details.
