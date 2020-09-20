
# -------------
# k8s
# -------------

http://get.docker.com # script for installing docker (nice for swarm prep)

# Kubernetes Install and Your First Pods

## Kubernetes Local Install
http://play-with-k8s.com
katacoda.com

### minikube
minikube-installer.exe
minikube start

### microk8s
microk8s.kubectl
microk8s.enable dns
alias kubectl=microk8s.kubectl

## Kubectl run, create and apply
kubectl run
kubectl create
kubectl apply

## Our First Pod With Kubectl run
kubectl version
kubectl run my-nginx --image nginx
kubectl get pods
kubectl get all
kubectl delete deployment my-nginx
kubectl get all

## Scaling ReplicaSets
kubectl run my-apache --image httpd
kubectl get all
kubectl scale deploy/my-apache --replicas2
kubectl scale deployment my-apache --replicas2
kubectl get all

## Inspecting Kubernetes Objects
kubectl get pods
kubectl logs deployment/my-apache
kubectl logs deployment/my-apache --follow --tail 1
kubectl logs -l run=my-apache
kubectl get pods
kubectl describe pod/my-apache-<pod id>
kubectl get pods -w
kubectl delete pod/my-apache-<pod id>
kubectl get pods
kubectl delete deployment my-apache

# Exposing Kubernetes Ports

## Service Types
kubectl expose

## Creating a ClusterIP Service
kubectl get pods -w
kubectl create deployment httpenv --image=bretfisher/httpenv
kubectl scale deployment/httpenv --replicas=5
kubectl expose deployment/httpenv --port 8888
kubectl get service
kubectl run --generator run-pod/v1 tmp-shell --rm -it --image bretfisher/netshoot -- bash
curl httpenv:8888
curl [ip of service]:8888
kubectl get service

## Creating a NodePort and LoadBalancer Service
kubectl get all
kubectl expose deployment/httpenv --port 8888 --name httpenv-np --type NodePort
kubectl get services
curl localhost:32334
kubectl expose deployment/httpenv --port 8888 --name httpenv-lb --type LoadBalancer
kubectl get services
curl localhost:8888
kubectl delete service/httpenv service/httpenv-np
kubectl delete service/httpenv-lb deployment/httpenv

## Kubernetes Services DNS
curl <hostname>
kubectl get namespaces
curl <hostname>.<namespace>.svc.cluster.local

# Kubernetes Management Techniques

## Run, Expose and Create Generators
kubectl create deployment sample --image nginx --dry-run -o yaml
kubectl create deployment test --image nginx --dry-run
kubectl create deployment test --image nginx --dry-run -o yaml
kubectl create job test --image nginx -dry-run -o yaml
kubectl expose deployment/test --port 80 --dry-run -o -yaml
kubectl create deployment test --image nginx
kubectl expose deployment/test --port 80 --dry-run -o -yaml
kubectl delete deployment test

## The Future of Kubectl Run
kubectl run test --image nginx --dry-run
kubectl run test --image nginx --port 80 --expose --dry-run
kubectl run test --image nginx --restart OnFailure --dry-run
kubectl run test --image nginx --restart Never --dry-run
kubectl run test --image nginx --scheduled "*/1 * * * *" --dry-run

## Imperative vs. Declarative
kubectl apply -f my-resources.yaml
kubectl run

# Moving to Declarative Kubernetes YAML

## Kubectl Apply
kubectl apply -f filename.yml
kubectl apply -f myfile.yaml
kubectl apply -f myyaml/
kubectl apply -f https://bret.run/pod.yml
curl -L https://bret.run/pod
start https://bret.run/pod.yml

## Building Your YAML Files
kubectl api-resources
kubectl api-versions

## Dry Runs and Diffs
kubectl apply -f app.yml --dry-run
kubectl apply -f app.yml --server-dry-run
kubectl diff -f app.yml

## Labels and Label Selectors
kubectl get pods -l app=nginx
kubectl apply -f myfile.yaml -l app=nginx
kubectl get all
kubectl delete <resource type>/<resource name>

# Your Next Steps, and The Future of Kubernetes

## Kubernetes Dashboard
https://github.com/kubernetes/dashboard

## Namespaces and Context
kubectl get namespaces
kubectl get all -all-namespaces
~/.kube/config file
kubectl config get-contexts
kubectl config set*
